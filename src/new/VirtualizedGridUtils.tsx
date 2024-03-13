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

export class ContentObject {
  constructor() {
    this._offsetX = 0;
    this._offsetY = 0;
    this.offsetXAnimated = new Animated.Value(0);
    this.offsetYAnimated = new Animated.Value(0);

    this._width = 0;
    this._height = 0;
    this.widthAnimated = new Animated.Value(0);
    this.heightAnimated = new Animated.Value(0);
  }

  _offsetX: number;
  _offsetY: number;
  offsetXAnimated: Animated.Value;
  offsetYAnimated: Animated.Value;

  _width: number;
  _height: number;
  widthAnimated: Animated.Value;
  heightAnimated: Animated.Value;

  set offsetX(val) {
    this._offsetX = 0;
    this.offsetXAnimated.setValue(val);
  }

  get offsetX() {
    return this._offsetX;
  }

  set offsetY(val) {
    this._offsetY = 0;
    this.offsetYAnimated.setValue(val);
  }

  get offsetY() {
    return this._offsetY;
  }

  set width(val) {
    this._width = 0;
    this.widthAnimated.setValue(val);
  }

  get width() {
    return this._width;
  }

  set height(val) {
    this._height = 0;
    this.heightAnimated.setValue(val);
  }

  get height() {
    return this._height;
  }
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
    this.focused = false;
  }

  columnIndex: number;
  freezed: boolean;
  xAnimated: Animated.Value;
  widthAnimated: Animated.Value;
  zIndexAnimated: Animated.Value;
  highlightOpacityAnimated: Animated.Value;
  focused: boolean;

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
    this.focused = false;
  }

  rowIndex: number;
  yAnimated: Animated.Value;
  heightAnimated: Animated.Value;
  freezed: boolean;
  zIndexAnimated: Animated.Value;
  highlightOpacityAnimated: Animated.Value;
  focused: boolean;

  get y(): number {
    return JSON.parse(JSON.stringify(this.yAnimated));
  }

  get height(): number {
    return JSON.parse(JSON.stringify(this.heightAnimated));
  }
}

export class FreezedArea {
  leftAnimated: Animated.Value;
  topAnimated: Animated.Value;
  rightAnimated: Animated.Value;
  bottomAnimated: Animated.Value;

  constructor() {
    this.leftAnimated = new Animated.Value(0);
    this.topAnimated = new Animated.Value(0);
    this.rightAnimated = new Animated.Value(0);
    this.bottomAnimated = new Animated.Value(0);
  }

  get left() {
    return JSON.parse(JSON.stringify(this.leftAnimated));
  }
  get top() {
    return JSON.parse(JSON.stringify(this.topAnimated));
  }
  get right() {
    return JSON.parse(JSON.stringify(this.rightAnimated));
  }
  get bottom() {
    return JSON.parse(JSON.stringify(this.bottomAnimated));
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

export class FocusedObject extends EventTarget {
  constructor(
    { column, row }: { column?: ColumnObject; row?: RowObject } = {
      column: null,
      row: null,
    }
  ) {
    super();
    this.state = { column, row, focused: !!(column && row) };
  }

  update(
    {
      column = null,
      row = null,
    }: {
      column?: ColumnObject;
      row?: RowObject;
    } = {
      column: null,
      row: null,
    }
  ) {
    if (this.state.focused) {
      this.state.column.focused = false;
      this.state.row.focused = false;
    }
    const focused = !!(column && row);
    this.state = { column, row, focused };
    if (focused) {
      this.state.row.focused = true;
      this.state.column.focused = true;
    }
    this.dispatchEvent(new Event("change"));
  }

  get focused() {
    return this.state.focused;
  }

  get column() {
    return this.state.column;
  }

  get row() {
    return this.state.row;
  }

  private state: {
    focused: boolean;
    column: ColumnObject | null;
    row: RowObject | null;
  };
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
