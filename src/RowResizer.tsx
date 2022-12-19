import React, { startTransition, useMemo } from "react";
import { Pressable, Animated, PanResponder } from "react-native";

import { useGrid } from "./VirtualizedGridContext";
import { ColumnObject, RowObject } from "./VirtualizedGridUtils";

export function RowResizer({
  column,
  row,
}: {
  column: ColumnObject;
  row: RowObject;
}) {
  const { virtualRows, onChangeRow, rowMinHeight } = useGrid();

  const panResponder = useMemo(() => {
    let bottomRows = [];

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
        row.heightAnimated.setOffset(row.height);
        bottomRows = [];
        for (const item of virtualRows.current) {
          if (item.rowIndex > row.rowIndex) {
            bottomRows.push(item);
            item.yAnimated.setOffset(item.y);
          }
        }
      },

      onPanResponderMove: (event, gestureState) => {
        startTransition(() => {
          __DEV__ && console.log("[resizer] move");
          if (row.height < rowMinHeight && gestureState.dy < 0) return;
          for (const item of bottomRows) {
            item.yAnimated.setValue(gestureState.dy);
          }
          row.heightAnimated.setValue(gestureState.dy);
          onChangeRow(row);
        });
      },

      onPanResponderRelease: () => {
        __DEV__ && console.log("[resizer] release");
        row.heightAnimated.flattenOffset();
        for (const item of bottomRows) {
          item.yAnimated.flattenOffset();
        }
        bottomRows = [];
      },
    });
  }, [row, virtualRows, onChangeRow]);

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        {
          position: "absolute",
          bottom: 0,
          left: 0,
          zIndex: 10,
          height: 20,
          width: column.width,
        },
      ]}
    >
      <Pressable
        style={[
          {
            display: "flex",
            justifyContent: "flex-end",
            width: column.width,
            height: 20,
          },
        ]}
      >
        {(state) => {
          const hovered = (state as unknown as any).hovered;
          return (
            <Animated.View
              style={[
                {
                  width: column.widthAnimated,
                  height: 0,
                },
                hovered && {
                  height: 5,
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
