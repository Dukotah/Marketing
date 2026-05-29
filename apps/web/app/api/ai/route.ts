import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { streamChatResponse } from "@/lib/ai/agent";
import { AIMessageRole } from "@launchpad/shared";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check AI prompt limits
    const { data: org } = await supabase
      .from("organizations")
      .select(
        "ai_prompts_used_this_month, subscription_tier, name, industry, website"
      )
      .eq("owner_id", user.id)
      .single();

    // Basic rate limit check (tier limits enforced here)
    const tierLimits: Record<string, number> = {
      FREE: 10,
      STARTER: 100,
      GROWTH: 500,
      PRO: 99999,
    };

    const tier = org?.subscription_tier || "FREE";
    const limit = tierLimits[tier] || 10;
    const used = org?.ai_prompts_used_this_month || 0;

    if (used >= limit) {
      return NextResponse.json(
        {
          error: `You've reached your monthly AI prompt limit (${limit}). Please upgrade your plan.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Validate messages
    const validRoles = [AIMessageRole.USER, AIMessageRole.ASSISTANT];
    const validMessages = messages.filter((m) =>
      validRoles.includes(m.role) && typeof m.content === "string"
    );

    if (validMessages.length === 0) {
      return NextResponse.json(
        { error: "No valid messages" },
        { status: 400 }
      );
    }

    const stream = await streamChatResponse({
      messages: validMessages,
      organizationContext: org
        ? {
            name: org.name,
            industry: org.industry,
            website: org.website,
          }
        : undefined,
    });

    // Increment usage counter in background
    supabase
      .from("organizations")
      .update({ ai_prompts_used_this_month: used + 1 })
      .eq("owner_id", user.id)
      .then(() => {});

    // Stream the response using SSE
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            const data = JSON.stringify(event);
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("AI API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
