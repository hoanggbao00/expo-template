import { Image } from "@/components/tw";
import { cn } from "@packages/utils/cn";

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
}

export default function Flag({ code, size = 24, className }: FlagProps) {
  const width = size;

  return (
    <Image
      source={{ uri: flagUrl(code) }}
      style={{ width }}
      className={cn("aspect-square rounded-full", className)}
      contentFit="cover"
      contentPosition="center"
      cachePolicy="disk"
    />
  );
}
