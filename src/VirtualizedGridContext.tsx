import { createContext, MutableRefObject, useContext } from "react";
import { Animated } from "react-native";

import { CellObject, ColumnObject, RowObject } from "./VirtualGridUtils";

export type VirtualizedGridState = {
  virtualColumns: MutableRefObject<ColumnObject[]>;
  virtualCells: MutableRefObject<CellObject[]>;
  virtualRows: MutableRefObject<RowObject[]>;
  coordinate: MutableRefObject<Animated.ValueXY>;
  containerSize: MutableRefObject<Animated.ValueXY>;
  updateCoordinate: (event: { deltaX: number; deltaY: number }) => void;
  onChangeColumn: (column: ColumnObject) => void;
  onChangeRow: (row: RowObject) => void;
};

export const VirtualizedGridContext = createContext({} as VirtualizedGridState);
export const useGrid = () => useContext(VirtualizedGridContext);
