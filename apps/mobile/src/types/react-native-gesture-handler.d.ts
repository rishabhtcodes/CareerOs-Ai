declare module "react-native-gesture-handler" {
  import type { ComponentType, PropsWithChildren } from "react";
  import type { ViewProps } from "react-native";

  export const GestureHandlerRootView: ComponentType<PropsWithChildren<ViewProps>>;
}
