import React, { useLayoutEffect } from "react";
import { Platform, Text, useWindowDimensions, View } from "react-native";

import { Header } from "./docs/Header";
import { VirtualizedGrid, ColumnResizer } from "./src/index";

export default function App() {
  const { width, height } = useWindowDimensions();
  useLayoutEffect(() => {
    if (Platform.OS === "web") {
      document.body.style.overflow = "hidden";
    }
  }, []);
  return (
    <>
      <Header />

      <VirtualizedGrid
        columnCount={Number.MAX_SAFE_INTEGER}
        rowCount={Number.MAX_SAFE_INTEGER}
        freezedColumns={{ start: 1 }}
        freezedRows={{ start: 1 }}
        style={[
          {
            // borderWidth: 1,
            borderColor: "#fff",
            width,
            height: height - 56,
          },
          Platform.select({
            web: {
              userSelect: "none",
            },
          }) as unknown,
        ]}
        getColumnWidth={(info: { columnIndex: number }) => {
          return [50, 140, 200, 120][info.columnIndex % 4];
        }}
        getRowHeight={(info: { rowIndex: number }) => {
          return [40, 50, 60, 90, 40, 45, 40, 50, 55, 50, 60][
            info.rowIndex % 10
          ];
        }}
        renderCell={(info) => {
          return (
            <View
              style={{
                flex: 1,
                backgroundColor:
                  info.rowIndex % 2 === 1 ? "rgb(246, 248, 250)" : "#fff",
                borderTopWidth: 1,
                borderLeftWidth: 1,
                borderColor: "rgb(216, 222, 228)",
                padding: 4,
                borderRightWidth: info.columnIndex === 0 ? 1 : 0,
                borderBottomWidth: info.rowIndex === 0 ? 1 : 0,
              }}
            >
              {info.columnIndex === 0 && info.rowIndex === 0 ? null : (
                <>
                  <Text>c: {info.columnIndex}</Text>
                  <Text>r: {info.rowIndex}</Text>
                </>
              )}
              {info.rowIndex === 0 && (
                <ColumnResizer row={info.row} column={info.column} />
              )}
            </View>
          );
        }}
      />
    </>
  );
}
