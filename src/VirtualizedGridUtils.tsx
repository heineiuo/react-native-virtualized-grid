import { createRef, RefObject } from "react";
import { Animated } from "react-native";

import { CellMethods } from "./VirtualizedGridTypes";

export class CoordinateObject {
  constructor() {
    this.xAnimated = new Animated.Value(0);
    this.yAnimated = new Animated.Value(0);
    this.containerWidthAnimated = new Animated.Value(0);
    this.containerHeightAnimated = new Animated.Value(0);
    this.contentWidthAnimated = new Animated.Value(0);
    this.contentHeightAnimated = new Animated.Value(0);
    this.minXAnimated = Animated.subtract(
      this.containerWidthAnimated,
      this.contentWidthAnimated
    );
    this.minYAnimated = Animated.subtract(
      this.containerWidthAnimated,
      this.contentWidthAnimated
    );
  }

  xAnimated: Animated.Value;
  yAnimated: Animated.Value;
  minXAnimated: Animated.AnimatedSubtraction;
  minYAnimated: Animated.AnimatedSubtraction;
  containerWidthAnimated: Animated.Value;
  containerHeightAnimated: Animated.Value;
  contentWidthAnimated: Animated.Value;
  contentHeightAnimated: Animated.Value;

  move = (event: WheelEvent) => {
    const nextX = Math.min(0, Math.max(this.minX, this.x - event.deltaX));
    const nextY = Math.min(0, Math.max(this.minY, this.y - event.deltaY));

    this.xAnimated.setValue(nextX);
    this.yAnimated.setValue(nextY);
  };

  get minX(): number {
    return JSON.parse(JSON.stringify(this.minXAnimated));
  }
  get minY(): number {
    return JSON.parse(JSON.stringify(this.minYAnimated));
  }

  get x(): number {
    return JSON.parse(JSON.stringify(this.xAnimated));
  }
  get y(): number {
    return JSON.parse(JSON.stringify(this.yAnimated));
  }
  get contentWidth(): number {
    return JSON.parse(JSON.stringify(this.contentWidthAnimated));
  }
  get contentHeight(): number {
    return JSON.parse(JSON.stringify(this.contentHeightAnimated));
  }
  get containerWidth(): number {
    return JSON.parse(JSON.stringify(this.containerWidthAnimated));
  }
  get containerHeight(): number {
    return JSON.parse(JSON.stringify(this.containerHeightAnimated));
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
