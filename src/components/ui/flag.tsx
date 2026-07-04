import { Image } from "@/components/tw";
import { cn } from "@/lib/utils";
import type { ImageStyle, StyleProp } from "react-native";

const FLAG_CDN_URL = "https://flagcdn.com/w80/";
const FORMAT = ".png";

const flagUrl = (code: string) => {
  let countryCode = code.toLowerCase();
  if (countryCode.includes("-")) {
    countryCode = countryCode.split("-")[1];
  }
  return `${FLAG_CDN_URL}${countryCode}${FORMAT}`;
};

interface FlagProps {
  code: string;
  size?: number;
  className?: string;
  style?: StyleProp<ImageStyle>;
}

export function Flag({ code, size, className, style }: FlagProps) {
  const mergedStyle = [{ width: size }, style];

  return (
    <Image
      source={{ uri: flagUrl(code) }}
      style={mergedStyle}
      className={cn("rounded-full", className)}
      contentFit="cover"
      contentPosition="center"
      cachePolicy="disk"
      transition={300}
    />
  );
}
