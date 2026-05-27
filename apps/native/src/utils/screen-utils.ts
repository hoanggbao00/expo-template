import { Dimensions, PixelRatio } from "react-native";

const { width, height } = Dimensions.get("window");

// Design file
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = (size: number): number => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number): number => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5): number => size + (scale(size) - size) * factor;

// FONT SCALING
// Usage: nf(16)
const normalizeFont = (size: number): number => {
  const newSize = scale(size);

  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// DYNAMIC DIMENSION CONSTANTS
// Usage: wp(5), hp(20)
const widthPercentageToDP = (widthPercent: string): number => {
  // Convert string input to decimal number
  const elemWidth = Number.parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((width * elemWidth) / 100);
};
const heightPercentageToDP = (heightPercent: string): number => {
  // Convert string input to decimal number
  const elemHeight = Number.parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((height * elemHeight) / 100);
};

// Usage: wpx(141), hpx(220)
const widthFromPixel = (widthPx: number): number => widthPx * (width / guidelineBaseWidth);
const heightFromPixel = (heightPx: number): number => heightPx * (height / guidelineBaseHeight);

export {
  heightPercentageToDP as hp,
  heightFromPixel as hpx,
  moderateScale,
  normalizeFont as nf,
  scale,
  verticalScale,
  widthPercentageToDP as wp,
  widthFromPixel as wpx,
};
