import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { ColumnObject, RowObject } from "./VirtualizedGridUtils";

export type CellMethods = {
  update: (info: { rowIndex: number; columnIndex: number }) => ReactNode;
};

export type CellProps = {
  column: ColumnObject;
  row: RowObject;
  renderCell: (info: { column: ColumnObject; row: RowObject }) => ReactNode;
};

export type VirtualizedGridProps = {
  style?: StyleProp<ViewStyle>;
  freezedColumns?: {
    /**
     * how many columns should be freezed to left
     */
    start?: number;
  };
  freezedRows?: {
    /**
     * how many rows should be freezed to top
     */
    start?: number;
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
  onChangeColumn?: (column: ColumnObject) => void;
  onChangeRow?: (row: RowObject) => void;
  /**
   * change row order event handler
   */
  onChangeRowOrder?: (options: { fromIndex: number; toIndex: number }) => void;
  /**
   * change column order event handler
   */
  onChangeColumnOrder?: (options: {
    fromIndex: number;
    toIndex: number;
  }) => void;

  /**
   * visible area changed
   */
  onChangeVisibleArea?: (event: {
    minRow: RowObject;
    maxRow: RowObject;
    minColumn: ColumnObject;
    maxColumn: ColumnObject;
  }) => void;
};
