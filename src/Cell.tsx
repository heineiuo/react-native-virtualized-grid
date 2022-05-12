import { Animated } from "react-native";

import { CellProps } from "./VirtualizedGridTypes";

export function Cell({ renderCell, column, row }: CellProps) {
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
      {renderCell({ column, row })}
    </Animated.View>
  );
}
