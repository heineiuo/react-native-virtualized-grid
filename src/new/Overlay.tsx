import { Animated } from "react-native";

import { ColumnObject, RowObject } from "./VirtualizedGridUtils";

export function Overlay({
  column,
  row,
}: {
  column: ColumnObject;
  row: RowObject;
}) {
  if (column && row) {
    return (
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          borderWidth: 2,
          borderColor: "#0f0",
          zIndex: Animated.add(column.zIndexAnimated, row.zIndexAnimated),
          width: Animated.add(-1, column.widthAnimated),
          height: Animated.add(-1, row.heightAnimated),
          transform: [
            {
              translateX: Animated.add(1, column.xAnimated),
            },
            {
              translateY: Animated.add(1, row.yAnimated),
            },
          ],
        }}
      />
    );
  }
  return null;
}
