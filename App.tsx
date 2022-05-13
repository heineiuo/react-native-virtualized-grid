import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Platform,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { AutoHideActivityIndicator } from "./docs/AutoHideActivityIndicator";
import { Header } from "./docs/Header";
import {
  VirtualizedGrid,
  ColumnResizer,
  ColumnObject,
  RowObject,
  RowResizer,
  ColumnReorder,
} from "./src/index";

export default function App() {
  const { width, height } = useWindowDimensions();
  const columnWidthCache = useRef(new Map<string, number>());
  const rowHeightCache = useRef(new Map<string, number>());

  const updateColumn = useCallback((column: ColumnObject) => {
    columnWidthCache.current.set(`${column.columnIndex}`, column.width);
  }, []);
  const updateRow = useCallback((row: RowObject) => {
    rowHeightCache.current.set(`${row.rowIndex}`, row.height);
  }, []);

  const onChangeColumnOrder = useCallback(
    (options: { fromIndex: number; toIndex: number }) => {
      console.log(options);
    },
    []
  );

  useLayoutEffect(() => {
    if (Platform.OS === "web") {
      document.body.style.overflow = "hidden";
    }
  }, []);
  return (
    <>
      <Header />

      <VirtualizedGrid
        debug={__DEV__}
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
          if (columnWidthCache.current.has(`${info.columnIndex}`)) {
            return columnWidthCache.current.get(`${info.columnIndex}`);
          }
          const random = Math.round(Math.random() * 100);
          return [50, 140, 200, 120][info.columnIndex % 4];
        }}
        getRowHeight={(info: { rowIndex: number }) => {
          if (rowHeightCache.current.has(`${info.rowIndex}`)) {
            return rowHeightCache.current.get(`${info.rowIndex}`);
          }
          const random = Math.round(Math.random() * 100);

          return [40, 50, 60, 90, 40, 45, 40, 50, 55, 50][info.rowIndex % 10];
        }}
        onChangeColumn={updateColumn}
        onChangeColumnOrder={onChangeColumnOrder}
        onChangeRow={updateRow}
        onChangeVisibleArea={(event) => {
          // console.log("onChangeVisibleArea", event);
        }}
        renderCell={({ column, row }) => {
          return (
            <View
              style={{
                flex: 1,
                backgroundColor:
                  row.rowIndex % 2 === 1 ? "rgb(246, 248, 250)" : "#fff",
                borderTopWidth: 1,
                borderLeftWidth: 1,
                borderColor: "rgb(216, 222, 228)",
                padding: 4,
                borderRightWidth: column.columnIndex === 0 ? 1 : 0,
                borderBottomWidth: row.rowIndex === 0 ? 1 : 0,
              }}
            >
              {column.columnIndex === 0 && row.rowIndex === 0 && null}
              {row.rowIndex === 0 && column.columnIndex > 0 && (
                <>
                  <ColumnReorder row={row} column={column}>
                    <>
                      <Text>c: {column.columnIndex}</Text>
                      <Text>r: {row.rowIndex}</Text>
                    </>
                  </ColumnReorder>
                  <ColumnResizer row={row} column={column} />
                </>
              )}
              {column.columnIndex === 0 && row.rowIndex > 0 && (
                <>
                  <>
                    <Text>c: {column.columnIndex}</Text>
                    <Text>r: {row.rowIndex}</Text>
                  </>
                  <RowResizer row={row} column={column} />
                </>
              )}
              {column.columnIndex > 0 && row.rowIndex > 0 && (
                <>
                  {/* <AutoHideActivityIndicator
                    key={`${columnIndex}/${rowIndex}`}
                  /> */}
                  <Text>c: {column.columnIndex}</Text>
                  <Text>r: {row.rowIndex}</Text>
                </>
              )}
              <Animated.View
                style={[
                  {
                    position: "absolute",
                    left: 0,
                    top: -1,
                    bottom: -1,
                    width: 2,
                    backgroundColor: "blue",
                    opacity: column.highlightOpacityAnimated,
                  },
                  Platform.select({
                    web: {
                      pointerEvents: "none",
                    } as unknown as any,
                  }),
                ]}
              />
            </View>
          );
        }}
      />
    </>
  );
}
