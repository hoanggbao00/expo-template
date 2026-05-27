import { Toaster, type ToasterProps } from "sonner-native";

export { toast as toastNative } from "sonner-native";

export const ToasterNative = ({ ...props }: ToasterProps) => {
  return <Toaster position="top-center" duration={3000} {...props} />;
};
