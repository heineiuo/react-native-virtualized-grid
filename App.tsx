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
      columnCount={1000}
      rowCount={1000}
      style={{
        borderWidth: 1,
        borderColor: "#000",
        width,
        height,
      }}
      getColumnWidth={(info: { columnIndex: number }) => {
        return [100, 140, 200, 120][info.columnIndex % 4];
      }}
      getRowHeight={(info: { rowIndex: number }) => {
        return [40, 50, 60, 90, 40, 45, 40, 50, 55, 50, 60][info.rowIndex % 10];
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
