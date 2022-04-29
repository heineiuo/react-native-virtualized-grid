import { forwardRef, ReactNode, useImperativeHandle, useState } from "react";
import { Animated } from "react-native";

import { CellMethods } from "./VirtualizedGridTypes";
import { ColumnObject, RowObject } from "./VirtualizedGridUtils";

export const Cell = forwardRef<
  CellMethods,
  {
    coordinate: Animated.AnimatedValueXY;
    column: ColumnObject;
    row: RowObject;
    renderCell: (info: {
      columnIndex: number;
      rowIndex: number;
      column: ColumnObject;
      row: RowObject;
    }) => ReactNode;
  }
>(({ renderCell, column, row, coordinate }, ref) => {
  const [data, setData] = useState({
    rowIndex: row.rowIndex,
    columnIndex: column.columnIndex,
  });

  useImperativeHandle(
    ref,
    () => {
      return {
        update: (data) => {
          setData(data);
        },
      } as CellMethods;
    },
    []
  );

  return (
    <Animated.View
      style={{
        position: "absolute",
        width: column.widthAnimated,
        zIndex: Animated.add(column.zIndexAnimated, row.zIndexAnimated),
        height: row.heightAnimated,
        transform: [
          {
            translateX: column.freezed
              ? column.xAnimated
              : Animated.add(column.xAnimated, coordinate.x),
          },
          {
            translateY: row.freezed
              ? row.yAnimated
              : Animated.add(row.yAnimated, coordinate.y),
          },
        ],
      }}
    >
      {renderCell({ ...data, column, row })}
    </Animated.View>
  );
});
