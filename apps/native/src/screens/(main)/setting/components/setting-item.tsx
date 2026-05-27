import { Icon, PressableOpacity, Text, View } from "@/components/tw";
import { hpx, wpx } from "@/utils/screen-utils";
import { Link } from "expo-router";

interface SettingItemProps {
  icon?: React.ReactNode;
  label: string;
  right?: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  href?: AppRoute;
}

const SettingItemContent = ({ icon, label, right, onPress, onLongPress }: Omit<SettingItemProps, "href">) => {
  return (
    <PressableOpacity
      className="flex-row items-center gap-2 rounded-8 bg-background-secondary px-4 py-3"
      style={{ height: hpx(52) }}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {icon}
      <View className="flex-1 pl-1">
        <Text name="14.semibold.text-primary">{label}</Text>
      </View>
      {right}
      <Icon name="chevron-right" className="text-icon-primary" size={wpx(24)} />
    </PressableOpacity>
  );
};

export const SettingItem = ({ icon, label, right, onPress, onLongPress, href }: SettingItemProps) => {
  const Comp = (
    <SettingItemContent icon={icon} label={label} right={right} onPress={onPress} onLongPress={onLongPress} />
  );

  if (!href) {
    return Comp;
  }

  return (
    <Link href={href} asChild>
      {Comp}
    </Link>
  );
};
