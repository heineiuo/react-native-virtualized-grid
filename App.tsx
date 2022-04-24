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
      columnCount={30}
      rowCount={100}
      showColumnLine={false}
      showRowLine={false}
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
          <View
            style={{
              flex: 1,
              backgroundColor: info.rowIndex % 2 === 1 ? "#eee" : "#fff",
              borderTopWidth: 1,
              borderLeftWidth: 1,
              borderColor: "#ccc",
            }}
          >
            <Text>c: {info.columnIndex}</Text>
            <Text>r: {info.rowIndex}</Text>
          </View>
        );
      }}
    />
  );
}
