import { Redirect } from "expo-router";

// This redirects to the main tab navigator
// In a real app, you'd check auth state here first
export default function Index() {
  return <Redirect href="/(auth)/login" />;
}
