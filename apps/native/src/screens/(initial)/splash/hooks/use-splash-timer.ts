import { MAX_SPLASH_SCREEN_DURATION, MIN_SPLASH_SCREEN_DURATION } from "@/app-constants";
import { useEffect, useRef, useState } from "react";

interface Options {
  enabled?: boolean;
  min?: number;
  max?: number;
}

type Timer = ReturnType<typeof setTimeout>;

export const useSplashTimer = (options: Options = {}) => {
  const { enabled = true, min = MIN_SPLASH_SCREEN_DURATION, max = MAX_SPLASH_SCREEN_DURATION } = options;

  const [minTimerPassed, setMinTimerPassed] = useState(false);
  const [maxTimerPassed, setMaxTimerPassed] = useState(false);

  const minTimer = useRef<Timer | null>(null);
  const maxTimer = useRef<Timer | null>(null);

  useEffect(() => {
    if (!enabled) return;

    minTimer.current = setTimeout(() => {
      setMinTimerPassed(true);
    }, min);

    maxTimer.current = setTimeout(() => {
      setMaxTimerPassed(true);
    }, max);

    return () => {
      if (minTimer.current) clearTimeout(minTimer.current);
      if (maxTimer.current) clearTimeout(maxTimer.current);
    };
  }, [enabled, min, max]);

  const clearTimers = (type: "min" | "max" | "all") => {
    switch (type) {
      case "min":
        if (minTimer.current) clearTimeout(minTimer.current);
        break;
      case "max":
        if (maxTimer.current) clearTimeout(maxTimer.current);
        break;
      case "all":
        if (minTimer.current) clearTimeout(minTimer.current);
        if (maxTimer.current) clearTimeout(maxTimer.current);
        break;
      default:
        break;
    }
  };

  return { minTimerPassed, maxTimerPassed, clearTimers };
};
