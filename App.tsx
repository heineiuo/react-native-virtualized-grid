import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { VirtualizedGrid } from "./src/index";

export default function App() {
  const { width, height } = useWindowDimensions();
  return (
    <VirtualizedGrid
      columnCount={Number.MAX_SAFE_INTEGER}
      rowCount={Number.MAX_SAFE_INTEGER}
      style={{
        borderWidth: 1,
        borderColor: "#000",
        width,
        height,
      }}
      renderCell={(info) => {
        return (
          <View>
            <Text>c: {info.columnIndex}</Text>
            <Text>r: {info.rowIndex}</Text>
          </View>
        );
      }}
    />
  );
}
