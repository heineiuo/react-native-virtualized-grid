import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { ColumnObject, RowObject } from "./VirtualizedGridUtils";

export type CellMethods = {
  update: (info: { rowIndex: number; columnIndex: number }) => ReactNode;
};

export type CellProps = {
  column: ColumnObject;
  row: RowObject;
  renderCell: (info: {
    column: ColumnObject;
    row: RowObject;
    focused: boolean;
  }) => ReactNode;
  focus: (info: { column: ColumnObject; row: RowObject }) => void;
  focused?: boolean;
};

export type VirtualizedGridProps = {
  /**
   * 单元格最小宽度
   */
  cellMinWidth?: number;
  /**
   * 单元格最小高度
   */
  cellMinHeight?: number;
  debug?: boolean;
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
    focused: boolean;
    row: RowObject;
    column: ColumnObject;
  }) => ReactNode;

  renderRow?: (info: { row: RowObject }) => ReactNode;
  renderColumn?: (info: { column: ColumnObject }) => ReactNode;
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

export type VirtualizedGridMethods = {
  forceUpdate: () => void;
};
