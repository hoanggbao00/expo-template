import { SafeAreaView, Text } from "@/components/tw";
import { Link } from "expo-router";

export default function NotFoundScreen() {
  return (
    <SafeAreaView className="flex-1 flex-center bg-background">
      <Text>This screen doesn't exist.</Text>

      <Link href="/home">
        <Text>Go to home screen!</Text>
      </Link>
    </SafeAreaView>
  );
}
