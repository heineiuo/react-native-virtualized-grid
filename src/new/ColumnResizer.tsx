import { useMemo, useRef, useState } from "react";
import { Pressable, Animated, PanResponder } from "react-native";

import { useGrid } from "./VirtualizedGridContext";
import { ColumnObject } from "./VirtualizedGridUtils";

export function ColumnResizer({ column }: { column: ColumnObject }) {
  const { virtualColumns, debug, onChangeColumn, update, cellMinWidth } =
    useGrid();
  const [width] = useState(12);
  const [highlight, setHighlight] = useState(false);
  const stateID = useRef(null);

  const panResponder = useMemo(() => {
    let rightColumns = [];
    const internalValue = new Animated.Value(0);
    let disabled = false;

    return PanResponder.create({
      onPanResponderTerminate: (event, gestureState) => {
        debug && console.log("[resizer] onPanResponderTerminate");
      },
      onPanResponderTerminationRequest: (event, gestureState) => {
        debug && console.log("[resizer] onPanResponderTerminationRequest");
        return false;
      },
      onPanResponderReject: () => {
        debug && console.log("[resizer] onPanResponderReject");
      },

      onMoveShouldSetPanResponder: (event, gestureState) => {
        debug && console.log("[resizer] onMoveShouldSetPanResponder");
        return true;
      },

      onPanResponderGrant: (event, gestureState) => {
        debug && console.log("[resizer] grant");
        stateID.current = gestureState.stateID;
        internalValue.setOffset(column.width);
        internalValue.removeAllListeners();
        disabled = column.width <= cellMinWidth;
        internalValue.addListener(({ value }) => {
          debug && console.log("[resizer] internalValue", value);
          if (value <= cellMinWidth) {
            disabled = true;
          } else {
            disabled = false;
          }
        });

        column.widthAnimated.setOffset(column.width);
        rightColumns = [];
        for (const item of virtualColumns.current) {
          if (item.columnIndex > column.columnIndex) {
            rightColumns.push(item);
            item.xAnimated.setOffset(item.x);
          }
        }
        setHighlight(true);
      },

      onPanResponderMove: (event, gestureState) => {
        debug && console.log("[resizer] move");
        internalValue.setValue(gestureState.dx);
        if (stateID.current !== gestureState.stateID) {
          setHighlight(false);
          return;
        }
        if (disabled) {
          return;
        }

        for (const item of rightColumns) {
          item.xAnimated.setValue(gestureState.dx);
        }
        column.widthAnimated.setValue(gestureState.dx);
        onChangeColumn(column);
      },

      onPanResponderRelease: () => {
        debug && console.log("[resizer] release");
        column.widthAnimated.flattenOffset();
        for (const item of rightColumns) {
          item.xAnimated.flattenOffset();
        }
        rightColumns = [];
        update();
        setHighlight(false);

        internalValue.flattenOffset();
        internalValue.removeAllListeners();
      },
    });
  }, [column, virtualColumns, cellMinWidth, update, debug, onChangeColumn]);

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        {
          position: "absolute",
          zIndex: 10,
          top: 0,
          bottom: 0,
          width,
          right: -(width / 2),
        },
      ]}
    >
      <Pressable
        style={[
          {
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: "100%",
          },
        ]}
      >
        {(state) => {
          const hovered = (state as unknown as any).hovered;
          return (
            <Animated.View
              style={[
                {
                  width: 0,
                  height: "100%",
                },
                highlight && {
                  width: 3,
                  backgroundColor: "#0f0",
                },
              ]}
            />
          );
        }}
      </Pressable>
    </Animated.View>
  );
}
