import { Icon, PressableOpacity, Text, View } from "@/components/tw";
import { cn } from "@packages/utils/cn";
import { wpx } from "@/utils/screen-utils";
import { router } from "expo-router";

interface HeaderLayoutProps {
  title?: string;
  right?: React.ReactNode;
  onBackPress?: () => void;
  className?: string;
}

export default function HeaderLayout({ title, right, onBackPress, className }: HeaderLayoutProps) {
  const handleGoBack = () => {
    // Prefer dismiss to unmount the screen
    if (router.canDismiss()) {
      router.dismiss();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.dismissTo("/home");
    }
    return true;
  };

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      handleGoBack();
    }
  };

  return (
    <View className={cn("flex-row items-center justify-between py-2", className)}>
      {title && (
        <View className="absolute inset-0 flex-center">
          <Text name="16.semibold.text-primary" className="capitalize" center>
            {title}
          </Text>
        </View>
      )}

      <PressableOpacity onPress={handleBackPress} hitSlop={10}>
        <Icon name="chevron-left" className="text-icon-primary" size={wpx(24)} />
      </PressableOpacity>

      {right}
    </View>
  );
}
