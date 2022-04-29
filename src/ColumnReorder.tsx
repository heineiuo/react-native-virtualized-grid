import React, { ReactNode, useMemo } from "react";
import { Animated, PanResponder } from "react-native";

import { useGrid } from "./VirtualizedGridContext";
import { ColumnObject, RowObject } from "./VirtualizedGridUtils";

export function ColumnReorder({
  column,
  row,
  children,
}: {
  column: ColumnObject;
  row: RowObject;
  children?: ReactNode;
}) {
  const { virtualColumns, onChangeColumnOrder } = useGrid();

  const panResponder = useMemo(() => {
    let startX = 0;
    let highlightColumn: ColumnObject | null = null;
    let startColumnIndex = 0;

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
        startX = column.x + event.nativeEvent.locationX;
        startColumnIndex = column.columnIndex;
      },

      onPanResponderMove: (event, gestureState) => {
        __DEV__ && console.log("[reorder] move", gestureState.dx);
        for (const item of virtualColumns.current) {
          const itemCenterX = item.x + item.width / 2;
          if (
            Math.abs(itemCenterX - startX - gestureState.dx) <
            item.width / 2
          ) {
            console.log("highlightcolumn", item.columnIndex);
            if (highlightColumn === item) {
              break;
            }
            if (highlightColumn) {
              highlightColumn.highlightOpacityAnimated.setValue(0);
            }
            highlightColumn = item;
            highlightColumn.highlightOpacityAnimated.setValue(1);
            break;
          }
        }
      },

      onPanResponderRelease: () => {
        __DEV__ && console.log("[reorder] release");
        if (highlightColumn) {
          highlightColumn.highlightOpacityAnimated.setValue(0);
          if (startColumnIndex !== highlightColumn.columnIndex) {
            onChangeColumnOrder({
              fromIndex: startColumnIndex,
              toIndex: highlightColumn.columnIndex,
            });
          }
        }
      },
    });
  }, [column, onChangeColumnOrder, virtualColumns]);

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
