import Flag from "@/components/flag";
import { Text } from "@/components/tw";

import { PressableOpacity, View } from "@/components/tw";
import type { LanguageItem as LanguageItemType } from "@/i18n/languages";

interface LanguageItemProps extends LanguageItemType {
  isSelected?: boolean;
  onPress?: () => void;
}

export const LanguageItem = ({ name, flag, isSelected, onPress }: LanguageItemProps) => {
  return (
    <PressableOpacity
      className="flex-row items-center justify-between rounded-12 bg-background-secondary p-3"
      onPress={onPress}
    >
      <View className="flex-row items-center gap-3">
        <Flag code={flag} />
        <Text name="16.regular.text-primary">{name}</Text>
      </View>

      <View>
        <View className="size-6 rounded-full border-2 border-action">
          {isSelected && <View className="absolute inset-1 rounded-full bg-action" />}
        </View>
      </View>
    </PressableOpacity>
  );
};
