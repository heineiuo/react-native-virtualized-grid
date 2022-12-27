import { createContext, MutableRefObject, useContext } from "react";
import { Animated } from "react-native";

import { CellObject, ColumnObject, RowObject } from "./VirtualizedGridUtils";

export type VirtualizedGridState = {
  virtualColumns: MutableRefObject<ColumnObject[]>;
  virtualRows: MutableRefObject<RowObject[]>;
  coordinate: MutableRefObject<{
    x: number;
    y: number;
    xAnimated: Animated.Value;
    yAnimated: Animated.Value;
  }>;
  rowMinHeight: number;
  columnMinWidth: number;
  containerSize: MutableRefObject<{ width: number; height: number }>;
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
