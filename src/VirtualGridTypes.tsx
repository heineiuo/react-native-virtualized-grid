import { ReactNode } from "react";

export type CellMethods = {
  update: (info: { rowIndex: number; columnIndex: number }) => ReactNode;
};
