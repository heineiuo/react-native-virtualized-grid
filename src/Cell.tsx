import { forwardRef, ReactNode, useImperativeHandle, useState } from "react";
import { Animated } from "react-native";

import { CellMethods } from "./VirtualGridTypes";
import { ColumnObject, RowObject } from "./VirtualGridUtils";

export const Cell = forwardRef<
  CellMethods,
  {
    coordinate: Animated.AnimatedValueXY;
    column: ColumnObject;
    row: RowObject;
    renderCell: (info: { columnIndex: number; rowIndex: number }) => ReactNode;
  }
>(({ renderCell, column, row, coordinate }, ref) => {
  const [data, setData] = useState({
    rowIndex: row.rowIndex,
    columnIndex: column.columnIndex,
  });

  useImperativeHandle(ref, () => {
    return {
      update: (data) => {
        setData(data);
      },
    } as CellMethods;
  });

  return (
    <Animated.View
      style={{
        position: "absolute",
        width: column.widthAnimated,
        height: row.heightAnimated,
        transform: [
          { translateX: Animated.add(column.xAnimated, coordinate.x) },
          { translateY: Animated.add(row.yAnimated, coordinate.y) },
        ],
      }}
    >
      {renderCell(data)}
    </Animated.View>
  );
});
