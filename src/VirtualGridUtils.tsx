import { createRef, RefObject } from "react";
import { Animated } from "react-native";

import { CellMethods } from "./VirtualGridTypes";

export class ColumnObject {
  constructor({
    x,
    width,
    columnIndex,
  }: {
    x: number;
    width: number;
    columnIndex: number;
  }) {
    this.xAnimated = new Animated.Value(x);
    this.widthAnimated = new Animated.Value(width);
    this.columnIndex = columnIndex;
  }

  columnIndex: number;
  xAnimated: Animated.Value;
  widthAnimated: Animated.Value;

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
  }: {
    y: number;
    height: number;
    rowIndex: number;
  }) {
    this.yAnimated = new Animated.Value(y);
    this.heightAnimated = new Animated.Value(height);
    this.rowIndex = rowIndex;
  }

  rowIndex: number;
  yAnimated: Animated.Value;
  heightAnimated: Animated.Value;

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
