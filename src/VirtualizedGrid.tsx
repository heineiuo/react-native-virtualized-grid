import {
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Animated, Platform, View, ViewStyle } from "react-native";

import { Cell } from "./Cell";
import { CellObject, ColumnObject, RowObject } from "./VirtualGridUtils";

const minCellWidth = 100;
const minCellHeight = 40;

export function VirtualizedGrid({
  style,
  defaultColumnWidth = 100,
  defaultRowHeight = 40,
  columnCount,
  rowCount,
  renderCell,
}: {
  style?: ViewStyle;
  defaultColumnWidth?: number;
  defaultRowHeight?: number;
  columnCount: number;
  rowCount: number;
  renderCell: (info: { columnIndex: number; rowIndex: number }) => ReactNode;
}) {
  const view = useRef<View>(null);
  const [layoutCount, setLayoutCount] = useState(0);
  const virtualColumns = useRef<ColumnObject[]>([]);
  const virtualRows = useRef<RowObject[]>([]);
  const virtualCells = useRef<CellObject[]>([]);

  /**
   * 左上角的坐标
   */
  const coordinate = useRef(new Animated.ValueXY({ x: 0, y: 0 }));
  const containerSize = useRef(new Animated.ValueXY({ x: 0, y: 0 }));
  const contentSize = useRef(new Animated.ValueXY({ x: 0, y: 0 }));

  useEffect(() => {
    contentSize.current.setValue({
      x: columnCount * defaultColumnWidth,
      y: rowCount * defaultRowHeight,
    });
  }, [rowCount, columnCount, defaultColumnWidth, defaultRowHeight]);

  /**
   * 列宽和行高初始化时是默认值，但可以调整，调整后的值保存到columnWidthMap
   * 或rowHeightMap内
   *
   * 在移动列或者行的时候，查询map里是否有匹配的值，有的话则取代
   * defaultColumnWidth/defaultRowHeight来更新columnObject/rowObject
   */
  const columnWidthMap = useRef<Record<string, Animated.AnimatedValue>>({});
  const rowHeightMap = useRef<Record<string, Animated.AnimatedValue>>({});

  /**
   * init containerSize, virtualColumns, virtualRows
   */
  const onContainerLayout = useCallback((event) => {
    const { layout } = event.nativeEvent;
    containerSize.current.setValue({ x: layout.width, y: layout.height });

    const virtualColumnsCount = Math.round(layout.width / minCellWidth) + 1;
    const virtualRowsCount = Math.round(layout.height / minCellHeight) + 1;

    /**
     * 填满virtualRows和virtualColumns
     */
    let rowIndex = -1;
    while (virtualRowsCount > virtualRows.current.length) {
      if (virtualRows.current.length === 0) {
        virtualRows.current.push(
          new RowObject({ y: 0, height: minCellHeight, rowIndex: ++rowIndex })
        );
      } else {
        const prev = virtualRows.current[virtualRows.current.length - 1];
        virtualRows.current.push(
          new RowObject({
            y: prev.y + minCellHeight,
            height: minCellHeight,
            rowIndex: ++rowIndex,
          })
        );
      }
    }
    let columnIndex = -1;
    while (virtualColumnsCount > virtualColumns.current.length) {
      if (virtualColumns.current.length === 0) {
        virtualColumns.current.push(
          new ColumnObject({
            x: 0,
            width: minCellWidth,
            columnIndex: ++columnIndex,
          })
        );
      } else {
        const prev = virtualColumns.current[virtualColumns.current.length - 1];
        virtualColumns.current.push(
          new ColumnObject({
            width: minCellWidth,
            x: prev.x + minCellWidth,
            columnIndex: ++columnIndex,
          })
        );
      }
    }

    virtualCells.current = [];
    for (let i = 0; i < virtualRowsCount; i++) {
      const row = virtualRows.current[i];
      for (let j = 0; j < virtualColumnsCount; j++) {
        const column = virtualColumns.current[j];
        virtualCells.current.push(
          new CellObject({
            column,
            row,
          })
        );
      }
    }

    /**
     * 填满cells
     * cells的数量是 (rowCount+1) * (columnCount+1)，因为
     * 会出现左边的cell还没消失
     */
    setLayoutCount((prev) => prev + 1);
  }, []);

  const updateCoordinate = useCallback((event) => {
    const { x, y } = JSON.parse(JSON.stringify(coordinate.current));
    const { x: width, y: height } = JSON.parse(
      JSON.stringify(contentSize.current)
    );
    const { x: containerWidth, y: containerHeight } = JSON.parse(
      JSON.stringify(containerSize.current)
    );

    /**
     * 更新左上角坐标，其他所有位置都依据这个坐标进行位移
     * x值区间：[containerWidth - contentWidth, 0]
     * y值区间：[containerHeight - contentHeight, 0]
     */
    const minX = containerWidth - width;
    const minY = containerHeight - height;
    const nextX = Math.min(0, Math.max(minX, x - event.deltaX));
    const nextY = Math.min(0, Math.max(minY, y - event.deltaY));
    const nextX2 = nextX + containerWidth;
    const nextY2 = nextY + containerHeight;

    coordinate.current.setValue({
      x: nextX,
      y: nextY,
    });

    // console.log(
    //   [x, x + containerWidth],
    //   [nextX, nextX2],
    //   JSON.parse(JSON.stringify(virtualColumns.current[0]))
    // );
    /**
     * 更新virtualColumns和virtualRows
     * 如果deltaX > 0 (往左边移), 将最左边在可视范围外的columns依次移动到末尾
     * 如果deltaX < 0（往右边移）, 将最右边在可视范围外的columns倒序依次移动到头部
     * rows同理。
     */
    const outsideColumns: ColumnObject[] = [];
    const outsideRows: RowObject[] = [];
    const outsideCells: CellObject[] = [];

    if (event.deltaX > 0) {
      let maxColumnValue = NaN;
      let maxColumnIndex = NaN;
      for (let i = 0; i < virtualColumns.current.length; i++) {
        const column = virtualColumns.current[i];
        const columnValue = column.x;
        if (i === 0) {
          maxColumnValue = columnValue;
          maxColumnIndex = column.columnIndex;
        } else {
          maxColumnValue = Math.max(columnValue, maxColumnValue);
          maxColumnIndex = Math.max(column.columnIndex, maxColumnIndex);
        }

        /**
         * 判断超出范围的依据是列的*右侧*小于0
         */
        const isOutOfView = columnValue + nextX + column.width < 0;
        if (isOutOfView) {
          outsideColumns.push(column);
        }
      }
      // console.log({ outsideColumns, maxColumnValue });
      if (outsideColumns.length > 0) {
        for (let i = 0; i < outsideColumns.length; i++) {
          const column = outsideColumns[i];
          column.xAnimated.setValue(maxColumnValue + minCellWidth * (i + 1));
          column.columnIndex = maxColumnIndex + i + 1;
        }
      }
    } else {
      let minColumnValue = NaN;
      let minColumnIndex = NaN;
      for (let i = 0; i < virtualColumns.current.length; i++) {
        const column = virtualColumns.current[i];
        const columnValue = column.x;
        if (i === 0) {
          minColumnIndex = column.columnIndex;
          minColumnValue = columnValue;
        } else {
          minColumnValue = Math.min(columnValue, minColumnValue);
          minColumnIndex = Math.min(column.columnIndex, minColumnIndex);
        }

        /**
         * 判断超出范围的依据是列的*左侧*大于containerWidth
         */
        const isOutOfView = columnValue + nextX > containerWidth;
        if (isOutOfView) {
          outsideColumns.unshift(column);
        }
      }
      // console.log({ outsideColumns, minColumnValue });
      if (outsideColumns.length > 0) {
        for (let i = 0; i < outsideColumns.length; i++) {
          const column = outsideColumns[i];
          column.xAnimated.setValue(minColumnValue - minCellWidth * (i + 1));
          column.columnIndex = minColumnIndex - i - 1;
        }
      }
    }

    if (event.deltaY > 0) {
      let maxRowValue = NaN;
      let maxRowIndex = NaN;
      for (let i = 0; i < virtualRows.current.length; i++) {
        const row = virtualRows.current[i];
        const rowValue = row.y;
        if (i === 0) {
          maxRowValue = rowValue;
          maxRowIndex = row.rowIndex;
        } else {
          maxRowValue = Math.max(rowValue, maxRowValue);
          maxRowIndex = Math.max(row.rowIndex, maxRowIndex);
        }

        /**
         * 判断超出范围的依据是行的*下侧*小于0
         */
        const isOutOfView = rowValue + nextY + row.height < 0;
        if (isOutOfView) {
          outsideRows.push(row);
        }
      }
      // console.log({ outsideRows, maxRowValue });
      if (outsideRows.length > 0) {
        for (let i = 0; i < outsideRows.length; i++) {
          const row = outsideRows[i];
          row.yAnimated.setValue(maxRowValue + minCellHeight * (i + 1));
          row.rowIndex = maxRowIndex + i + 1;
        }
      }
    } else {
      let minRowValue = NaN;
      let minRowIndex = NaN;
      for (let i = 0; i < virtualRows.current.length; i++) {
        const row = virtualRows.current[i];
        const rowValue = row.y;
        if (i === 0) {
          minRowValue = rowValue;
          minRowIndex = row.rowIndex;
        } else {
          minRowValue = Math.min(rowValue, minRowValue);
          minRowIndex = Math.min(row.rowIndex, minRowIndex);
        }

        /**
         * 判断超出范围的依据是行的*上侧*大于容器高度
         */
        const isOutOfView = rowValue + nextY > containerHeight;
        if (isOutOfView) {
          outsideRows.unshift(row);
        }
      }
      // console.log({ outsideRows, minRowValue });
      if (outsideRows.length > 0) {
        for (let i = 0; i < outsideRows.length; i++) {
          const row = outsideRows[i];
          row.yAnimated.setValue(minRowValue - minCellHeight * (i + 1));
          row.rowIndex = minRowIndex - i - 1;
        }
      }
    }

    /**
     * 计算需要更新的cell，并调用update方法更新cell
     */

    for (let i = 0; i < virtualCells.current.length; i++) {
      const cell = virtualCells.current[i];
      if (!outsideCells.includes(cell)) {
        if (outsideColumns.includes(cell.column)) {
          outsideCells.push(cell);
        } else if (outsideRows.includes(cell.row)) {
          outsideCells.push(cell);
        }
      }
    }

    for (const cell of outsideCells) {
      cell.ref.current.update({
        rowIndex: cell.row.rowIndex,
        columnIndex: cell.column.columnIndex,
      });
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === "web") {
      const el = view.current as any;

      el.addEventListener("wheel", updateCoordinate);
      return () => {
        el.removeEventListener("wheel", updateCoordinate);
      };
    }
  }, [updateCoordinate]);

  return (
    <View
      ref={view}
      style={[style, { overflow: "hidden" }]}
      onLayout={onContainerLayout}
    >
      <Fragment key={`columns-${layoutCount}`}>
        {virtualColumns.current.map((column, index) => {
          return (
            <Animated.View
              key={index}
              style={{
                position: "absolute",
                width: 1,
                backgroundColor: "#000",
                transform: [
                  {
                    translateX: Animated.add(
                      column.xAnimated,
                      coordinate.current.x
                    ),
                  },
                ],
                height: containerSize.current.y,
              }}
            />
          );
        })}
      </Fragment>
      <Fragment key={`rows-${layoutCount}`}>
        {virtualRows.current.map((row, index) => {
          return (
            <Animated.View
              key={index}
              style={{
                position: "absolute",
                backgroundColor: "#000",
                transform: [
                  {
                    translateY: Animated.add(
                      row.yAnimated,
                      coordinate.current.y
                    ),
                  },
                ],
                width: containerSize.current.x,
                height: 1,
              }}
            />
          );
        })}
      </Fragment>
      <Fragment key={`cells-${layoutCount}`}>
        {virtualCells.current.map((cell, index) => {
          return (
            <Cell
              coordinate={coordinate.current}
              ref={cell.ref}
              key={index}
              column={cell.column}
              row={cell.row}
              renderCell={renderCell}
            />
          );
        })}
      </Fragment>
    </View>
  );
}
