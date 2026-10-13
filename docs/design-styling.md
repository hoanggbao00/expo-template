# Design and Styling

Uniwind is styling system. This project does not use NativeWind.

## Rules

- Use `className` on wrapped primitives from `@/components/tw`.
- Use `@/components/tw` exports instead of raw React Native components when a wrapper exists.
- Put reusable visual values in tokens, not repeated literals.
- Keep screen-private styles beside screen components.
- Use platform files only for meaningful platform differences; keep props identical.

## Components

`src/components/tw/` wraps native, third-party, and animated components with Uniwind:

- `View`, `ScrollView`, `Image`, `Pressable`, `TextInput`
- `Text` with font/color shorthand
- `Icon` backed by generated Nano Icons
- `SafeAreaView`, `KeyboardAvoidingView`, `AnimatedView`

## Tokens

- `src/styles/colors.css`: color variables
- `src/styles/colors.type.ts`: typed color names
- `src/styles/fonts.css`: font faces
- `src/styles/fonts.ts`: font map and weights
- `src/styles/utilities.css`: custom utilities
- `src/styles/gradients.ts`: shared gradients

Theme comes from Uniwind. `src/components/app-stack.tsx` maps theme colors into Expo Router navigation.
