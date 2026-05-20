import { PressableOpacity as PresstoPressableOpacity, PressableScale as PresstoPressableScale } from "pressto";
import { withUniwind } from "uniwind";

const ScaleComponent = withUniwind(PresstoPressableScale);
const OpacityComponent = withUniwind(PresstoPressableOpacity);

export const PressableScale = (props: React.ComponentProps<typeof ScaleComponent>) => <ScaleComponent {...props} />;
PressableScale.displayName = "CSS(PressableScale)";

export const PressableOpacity = (props: React.ComponentProps<typeof OpacityComponent>) => (
  <OpacityComponent {...props} />
);
PressableOpacity.displayName = "CSS(PressableOpacity)";
