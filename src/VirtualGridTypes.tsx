import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { ColumnObject, RowObject } from "./VirtualGridUtils";

export type CellMethods = {
  update: (info: { rowIndex: number; columnIndex: number }) => ReactNode;
};

export type VirtualizedGridProps = {
  style?: StyleProp<ViewStyle>;
  freezedColumns?: {
    /**
     * how many columns should be freezed to left
     */
    start?: number;
    /**
     * how many columns should be freezed to right
     */
    end?: number;
  };
  freezedRows?: {
    /**
     * how many rows should be freezed to top
     */
    start?: number;
    /**
     * how many rows should be freezed to bottom
     */
    end?: number;
  };
  columnCount: number;
  rowCount: number;
  showRowLine?: boolean;
  showColumnLine?: boolean;
  getColumnWidth?: (info: { columnIndex: number }) => number;
  getRowHeight?: (info: { rowIndex: number }) => number;
  renderCell: (info: {
    columnIndex: number;
    rowIndex: number;
    row: RowObject;
    column: ColumnObject;
  }) => ReactNode;
};
