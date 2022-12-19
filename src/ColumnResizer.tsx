import React, { startTransition, useMemo } from "react";
import { Pressable, Animated, PanResponder } from "react-native";

import { useGrid } from "./VirtualizedGridContext";
import { ColumnObject, RowObject } from "./VirtualizedGridUtils";

export function ColumnResizer({
  column,
  row,
}: {
  column: ColumnObject;
  row: RowObject;
}) {
  const { virtualColumns, onChangeColumn, columnMinWidth } = useGrid();

  const panResponder = useMemo(() => {
    let rightColumns = [];

    return PanResponder.create({
      onPanResponderTerminate: (event, gestureState) => {
        __DEV__ && console.log("[resizer] onPanResponderTerminate");
      },
      onPanResponderTerminationRequest: (event, gestureState) => {
        __DEV__ && console.log("[resizer] onPanResponderTerminationRequest");
        return false;
      },
      onPanResponderReject: () => {
        __DEV__ && console.log("[resizer] onPanResponderReject");
      },

      onMoveShouldSetPanResponder: (event, gestureState) => {
        __DEV__ && console.log("[resizer] onMoveShouldSetPanResponder");
        return true;
      },

      onPanResponderGrant: () => {
        __DEV__ && console.log("[resizer] grant");
        column.widthAnimated.setOffset(column.width);
        rightColumns = [];
        for (const item of virtualColumns.current) {
          if (item.columnIndex > column.columnIndex) {
            rightColumns.push(item);
            item.xAnimated.setOffset(item.x);
          }
        }
      },

      onPanResponderMove: (event, gestureState) => {
        // ? 想用startTransition做性能优化，不确定是否必要
        startTransition(() => {
          __DEV__ && console.log("[resizer] move:");
          // column.width <= columnMinWidth 判断当前column会不会盖住前一个column
          // gestureState.dx < 0 防止column达到最小宽度时无法拖拽
          if (column.width <= columnMinWidth && gestureState.dx < 0) return;
          for (const item of rightColumns) {
            item.xAnimated.setValue(gestureState.dx);
          }
          column.widthAnimated.setValue(gestureState.dx);
          onChangeColumn(column);
        });
      },

      onPanResponderRelease: () => {
        __DEV__ && console.log("[resizer] release");
        column.widthAnimated.flattenOffset();
        for (const item of rightColumns) {
          item.xAnimated.flattenOffset();
        }
        rightColumns = [];
      },
    });
  }, [column, virtualColumns, columnMinWidth, onChangeColumn]);

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        {
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 10,
          height: row.height,
          width: 20,
        },
      ]}
    >
      <Pressable
        style={[
          {
            display: "flex",
            alignItems: "flex-end",
            height: row.height,
          },
        ]}
      >
        {(state) => {
          const hovered = (state as unknown as any).hovered;
          return (
            <Animated.View
              style={[
                {
                  height: row.heightAnimated,
                  width: 0,
                },
                hovered && {
                  width: 5,
                  backgroundColor: "blue",
                },
              ]}
            />
          );
        }}
      </Pressable>
    </Animated.View>
  );
}
