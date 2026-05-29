import * as SecureStore from "expo-secure-store";

// Set EXPO_PUBLIC_API_URL in your EAS build secrets to your Vercel deployment URL
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://your-app.vercel.app";

async function getAuthToken(): Promise<string | null> {
  return SecureStore.getItemAsync("auth_token");
}

async function fetchWithAuth(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getAuthToken();
  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}

// ── Campaigns ──────────────────────────────────────────────────────────────

export async function getCampaigns() {
  const res = await fetchWithAuth("/api/campaigns");
  if (!res.ok) throw new Error("Failed to fetch campaigns");
  return res.json();
}

export async function createCampaign(data: {
  name: string;
  channels: string[];
  goals?: string;
  target_audience?: string;
  budget?: number;
}) {
  const res = await fetchWithAuth("/api/campaigns", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create campaign");
  return res.json();
}

// ── AI Chat (streaming) ────────────────────────────────────────────────────

export async function streamAIChat(
  messages: { role: "user" | "assistant"; content: string }[],
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: Error) => void
): Promise<() => void> {
  const token = await getAuthToken();
  const controller = new AbortController();

  fetch(`${API_BASE_URL}/api/ai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ messages }),
    signal: controller.signal,
  })
    .then(async (res) => {
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        onDone();
        return;
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              onDone();
              return;
            }
            try {
              const parsed = JSON.parse(data);
              if (
                parsed.type === "content_block_delta" &&
                parsed.delta?.text
              ) {
                onChunk(parsed.delta.text);
              }
            } catch {
              // skip
            }
          }
        }
      }
      onDone();
    })
    .catch((err) => {
      if (err.name !== "AbortError") onError(err);
    });

  return () => controller.abort();
}

// ── Auth ───────────────────────────────────────────────────────────────────

export async function saveAuthToken(token: string) {
  await SecureStore.setItemAsync("auth_token", token);
}

export async function clearAuthToken() {
  await SecureStore.deleteItemAsync("auth_token");
}
