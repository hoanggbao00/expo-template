import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { BackHandler } from "react-native";

type CallBackHandler = () => boolean;

export const useBackHandler = (callback?: CallBackHandler) => {
  const callbackRef = useRef<CallBackHandler | undefined>(callback);

  const registerSubscription = useCallback(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (callbackRef.current) {
        return callbackRef.current();
      }
      return false;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useFocusEffect(registerSubscription);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return null;
};
