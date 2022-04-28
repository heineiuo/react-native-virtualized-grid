import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Animated, Platform, View, PanResponder } from "react-native";

import { Cell } from "./Cell";
import { VirtualizedGridContext } from "./VirtualizedGridContext";
import { VirtualizedGridProps } from "./VirtualizedGridTypes";
import { CellObject, ColumnObject, RowObject } from "./VirtualizedGridUtils";

export function VirtualizedGrid({
  style,
  columnCount,
  rowCount,
  renderCell,
  onChangeColumn = (column: ColumnObject) => undefined,
  onChangeRow = (row: RowObject) => undefined,
  getColumnWidth = () => 100,
  getRowHeight = () => 40,
  showColumnLine = false,
  showRowLine = false,
  freezedColumns = {},
  freezedRows = {},
}: VirtualizedGridProps) {
  const view = useRef<View>(null);
  const [layoutCount, setLayoutCount] = useState(0);
  const virtualColumns = useRef<ColumnObject[]>([]);
  const virtualRows = useRef<RowObject[]>([]);
  const virtualCells = useRef<CellObject[]>([]);

  const freezedStartColumns = freezedColumns.start ?? 0;
  const freezedEndColumns = freezedColumns.end ?? 0;
  const freezedStartRows = freezedRows.start ?? 0;
  const freezedEndRows = freezedRows.end ?? 0;

  /**
   * 左上角的坐标
   */
  const coordinate = useRef(new Animated.ValueXY({ x: 0, y: 0 }));
  const containerSize = useRef(new Animated.ValueXY({ x: 0, y: 0 }));

  /**
   * 获取当前的rowIndex范围和columnIndex范围
   */
  const getRange = useCallback(() => {
    let minColumn = virtualColumns.current[0];
    let maxColumn = virtualColumns.current[0];
    let minRow = virtualRows.current[0];
    let maxRow = virtualRows.current[0];

    for (let i = 0; i < virtualColumns.current.length; i++) {
      const column = virtualColumns.current[i];
      if (column.freezed) {
        continue;
      }
      if (minColumn.freezed) {
        minColumn = column;
        continue;
      }
      if (column.columnIndex < minColumn.columnIndex) {
        minColumn = column;
      }
      if (column.columnIndex > maxColumn.columnIndex) {
        maxColumn = column;
      }
    }

    for (let i = 0; i < virtualRows.current.length; i++) {
      const row = virtualRows.current[i];
      if (row.freezed) {
        continue;
      }
      if (minRow.freezed) {
        minRow = row;
        continue;
      }
      if (row.rowIndex < minRow.rowIndex) {
        minRow = row;
      }
      if (row.rowIndex > maxRow.rowIndex) {
        maxRow = row;
      }
    }
    return { minColumn, minRow, maxColumn, maxRow };
  }, []);

  /**
   * init containerSize, virtualColumns, virtualRows
   */
  const onContainerLayout = useCallback(
    (event) => {
      const { layout } = event.nativeEvent;
      containerSize.current.setValue({ x: layout.width, y: layout.height });

      let virtualColumnsTotalWidth = 0;
      let virtualRowsTotalHeight = 0;

      for (const column of virtualColumns.current) {
        virtualColumnsTotalWidth += column.width;
      }
      for (const row of virtualRows.current) {
        virtualRowsTotalHeight += row.height;
      }

      const { maxRow, maxColumn } = getRange();

      /**
       * 填满virtualRows和virtualColumns
       */
      let rowIndex = maxRow?.rowIndex ?? -1;
      while (virtualRowsTotalHeight < layout.height) {
        if (rowIndex >= rowCount - 1) {
          break;
        }
        rowIndex++;
        const rowHeight = getRowHeight({ rowIndex });
        virtualRowsTotalHeight += rowHeight;
        if (virtualRows.current.length === 0) {
          virtualRows.current.push(
            new RowObject({
              y: 0,
              height: rowHeight,
              rowIndex,
              freezed: rowIndex < freezedStartRows,
            })
          );
        } else {
          const prev = virtualRows.current[virtualRows.current.length - 1];
          virtualRows.current.push(
            new RowObject({
              y: prev.y + prev.height,
              height: rowHeight,
              rowIndex,
              freezed: rowIndex < freezedStartRows,
            })
          );
        }
      }
      let columnIndex = maxColumn?.columnIndex ?? -1;
      while (virtualColumnsTotalWidth < layout.width) {
        if (columnIndex >= columnCount - 1) {
          break;
        }
        columnIndex++;
        const columnWidth = getColumnWidth({ columnIndex });
        virtualColumnsTotalWidth += columnWidth;
        if (virtualColumns.current.length === 0) {
          virtualColumns.current.push(
            new ColumnObject({
              x: 0,
              width: columnWidth,
              columnIndex,
              freezed: columnIndex < freezedStartColumns,
            })
          );
        } else {
          const prev =
            virtualColumns.current[virtualColumns.current.length - 1];
          virtualColumns.current.push(
            new ColumnObject({
              width: columnWidth,
              x: prev.x + prev.width,
              columnIndex,
              freezed: columnIndex < freezedStartColumns,
            })
          );
        }
      }

      /**
       * 增加额外的column和row,
       * 1. 避免出现空白列/行
       * 2. 补充freezed的空缺
       */
      let extraRows = freezedStartRows + 1;
      while (extraRows > 0) {
        if (rowIndex >= rowCount - 1) {
          break;
        }
        rowIndex++;
        const rowHeight = getRowHeight({ rowIndex });
        const prevRow = virtualRows.current[virtualRows.current.length - 1];
        virtualRows.current.push(
          new RowObject({
            y: prevRow.y + prevRow.height,
            height: rowHeight,
            rowIndex,
          })
        );
        extraRows--;
      }

      let extraColumns = freezedStartColumns + 1;
      while (extraColumns > 0) {
        if (columnIndex >= columnCount - 1) {
          break;
        }
        columnIndex++;
        const prevColumn =
          virtualColumns.current[virtualColumns.current.length - 1];
        const columnWidth = getColumnWidth({ columnIndex });
        virtualColumns.current.push(
          new ColumnObject({
            width: columnWidth,
            x: prevColumn.x + prevColumn.width,
            columnIndex,
          })
        );

        extraColumns--;
      }

      /**
       * 重置cells
       * cells的数量是 (rowCount+1) * (columnCount+1)，因为
       * 会出现左边的cell还没消失
       */
      virtualCells.current = [];
      for (let i = 0; i < virtualRows.current.length; i++) {
        const row = virtualRows.current[i];
        for (let j = 0; j < virtualColumns.current.length; j++) {
          const column = virtualColumns.current[j];
          virtualCells.current.push(
            new CellObject({
              column,
              row,
            })
          );
        }
      }

      setLayoutCount((prev) => prev + 1);
    },
    [
      rowCount,
      columnCount,
      getColumnWidth,
      getRowHeight,
      getRange,
      freezedStartColumns,
      freezedStartRows,
    ]
  );

  const updateCoordinate = useCallback(
    (event: { deltaX: number; deltaY: number }) => {
      const { x, y } = JSON.parse(JSON.stringify(coordinate.current));
      const { x: containerWidth, y: containerHeight } = JSON.parse(
        JSON.stringify(containerSize.current)
      );

      /**
       * 如果移动过快，超过了逐次迁移元素的速度，那么拆分成多次操作，重复
       * 调用updateCoordinate
       */
      let shouldSplitAction = false;
      const splitAction = { deltaX: 0, deltaY: 0 };

      /**
       * (1/5)
       * 获取当前的rowIndex范围和columnIndex范围
       * 如果现在已经到最左边column或最右边column了，那就不再继续移动column，
       * 同时coordinate.x最小值不能小于 containerWidth - (maxColumn.x+column.width)
       * 也就是说coordinate.x区间是：[containerWidth - (maxColumn.x+column.width), 0]
       *
       * row同理
       */
      let { minColumn, maxColumn, minRow, maxRow } = getRange();

      /**
       * (2/5)
       * 计算出minX,minY
       * 根据deltaX位移计算需要展示的column,
       * 逐个通过消耗deltaX，通过getColumnWidth获取宽度，直到deltaX额度用完
       * 1. 判断maxColumn是否已经完全展示，
       *    a. 未完全展示：deltaX -= maxColumn未完全展示的部分(deltaX等于0结束)
       *       nextX -= maxColumn未完全展示的部分；-> 2
       *    b. 完全展示：-> 2
       * 2. 获取下一个maxColumn，判断deltaX剩余额度是否大于maxColumn宽度
       *    a. 大于: deltaX -= maxColumn宽度，
       *            nextX -= maxColumn宽度，-> 2
       *    b. 小于等于：结束
       *
       * deltaY同理
       *
       * deltaX > 0 左移
       * deltaX < 0 右移
       * deltaY > 0 上移
       * deltaY < 0 下移
       */

      let deltaX = event.deltaX;
      let deltaY = event.deltaY;
      let finalMaxColumnIndex = maxColumn.columnIndex;
      let finalMinColumnIndex = minColumn.columnIndex;
      let finalMaxRowIndex = maxRow.rowIndex;
      let finalMinRowIndex = minRow.rowIndex;

      // 右移补头
      if (deltaX < 0) {
        // minColumn.x + x 修正maxColumn位置误差
        // let deltaX0 = -containerWidth;
        let deltaX0 = x + minColumn.x - containerWidth;

        while (deltaX < deltaX0) {
          if (finalMinColumnIndex === 0) {
            break;
          }
          finalMinColumnIndex--;
          if (
            minColumn.columnIndex - finalMinColumnIndex >=
            virtualColumns.current.length - 2
          ) {
            shouldSplitAction = true;
            break;
          }
          const minColumnWidth = getColumnWidth({
            columnIndex: finalMinColumnIndex,
          });
          deltaX0 += minColumnWidth;
        }
        deltaX = Math.max(deltaX0, deltaX);
        if (shouldSplitAction) {
          splitAction.deltaX = event.deltaX - deltaX;
        }
      }
      // 左移补尾
      if (deltaX > 0) {
        // 修正位置误差: x + maxColumn.x + maxColumn.width
        // let deltaX0 = containerWidth;
        let deltaX0 = maxColumn.x + maxColumn.width + x - containerWidth;
        while (deltaX > deltaX0) {
          if (finalMaxColumnIndex >= columnCount - 1) {
            break;
          }
          finalMaxColumnIndex++;
          if (
            finalMaxColumnIndex - maxColumn.columnIndex >=
            virtualColumns.current.length - 2
          ) {
            shouldSplitAction = true;
            break;
          }
          const maxColumnWidth = getColumnWidth({
            columnIndex: finalMaxColumnIndex,
          });
          deltaX0 += maxColumnWidth;
        }
        deltaX = Math.min(deltaX0, deltaX);
        if (shouldSplitAction) {
          splitAction.deltaX = event.deltaX - deltaX;
        }
      }

      // 下移补头
      if (deltaY < 0) {
        // minRow.y !== -y，因为minRow有可能一半在屏幕外面，
        // 所以这里要修正这个误差
        let deltaY0 = y + minRow.y - containerHeight;

        while (deltaY < deltaY0) {
          if (finalMinRowIndex === 0) {
            break;
          }
          finalMinRowIndex--;
          if (
            minRow.rowIndex - finalMinRowIndex >=
            virtualRows.current.length - 2
          ) {
            shouldSplitAction = true;
            break;
          }
          const minRowHeight = getRowHeight({
            rowIndex: finalMinRowIndex,
          });
          deltaY0 += minRowHeight;
        }
        deltaY = Math.max(deltaY0, deltaY);
        if (shouldSplitAction) {
          splitAction.deltaY = event.deltaY - deltaY;
        }
      }

      // 上移补尾
      if (deltaY > 0) {
        let deltaY0 = maxRow.y + maxRow.height + y - containerHeight;

        while (deltaY > deltaY0) {
          if (finalMaxRowIndex >= rowCount - 1) {
            break;
          }
          finalMaxRowIndex++;
          if (
            finalMaxRowIndex - maxRow.rowIndex >=
            virtualRows.current.length - 2
          ) {
            shouldSplitAction = true;
            break;
          }
          const maxRowHeight = getRowHeight({
            rowIndex: finalMaxRowIndex,
          });
          deltaY0 += maxRowHeight;
        }
        deltaY = Math.min(deltaY0, deltaY);
        if (shouldSplitAction) {
          splitAction.deltaY = event.deltaY - deltaY;
        }
      }

      /**
       * (3/5)
       * 更新左上角坐标，其他所有位置都依据这个坐标进行位移
       * x值区间：[containerWidth - contentWidth, 0]
       * y值区间：[containerHeight - contentHeight, 0]
       */
      if (x - deltaX > 0) {
        deltaX = x;
      }
      if (y - deltaY > 0) {
        deltaY = y;
      }

      const nextX = x - deltaX;
      const nextY = y - deltaY;

      coordinate.current.setValue({
        x: nextX,
        y: nextY,
      });

      /**
       * (4/5)
       * 更新virtualColumns和virtualRows
       * 如果deltaX > 0 (往左边移), 将最左边在可视范围外的columns依次移动到末尾
       * 如果deltaX < 0（往右边移）, 将最右边在可视范围外的columns倒序依次移动到头部
       * rows同理。
       */
      const outsideColumns: ColumnObject[] = [];
      const outsideRows: RowObject[] = [];
      const outsideCells: CellObject[] = [];

      // 左移，在末尾增加
      if (deltaX > 0) {
        for (let i = 0; i < virtualColumns.current.length; i++) {
          const column = virtualColumns.current[i];

          /**
           * 判断超出范围的依据是列的*右侧*小于0
           */
          const isOutOfView =
            !column.freezed &&
            column.x + nextX + column.width < freezedStartColumns;
          if (isOutOfView) {
            outsideColumns.push(column);
          }
        }

        /**
         * 所有column均已超出屏幕，此时根据finalMaxIndex重新计算
         * 所有的column的位置
         */

        if (outsideColumns.length === virtualColumns.current.length) {
          console.error("This shoud not happen");
        }
        // console.log({ outsideColumns, maxColumnValue });
        if (outsideColumns.length > 0) {
          for (let i = 0; i < outsideColumns.length; i++) {
            /**
             * 先更新columnIndex
             * 通过columnIndex拿到columnWidth
             * 再更新maxColumnValue以供下一个column使用
             */
            const column = outsideColumns[i];
            column.xAnimated.setValue(maxColumn.x + maxColumn.width);
            column.columnIndex = maxColumn.columnIndex + 1;
            const columnWidth = getColumnWidth(column);
            column.widthAnimated.setValue(columnWidth);
            maxColumn = column;
          }
        }
      }

      // 右移，在头部增加
      if (deltaX < 0) {
        for (let i = 0; i < virtualColumns.current.length; i++) {
          const column = virtualColumns.current[i];
          const columnValue = column.x;

          /**
           * 判断超出范围的依据是列的*左侧*大于containerWidth
           */
          const isOutOfView =
            !column.freezed && columnValue + nextX > containerWidth;
          if (isOutOfView) {
            outsideColumns.unshift(column);
          }
        }
        // console.log({ outsideColumns, minColumnValue });
        if (outsideColumns.length > 0) {
          for (let i = 0; i < outsideColumns.length; i++) {
            if (minColumn.columnIndex === 0) {
              break;
            }
            /**
             * 先更新columnIndex
             * 通过columnIndex拿到columnWidth
             * 再更新minColumnValue以供下一个column使用
             */
            const column = outsideColumns[i];
            column.columnIndex = minColumn.columnIndex - 1;
            const columnWidth = getColumnWidth(column);
            column.widthAnimated.setValue(columnWidth);
            column.xAnimated.setValue(minColumn.x - columnWidth);
            minColumn = column;
          }
        }
      }

      // 上移，在尾部增加
      if (deltaY > 0) {
        for (let i = 0; i < virtualRows.current.length; i++) {
          const row = virtualRows.current[i];

          /**
           * 判断超出范围的依据是行的*下侧*小于0
           */
          const isOutOfView =
            !row.freezed && row.y + nextY + row.height < freezedStartRows;
          if (isOutOfView) {
            outsideRows.push(row);
          }
        }

        // console.log(outsideRows);
        // console.log({ outsideRows, maxRowValue });
        /**
         * 所有column均已超出屏幕，此时根据finalMaxIndex重新计算
         * 所有的column的位置
         */
        if (outsideRows.length === virtualRows.current.length) {
          console.error("Warning: This shoud not happen");
        }

        if (outsideRows.length > 0) {
          for (let i = 0; i < outsideRows.length; i++) {
            const row = outsideRows[i];
            row.rowIndex = maxRow.rowIndex + 1;
            row.yAnimated.setValue(maxRow.y + maxRow.height);
            const rowHeight = getRowHeight(row);
            row.heightAnimated.setValue(rowHeight);
            maxRow = row;
          }
        }
      }

      // 下移，在头部增加
      if (deltaY < 0) {
        for (let i = 0; i < virtualRows.current.length; i++) {
          const row = virtualRows.current[i];

          /**
           * 判断超出范围的依据是行的*上侧*大于容器高度
           */
          const isOutOfView = !row.freezed && row.y + nextY > containerHeight;
          if (isOutOfView) {
            outsideRows.unshift(row);
          }
        }
        // console.log({ outsideRows, minRowValue });
        if (outsideRows.length > 0) {
          for (let i = 0; i < outsideRows.length; i++) {
            if (minRow.rowIndex === 0) {
              break;
            }
            const row = outsideRows[i];
            row.rowIndex = minRow.rowIndex - 1;
            const rowHeight = getRowHeight(row);
            row.heightAnimated.setValue(rowHeight);
            row.yAnimated.setValue(minRow.y - row.height);
            minRow = row;
          }
        }
      }

      /**
       * (5/5)
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

      if (!shouldSplitAction) {
        for (const cell of outsideCells) {
          cell.ref.current.update({
            rowIndex: cell.row.rowIndex,
            columnIndex: cell.column.columnIndex,
          });
        }
      }

      // 继续未完成action
      if (shouldSplitAction) {
        if (__DEV__) {
          console.log("[DEV] splitAction", {
            ...splitAction,
            prevDeltaY: deltaY,
            prevDeltaX: deltaX,
            containerWidth,
            containerHeight,
          });
        }
        requestAnimationFrame(() => {
          updateCoordinate(splitAction);
        });
      }
    },
    [
      getColumnWidth,
      getRange,
      columnCount,
      rowCount,
      getRowHeight,
      freezedStartColumns,
      freezedStartRows,
    ]
  );

  const onWheel = useCallback(
    (event) => {
      const { deltaX, deltaY } = event;
      updateCoordinate({ deltaX, deltaY });
    },
    [updateCoordinate]
  );

  useEffect(() => {
    if (Platform.OS === "web") {
      const el = view.current as any;

      el.addEventListener("wheel", onWheel);
      return () => {
        el.removeEventListener("wheel", onWheel);
      };
    }
  }, [onWheel]);

  const panResponder = useMemo(() => {
    let prevGestureState = null;
    return PanResponder.create({
      onPanResponderGrant: (event, gestureState) => {
        prevGestureState = { ...gestureState };
      },
      onMoveShouldSetPanResponder: () => {
        return true;
      },
      onPanResponderMove: (event, gestureState) => {
        const deltaX = -gestureState.dx + prevGestureState.dx;
        const deltaY = -gestureState.dy + prevGestureState.dy;
        prevGestureState = { ...gestureState };
        updateCoordinate({
          deltaX,
          deltaY,
        });
      },
    });
  }, [updateCoordinate]);

  return (
    <VirtualizedGridContext.Provider
      value={{
        onChangeColumn,
        onChangeRow,
        virtualColumns,
        virtualCells,
        virtualRows,
        coordinate,
        containerSize,
        updateCoordinate,
      }}
    >
      <View
        ref={view}
        style={[style, { overflow: "hidden" }]}
        onLayout={onContainerLayout}
        {...panResponder.panHandlers}
      >
        {showColumnLine && (
          <Fragment key={`columns-${layoutCount}`}>
            {virtualColumns.current.map((column, index) => {
              return (
                <Animated.View
                  key={index}
                  style={{
                    position: "absolute",
                    width: 1,
                    backgroundColor: "#ccc",
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
        )}
        {showRowLine && (
          <Fragment key={`rows-${layoutCount}`}>
            {virtualRows.current.map((row, index) => {
              return (
                <Animated.View
                  key={index}
                  style={{
                    position: "absolute",
                    backgroundColor: "#ccc",
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
        )}
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
    </VirtualizedGridContext.Provider>
  );
}
