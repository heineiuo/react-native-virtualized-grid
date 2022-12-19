import "expo/build/Expo.fx";
import registerRootComponent from "expo/build/launch/registerRootComponent";
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { Platform } from "react-native";

import App from "./App";

// @see https://github.com/expo/expo/issues/18485
if (Platform.OS === "web") {
  const rootTag = createRoot(document.getElementById("root"));
  rootTag.render(createElement(App));
} else {
  registerRootComponent(App);
}
