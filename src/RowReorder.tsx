import React, { ReactNode, useMemo } from "react";
import { Animated, PanResponder } from "react-native";

import { useGrid } from "./VirtualizedGridContext";
import { ColumnObject, RowObject } from "./VirtualizedGridUtils";

export function RowReorder({
  column,
  row,
  children,
}: {
  column: ColumnObject;
  row: RowObject;
  children?: ReactNode;
}) {
  const { virtualRows, onChangeRowOrder } = useGrid();

  const panResponder = useMemo(() => {
    let startY = 0;
    let highlightRow: RowObject | null = null;
    let startRowIndex = 0;

    return PanResponder.create({
      onPanResponderTerminate: (event, gestureState) => {
        __DEV__ && console.log("[reorder] onPanResponderTerminate");
      },
      onPanResponderTerminationRequest: (event, gestureState) => {
        __DEV__ && console.log("[reorder] onPanResponderTerminationRequest");
        return false;
      },
      onPanResponderReject: () => {
        __DEV__ && console.log("[reorder] onPanResponderReject");
      },

      onMoveShouldSetPanResponder: (event, gestureState) => {
        __DEV__ && console.log("[reorder] onMoveShouldSetPanResponder");
        return true;
      },

      onPanResponderGrant: (event) => {
        __DEV__ && console.log("[reorder] grant");
        startY = row.y + event.nativeEvent.locationY;
        startRowIndex = row.rowIndex;
      },

      onPanResponderMove: (event, gestureState) => {
        __DEV__ && console.log("[reorder] move", gestureState.dx);
        for (const item of virtualRows.current) {
          const itemCenterY = item.y + item.height / 2;
          if (
            Math.abs(itemCenterY - startY - gestureState.dy) <
            item.height / 2
          ) {
            if (highlightRow === item) {
              break;
            }
            if (highlightRow) {
              highlightRow.highlightOpacityAnimated.setValue(0);
            }
            highlightRow = item;
            highlightRow.highlightOpacityAnimated.setValue(1);
            break;
          }
        }
      },

      onPanResponderRelease: () => {
        __DEV__ && console.log("[reorder] release");
        if (highlightRow) {
          highlightRow.highlightOpacityAnimated.setValue(0);
          if (startRowIndex !== highlightRow.rowIndex) {
            onChangeRowOrder({
              fromIndex: startRowIndex,
              toIndex: highlightRow.rowIndex,
            });
          }
        }
      },
    });
  }, [row, virtualRows, onChangeRowOrder]);

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        {
          position: "absolute",
          zIndex: 8,
          top: 0,
          left: 0,
          height: row.height,
          width: column.width,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
