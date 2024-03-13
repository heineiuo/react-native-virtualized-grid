import { useMemo, useSyncExternalStore } from "react";
import { Animated, Pressable } from "react-native";

import { useGrid } from "./VirtualizedGridContext";
import { CellProps } from "./VirtualizedGridTypes";

export function Cell({ renderCell, column, row, focus }: CellProps) {
  const { focused: focusedObject } = useGrid();

  // const focused2 = useMemo(() => {
  //   if (column.freezed || row.freezed) return false
  //   if (!focusedObject.current) return false
  //   if (!focusedObject.current.focused) return false
  //   return (
  //     column.columnIndex === focusedObject.current.column?.columnIndex &&
  //     row.rowIndex === focusedObject.current.row?.rowIndex
  //   )
  // }, [column, row, focusedObject])

  const focused = useSyncExternalStore(
    (notify) => {
      focusedObject.current.addEventListener("change", notify);
      return () => {
        focusedObject.current.removeEventListener("change", notify);
      };
    },
    () => {
      if (column.freezed || row.freezed) return false;
      if (!focusedObject.current) return false;
      if (!focusedObject.current.focused) return false;
      return (
        column.columnIndex === focusedObject.current.column?.columnIndex &&
        row.rowIndex === focusedObject.current.row?.rowIndex
      );
    }
  );

  const pointerEvents = useMemo(() => {
    if (column.freezed || row.freezed) return "none";
    return focused ? "none" : "auto";
  }, [focused, column, row]);

  return (
    <Animated.View
      style={{
        position: "absolute",
        width: column.widthAnimated,
        zIndex: Animated.add(column.zIndexAnimated, row.zIndexAnimated),
        height: row.heightAnimated,
        transform: [
          {
            translateX: column.xAnimated,
          },
          {
            translateY: row.yAnimated,
          },
        ],
      }}
    >
      {renderCell({ column, row, focused })}
      <Pressable
        pointerEvents={pointerEvents}
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        onPress={() => {
          focus({ column, row });
        }}
      />
    </Animated.View>
  );
}
