import { createRef, RefObject } from "react";
import { Animated } from "react-native";

import { CellMethods } from "./VirtualizedGridTypes";

export class CoordinateObject {
  constructor() {
    this._x = 0;
    this._y = 0;
    this.xAnimated = new Animated.Value(0);
    this.yAnimated = new Animated.Value(0);
    this.rowIndex = 0;
    this.columnIndex = 0;
    this.left = 0;
    this.top = 0;
  }

  /**
   * 左上角point的x方向的位移
   */
  _x: number;
  set x(val) {
    this._x = val;
    this.xAnimated.setValue(val);
  }
  get x() {
    return this._x;
  }
  /**
   * 左上角point的y方向的位移
   */
  _y: number;
  set y(val) {
    this._y = val;
    this.yAnimated.setValue(val);
  }
  get y() {
    return this._y;
  }
  /**
  /**
   * 左上角point的x方向的位移的动画值
   */
  xAnimated: Animated.Value;
  /**
   * 左上角point的y方向的位移的动画值
   */
  yAnimated: Animated.Value;
  /**
   * 左上角cell的row（非freezed）
   */
  rowIndex: number;
  /**
   * 左上角cell的column（非freezed）
   */
  columnIndex: number;
  /**
   * 左上角cell相对于container的左上角point的x方向的位移
   */
  left: number;
  /**
   * 左上角cell相对于container的左上角point的的y方向的位移
   */
  top: number;
}

export class ColumnObject {
  constructor({
    x,
    width,
    columnIndex,
    freezed = false,
  }: {
    x: number;
    width: number;
    columnIndex: number;
    freezed?: boolean;
  }) {
    this.xAnimated = new Animated.Value(x);
    this.widthAnimated = new Animated.Value(width);
    this.columnIndex = columnIndex;
    this.freezed = freezed;
    this.zIndexAnimated = new Animated.Value(freezed ? 1 : 0);
    this.highlightOpacityAnimated = new Animated.Value(0);
    this.recycled = false;
  }

  columnIndex: number;
  freezed: boolean;
  xAnimated: Animated.Value;
  widthAnimated: Animated.Value;
  zIndexAnimated: Animated.Value;
  highlightOpacityAnimated: Animated.Value;
  /**
   * 是否已经被回收，已经被回收的不显示
   */
  recycled: boolean;

  get x(): number {
    return JSON.parse(JSON.stringify(this.xAnimated));
  }
  get width(): number {
    return JSON.parse(JSON.stringify(this.widthAnimated));
  }
}

export class RowObject {
  constructor({
    y,
    height,
    rowIndex,
    freezed = false,
  }: {
    y: number;
    height: number;
    rowIndex: number;
    freezed?: boolean;
  }) {
    this.yAnimated = new Animated.Value(y);
    this.heightAnimated = new Animated.Value(height);
    this.rowIndex = rowIndex;
    this.freezed = freezed;
    this.zIndexAnimated = new Animated.Value(freezed ? 1 : 0);
    this.highlightOpacityAnimated = new Animated.Value(0);
    this.recycled = false;
  }

  rowIndex: number;
  yAnimated: Animated.Value;
  heightAnimated: Animated.Value;
  freezed: boolean;
  zIndexAnimated: Animated.Value;
  highlightOpacityAnimated: Animated.Value;
  /**
   * 是否已经被回收，已经被回收的不显示
   */
  recycled: boolean;

  get y(): number {
    return JSON.parse(JSON.stringify(this.yAnimated));
  }

  get height(): number {
    return JSON.parse(JSON.stringify(this.heightAnimated));
  }
}

export class CellObject {
  constructor({ column, row }: { column: ColumnObject; row: RowObject }) {
    this.column = column;
    this.row = row;
    this.ref = createRef();
  }

  ref: RefObject<CellMethods>;
  column: ColumnObject;
  row: RowObject;

  get x() {
    return this.column.x;
  }

  get y() {
    return this.row.y;
  }

  get width() {
    return this.column.width;
  }
  get height() {
    return this.row.height;
  }
}

export function forEachColumns(
  columns: ColumnObject[],
  options: {
    all?: boolean;
    afterIndex?: number;
    beforeIndex?: number;
  },
  callback: (item: ColumnObject) => void
) {
  for (const item of columns) {
    if (options.all) {
      callback(item);
    } else if (typeof options.afterIndex === "number") {
      if (item.columnIndex > options.afterIndex) {
        callback(item);
      }
    } else if (typeof options.beforeIndex === "number") {
      if (item.columnIndex < options.beforeIndex) {
        callback(item);
      }
    }
  }
}

export const animationConfig = {
  toValue: 1,
  stiffness: 1000,
  damping: 500,
  useNativeDriver: true,
};