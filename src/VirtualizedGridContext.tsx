import { createContext, MutableRefObject, useContext } from "react";
import { Animated } from "react-native";

import { CellObject, ColumnObject, RowObject } from "./VirtualizedGridUtils";

export type VirtualizedGridState = {
  virtualColumns: MutableRefObject<ColumnObject[]>;
  virtualCells: MutableRefObject<CellObject[]>;
  virtualRows: MutableRefObject<RowObject[]>;
  coordinate: MutableRefObject<Animated.ValueXY>;
  containerSize: MutableRefObject<Animated.ValueXY>;
  updateCoordinate: (event: { deltaX: number; deltaY: number }) => void;
  onChangeRow: (row: RowObject) => void;
  onChangeRowOrder: (options: { fromIndex: number; toIndex: number }) => void;
  onChangeColumn: (column: ColumnObject) => void;
  onChangeColumnOrder: (options: {
    fromIndex: number;
    toIndex: number;
  }) => void;
};

export const VirtualizedGridContext = createContext({} as VirtualizedGridState);
export const useGrid = () => useContext(VirtualizedGridContext);
