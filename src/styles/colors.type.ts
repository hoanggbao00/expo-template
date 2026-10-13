// PanelUI color tokens (without the `--color-` prefix) overridden in colors.css
export type SurfaceColor = "background" | "card" | "popover" | "overlay" | "surface" | "muted" | "secondary" | "accent";
export type TextColor =
  | "foreground"
  | "card-foreground"
  | "muted-foreground"
  | "secondary-foreground"
  | "accent-foreground"
  | "primary-foreground";
export type BrandColor = "primary" | "border" | "input" | "ring";
export type SemanticColor = "info" | "success" | "warning" | "destructive";

export type ThemeColor = SurfaceColor | TextColor | BrandColor | SemanticColor;
