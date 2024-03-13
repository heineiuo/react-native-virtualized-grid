import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, Animated, PanResponder, StyleSheet } from "react-native";

import { useGrid } from "./VirtualizedGridContext";
import { RowObject } from "./VirtualizedGridUtils";

export function RowResizer({ row }: { row: RowObject }) {
  const { virtualRows, debug, update, onChangeRow, cellMinHeight } = useGrid();
  const [highlight, setHighlight] = useState(false);
  const [height] = useState(8);
  const stateID = useRef(null);

  const panResponder = useMemo(() => {
    let bottomRows = [];
    const internalValue = new Animated.Value(0);
    let disabled = false;
    debug && console.log(`[resizer] panResponder rememo`);

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
        debug &&
          console.log(
            "[resizer] onMoveShouldSetPanResponder stateID",
            gestureState.stateID
          );
        return true;
      },

      onPanResponderGrant: (event, gestureState) => {
        debug && console.log("[resizer] grant");
        stateID.current = gestureState.stateID;

        internalValue.setOffset(row.height);
        internalValue.removeAllListeners();
        disabled = row.height <= cellMinHeight;
        internalValue.addListener(({ value }) => {
          debug && console.log("[resizer] internalValue", value);
          if (value <= cellMinHeight) {
            disabled = true;
          } else {
            disabled = false;
          }
        });

        row.heightAnimated.setOffset(row.height);
        bottomRows = [];
        for (const item of virtualRows.current) {
          if (item.rowIndex > row.rowIndex) {
            bottomRows.push(item);
            item.yAnimated.setOffset(item.y);
          }
        }
        setHighlight(true);
      },

      onPanResponderMove: (event, gestureState) => {
        debug && console.log("[resizer] move");
        internalValue.setValue(gestureState.dy);
        if (stateID.current !== gestureState.stateID) {
          setHighlight(false);
          return;
        }
        if (disabled) {
          return;
        }

        for (const item of bottomRows) {
          item.yAnimated.setValue(gestureState.dy);
        }
        row.heightAnimated.setValue(gestureState.dy);
        onChangeRow(row);
      },

      onPanResponderRelease: () => {
        debug && console.log("[resizer] release");
        row.heightAnimated.flattenOffset();
        for (const item of bottomRows) {
          item.yAnimated.flattenOffset();
        }
        bottomRows = [];
        update();
        setHighlight(false);

        internalValue.flattenOffset();
        internalValue.removeAllListeners();
      },
    });
  }, [row, virtualRows, debug, onChangeRow, cellMinHeight, update]);

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          bottom: -(height / 2),
          height,
        },
      ]}
    >
      <Pressable style={[styles.pressable]}>
        {(state) => {
          const hovered = (state as unknown as any).hovered;
          return (
            <Animated.View
              style={[
                styles.highlightLine,
                highlight && {
                  height: 3,
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

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 10,
    left: 0,
    right: 0,
  },

  pressable: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },

  highlightLine: {
    width: "100%",
    height: 0,
  },
  highlightLineHovered: {
    height: 2,
  },
});
