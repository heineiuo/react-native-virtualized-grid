import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Animated, Platform, View } from "react-native";

import { Cell } from "./Cell";
import { Column } from "./Column";
import { Overlay } from "./Overlay";
import { Row } from "./Row";
import { VirtualizedGridContext } from "./VirtualizedGridContext";
import {
  VirtualizedGridMethods,
  VirtualizedGridProps,
} from "./VirtualizedGridTypes";
import {
  ColumnObject,
  CoordinateObject,
  FocusedObject,
  FreezedArea,
  RowObject,
} from "./VirtualizedGridUtils";
import { useTapAndScroll } from "./useTapAndScroll";

const onWheelThrottled = true;

export const VirtualizedGrid = forwardRef<
  VirtualizedGridMethods,
  VirtualizedGridProps
>(
  (
    {
      debug = false,
      style,
      columnCount,
      rowCount,
      renderCell,
      renderRow,
      renderColumn,
      onChangeColumn = (column: ColumnObject) => undefined,
      onChangeRow = (row: RowObject) => undefined,
      getColumnWidth = () => 100,
      getRowHeight = () => 40,
      freezedColumns = {},
      freezedRows = {},
      onChangeColumnOrder = () => undefined,
      onChangeRowOrder = () => undefined,
      onChangeVisibleArea = () => undefined,
      cellMinWidth = 120,
      cellMinHeight = 32,
    },
    ref
  ) => {
    const view = useRef<View>(null);

    const freezedStartColumns = freezedColumns.start ?? 0;
    const freezedStartRows = freezedRows.start ?? 0;

    const virtualColumns = useRef([]);
    const virtualRows = useRef([]);

    /**
     * cell groups, 用来存放每次计算之后的cell，分组保存，包括：
     * `notFreezed` 自由移动的cell
     * `overlay` 被选中的cell的覆盖层
     * `columnFreezed` 仅纵向可自由移动
     * `rowFreezed` 仅横向可自由移动
     * `allFreezed` 不可移动
     */
    const [groups, setGroups] = useState<
      {
        key: string;
        children: any[];
        x?: boolean;
        y?: boolean;
        visible?: boolean;
      }[]
    >([]);

    /**
     * 左上角的坐标
     * 每次移动的时候，都需要重新更新每一个字段
     */
    const coordinate = useRef(new CoordinateObject());
    const focused = useRef(new FocusedObject());

    /**
     * container's width and height
     */
    const containerSize = useRef({ width: 0, height: 0 });

    const freezedArea = useRef(new FreezedArea());

    const focus = useCallback((options) => {
      focused.current.update(options);
      /**
       * 更新groups里的overlay
       */
      setGroups((prev) => {
        return prev.map((item) => {
          if (item.key === "overlay") {
            return {
              ...item,
              children: [
                <Overlay
                  key="overlay-children"
                  column={focused.current.column}
                  row={focused.current.row}
                />,
              ],
            };
          }
          return item;
        });
      });
    }, []);

    /**
     * 容器宽高（containerSize）变化或坐标（coordinate）变化后立即更新内部元素内容
     *
     * 根据左上角point/cell，往右和往下推算出所有的column和row，
     * 直到最右边的column/最下面的row超出可见区域
     */
    const update = useCallback(() => {
      if (debug) {
        console.time("update");
      }
      const { width, height } = containerSize.current;
      const { rowIndex, columnIndex, left, top, x, y } = coordinate.current;
      /**
       * 当前row的顶部，每更新一次row时这个值变成当前row的顶部+当前row的高度
       * 初始值是坐标的顶部+所有固定行合计高度
       */
      let currentRowTop = top;
      let currentColumnLeft = left;

      let currentColumnIndex = columnIndex;
      let currentRowIndex = rowIndex;
      const rows = [];
      const columns = [];
      let minColumn = null;
      let maxColumn = null;
      let minRow = null;
      let maxRow = null;

      let freezedAreaLeft = 0;
      let freezedAreaTop = 0;

      // 先填入固定列
      // 判断columnIndex是避免重复
      if (
        freezedStartColumns > 0 &&
        currentColumnIndex > freezedStartColumns - 1
      ) {
        let freezedIndex = 0;
        let freezedX = 0;
        while (freezedIndex < freezedStartColumns) {
          const freezedColumnWidth = getColumnWidth({
            columnIndex: freezedIndex,
          });
          columns.push(
            new ColumnObject({
              columnIndex: freezedIndex,
              width: freezedColumnWidth,
              x: freezedX,
              freezed: true,
            })
          );
          freezedIndex++;
          freezedX += freezedColumnWidth;
          freezedAreaLeft += freezedColumnWidth;
        }
      }

      const focusedColumnIndex = focused.current.column?.columnIndex;
      const focusedRowIndex = focused.current.row?.rowIndex;

      // 再填入非固定列
      while (true) {
        const currentColumnWidth = getColumnWidth({
          columnIndex: currentColumnIndex,
        });

        columns.push(
          new ColumnObject({
            columnIndex: currentColumnIndex,
            width: currentColumnWidth,
            x: currentColumnLeft,
            freezed: currentColumnIndex < freezedStartColumns,
          })
        );
        if (!minColumn) {
          minColumn = columns.slice(-1)[0];
        }

        currentColumnLeft += currentColumnWidth;
        currentColumnIndex++;

        if (currentColumnLeft > -x + width) {
          // console.log("column到达边界，停止");
          maxColumn = columns.slice(-1)[0];
          break;
        }
      }

      // 先填入固定行
      if (freezedStartRows > 0 && currentRowIndex > freezedStartRows - 1) {
        let freezedIndex = 0;
        let freezedY = 0;
        while (freezedIndex < freezedStartRows) {
          const freezedRowHeight = getRowHeight({
            rowIndex: freezedIndex,
          });
          rows.push(
            new RowObject({
              rowIndex: freezedIndex,
              height: freezedRowHeight,
              y: freezedY,
              freezed: true,
            })
          );
          freezedIndex++;
          freezedY += freezedRowHeight;
          freezedAreaTop += freezedRowHeight;
        }
      }

      // 填入非固定行
      while (true) {
        const currentRowHeight = getRowHeight({
          rowIndex: currentRowIndex,
        });
        rows.push(
          new RowObject({
            rowIndex: currentRowIndex,
            height: currentRowHeight,
            y: currentRowTop,
            freezed: currentRowIndex < freezedStartRows,
          })
        );

        if (!minRow) {
          minRow = rows.slice(-1)[0];
        }

        currentRowTop += currentRowHeight;
        currentRowIndex++;

        if (currentRowTop > -y + height) {
          // console.log("row到达边界，停止");
          maxRow = rows.slice(-1)[0];
          break;
        }
      }

      freezedArea.current.leftAnimated.setValue(freezedAreaLeft);
      freezedArea.current.topAnimated.setValue(freezedAreaTop);
      virtualColumns.current = columns;
      virtualRows.current = rows;

      const allFreezed = [];
      const notFreezed = [];
      const columnFreezed = [];
      const rowFreezed = [];
      const columnsElements = [];
      const freezedColumnsElements = [];
      const rowsElements = [];
      const freezedRowsElements = [];
      let columnsElementsReady = false;
      let nextFocusedRow = null;
      let nextFocusedColumn = null;

      for (const row of rows) {
        if (
          typeof focusedRowIndex === "number" &&
          row.rowIndex === focusedRowIndex
        ) {
          nextFocusedRow = row;
        }
        const rowElement = (
          <Row
            key={`row=${row.rowIndex}`}
            row={row}
            width={width}
            renderRow={renderRow}
          />
        );
        if (row.freezed) {
          freezedRowsElements.push(rowElement);
        } else {
          rowsElements.push(rowElement);
        }
        for (const column of columns) {
          if (
            typeof focusedColumnIndex === "number" &&
            column.columnIndex === focusedColumnIndex
          ) {
            nextFocusedColumn = column;
          }

          if (!columnsElementsReady) {
            const columnElement = (
              <Column
                height={height}
                key={`column=${column.columnIndex}`}
                column={column}
                renderColumn={renderColumn}
              />
            );
            if (column.freezed) {
              freezedColumnsElements.push(columnElement);
            } else {
              columnsElements.push(columnElement);
            }
          }
          const cell = (
            <Cell
              key={`column=${column.columnIndex}&row=${row.rowIndex}`}
              column={column}
              row={row}
              renderCell={renderCell}
              focus={focus}
            />
          );
          if (column.freezed && row.freezed) {
            allFreezed.push(cell);
          } else if (column.freezed) {
            columnFreezed.push(cell);
          } else if (row.freezed) {
            rowFreezed.push(cell);
          } else {
            notFreezed.push(cell);
          }
        }
        columnsElementsReady = true;
      }

      if (debug) {
        console.timeEnd("update");
        console.log(
          "count",
          columns.length,
          rows.length,
          columns.length * rows.length
        );
        console.time("setCells");
      }

      onChangeVisibleArea({ minRow, minColumn, maxRow, maxColumn });

      focused.current.update({
        column: nextFocusedColumn,
        row: nextFocusedRow,
      });

      setGroups([
        { key: "cells", children: notFreezed, x: true, y: true },
        {
          key: "overlay",
          children: [
            <Overlay
              key="overlay-children"
              column={nextFocusedColumn}
              row={nextFocusedRow}
            />,
          ],
          x: true,
          y: true,
        },
        {
          key: "cells-column-freezed",
          children: columnFreezed,
          y: true,
        },
        {
          key: "cells-row-freezed",
          children: rowFreezed,
          x: true,
        },
        { key: "cells-freezed", children: allFreezed },
        {
          key: "columns-freezed",
          children: freezedColumnsElements,
        },
        { key: "columns", children: columnsElements, x: true },
        { key: "rows", children: rowsElements, y: true },
        { key: "rows-freezed", children: freezedRowsElements },
      ]);
      if (debug) {
        console.timeEnd("setCells");
      }
    }, [
      renderRow,
      renderColumn,
      debug,
      onChangeVisibleArea,
      getColumnWidth,
      getRowHeight,
      renderCell,
      freezedStartColumns,
      freezedStartRows,
      focus,
    ]);

    /**
     * When container layout change, the coordinate will not change,
     * only new columns and columns may be added, so call `update()`
     * directly.
     */
    const onContainerLayout = useCallback(
      (event) => {
        const { width, height } = event.nativeEvent.layout;
        containerSize.current.width = width;
        containerSize.current.height = height;
        update();
      },
      [update]
    );

    /**
     * deltaX > 0 move to left, show the right columns
     * deltaX < 0 move to right, show the left columns
     * deltaY > 0 move to upside, show the bottom columns
     * deltaY < 0 move to downside, show the top columns
     */
    const updateCoordinate = useCallback(
      (event: { deltaX: number; deltaY: number }) => {
        if (debug) {
          console.time("updateCoordinate");
        }
        const { deltaX, deltaY } = event;
        const { columnIndex, rowIndex, left, top } = coordinate.current;
        let nextX = coordinate.current.x - deltaX;
        if (nextX > 0) {
          /**
           * reach left edge, reset column
           */
          nextX = 0;
          coordinate.current.x = 0;
          coordinate.current.columnIndex = 0;
          coordinate.current.left = 0;
        } else {
          /**
           * update x
           */
          coordinate.current.x = nextX;
          /**
           * if left edige column is visible, do not update
           * otherwise update it
           */
          let currentColumnIndex = columnIndex;
          let currentLeft = left;
          let currentRight = left;
          if (deltaX > 0) {
            // move left, show right columns
            while (true) {
              const currentWidth = getColumnWidth({
                columnIndex: currentColumnIndex,
              });
              currentLeft = currentRight;
              currentRight += currentWidth;
              if (currentRight >= -nextX) {
                break;
              }
              currentColumnIndex++;
            }
            coordinate.current.columnIndex = currentColumnIndex;
            coordinate.current.left = currentLeft;
          } else {
            // deltaX < 0，move right, show left columns
            while (true) {
              if (currentLeft <= -nextX) {
                break;
              }
              currentColumnIndex--;

              const currentWidth = getColumnWidth({
                columnIndex: currentColumnIndex,
              });
              currentLeft -= currentWidth;
            }
            coordinate.current.columnIndex = currentColumnIndex;
            coordinate.current.left = currentLeft;
          }
        }
        let nextY = coordinate.current.y - deltaY;
        if (nextY > 0) {
          /**
           * reach top edge, reset row
           */
          nextY = 0;
          coordinate.current.y = 0;
          coordinate.current.top = 0;
          coordinate.current.rowIndex = 0;
        } else {
          /**
           * update y
           */
          coordinate.current.y = nextY;

          /**
           * if top row is visible, do not update,
           * otherwise update the top row
           */
          let currentRowIndex = rowIndex;
          let currentTop = top;
          let currentBottom = top;
          if (deltaY > 0) {
            // deltaY > 0 move to top, show the bottom rows
            while (true) {
              const size = getRowHeight({
                rowIndex: currentRowIndex,
              });
              currentTop = currentBottom;
              currentBottom += size;
              if (currentBottom >= -nextY) {
                break;
              }
              currentRowIndex++;
            }
            coordinate.current.rowIndex = currentRowIndex;
            coordinate.current.top = currentTop;
          } else {
            // deltaY < 0 move down, show the top rows
            while (true) {
              if (currentTop <= -nextY) {
                break;
              }
              currentRowIndex--;

              const size = getRowHeight({
                rowIndex: currentRowIndex,
              });
              currentTop -= size;
            }
            coordinate.current.rowIndex = currentRowIndex;
            coordinate.current.top = currentTop;
          }
        }

        if (debug) {
          console.log(coordinate.current);
          console.timeEnd("updateCoordinate");
        }
        update();
      },
      [update, debug, getColumnWidth, getRowHeight]
    );

    const onWheel = useMemo(() => {
      let timer = null;
      let totalX = 0;
      let totalY = 0;
      return (event) => {
        if (!onWheelThrottled) {
          return updateCoordinate(event);
        }
        clearTimeout(timer);
        const { deltaX, deltaY } = event;
        totalX += deltaX;
        totalY += deltaY;
        timer = setTimeout(() => {
          updateCoordinate({
            deltaX: totalX,
            deltaY: totalY,
          });
          totalX = 0;
          totalY = 0;
        }, 0);
      };
    }, [updateCoordinate]);

    const panResponder = useTapAndScroll(updateCoordinate, debug);

    useEffect(() => {
      if (Platform.OS === "web") {
        const el = view.current as any;
        if (el) {
          el.addEventListener("wheel", onWheel);
          return () => {
            el.removeEventListener("wheel", onWheel);
          };
        }
      }
    }, [onWheel]);

    useImperativeHandle(
      ref,
      () => {
        return {
          forceUpdate: () => {
            coordinate.current.x = 0;
            coordinate.current.y = 0;
            focused.current.update();
            update();
          },
        };
      },
      [update]
    );

    return (
      <VirtualizedGridContext.Provider
        value={{
          cellMinWidth,
          cellMinHeight,
          debug,
          update,
          virtualColumns,
          virtualRows,
          onChangeColumn,
          onChangeRow,
          coordinate,
          containerSize,
          updateCoordinate,
          onChangeColumnOrder,
          onChangeRowOrder,
          freezedArea,
          focused,
        }}
      >
        <View
          ref={view}
          style={[
            {
              overflow: "hidden",
            },
            style,
          ]}
          onLayout={onContainerLayout}
          {...panResponder.panHandlers}
        >
          {groups.map(
            ({ key, visible = true, children, x = false, y = false }) => {
              return (
                <Animated.View
                  key={key}
                  pointerEvents={key === "overlay" ? "none" : "auto"}
                  style={[
                    {
                      display: visible ? "flex" : "none",
                      position: "absolute",
                      transform: [
                        {
                          translateX: x ? coordinate.current.xAnimated : 0,
                        },
                        {
                          translateY: y ? coordinate.current.yAnimated : 0,
                        },
                      ],
                    },
                  ]}
                >
                  {children}
                </Animated.View>
              );
            }
          )}
        </View>
      </VirtualizedGridContext.Provider>
    );
  }
);
