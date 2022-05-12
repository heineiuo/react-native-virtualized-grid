import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Platform, View, PanResponder } from "react-native";

import { Cell } from "./Cell";
import { VirtualizedGridContext } from "./VirtualizedGridContext";
import { VirtualizedGridProps } from "./VirtualizedGridTypes";
import {
  ColumnObject,
  CoordinateObject,
  RowObject,
} from "./VirtualizedGridUtils";

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
  onChangeColumnOrder = () => undefined,
  onChangeRowOrder = () => undefined,
  onChangeVisibleArea = () => undefined,
}: VirtualizedGridProps) {
  const view = useRef<View>(null);

  const freezedStartColumns = freezedColumns.start ?? 0;
  const freezedStartRows = freezedRows.start ?? 0;

  const virtualColumns = useRef([]);
  const virtualRows = useRef([]);

  const [{ allFreezed, notFreezed, columnFreezed, rowFreezed }, setCells] =
    useState({
      allFreezed: [],
      notFreezed: [],
      columnFreezed: [],
      rowFreezed: [],
    });

  /**
   * 左上角的坐标
   * 每次移动的时候，都需要重新更新每一个字段
   */
  const coordinate = useRef(new CoordinateObject());

  /**
   * 容器的width和height
   */
  const containerSize = useRef({ width: 0, height: 0 });

  /**
   * 更新
   * 根据左上角point/cell，往右和往下推算出所有的column和row，
   * 直到最右边的column/最下面的row超出可见区域
   */
  const update = useCallback(() => {
    if (__DEV__) {
      console.time("update");
    }
    const { width, height } = containerSize.current;
    const { rowIndex, columnIndex, left, top, x, y } = coordinate.current;
    let right = left;
    let bottom = top;
    let currentColumnIndex = columnIndex;
    let currentRowIndex = rowIndex;
    const rows = [];
    const columns = [];

    if (
      freezedStartColumns > 0 &&
      currentColumnIndex > freezedStartColumns - 1
    ) {
      // 先填入固定列
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
      }
    }

    while (true) {
      const currentColumnWidth = getColumnWidth({
        columnIndex: currentColumnIndex,
      });

      columns.push(
        new ColumnObject({
          columnIndex: currentColumnIndex,
          width: currentColumnWidth,
          x: right,
          freezed: currentColumnIndex < freezedStartColumns,
        })
      );

      right += currentColumnWidth;
      currentColumnIndex++;

      if (right > -x + width) {
        // console.log("column到达边界，停止");
        break;
      }
    }

    if (freezedStartRows > 0 && currentRowIndex > freezedStartRows - 1) {
      // 先填入固定行
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
      }
    }
    while (true) {
      const currentRowHeight = getRowHeight({
        rowIndex: currentRowIndex,
      });
      rows.push(
        new RowObject({
          rowIndex: currentRowIndex,
          height: currentRowHeight,
          y: bottom,
          freezed: currentRowIndex < freezedStartRows,
        })
      );

      bottom += currentRowHeight;
      currentRowIndex++;

      if (bottom > -y + height) {
        // console.log("row到达边界，停止");
        break;
      }
    }

    virtualColumns.current = columns;
    virtualRows.current = rows;

    const allFreezed = [];
    const notFreezed = [];
    const columnFreezed = [];
    const rowFreezed = [];

    for (const column of columns) {
      for (const row of rows) {
        const cell = (
          <Cell
            key={`${column.columnIndex}/${row.rowIndex}`}
            column={column}
            row={row}
            renderCell={renderCell}
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
    }

    if (__DEV__) {
      console.timeEnd("update");
      console.log(
        "count",
        columns.length,
        rows.length,
        columns.length * rows.length
      );
      console.time("setCells");
    }

    setCells({
      allFreezed,
      notFreezed,
      columnFreezed,
      rowFreezed,
    });
    if (__DEV__) {
      console.timeEnd("setCells");
    }
  }, [
    getColumnWidth,
    getRowHeight,
    renderCell,
    freezedStartColumns,
    freezedStartRows,
  ]);

  /**
   * 容器体积变化不会造成回收，只会增加，所以更新完容器体积后直接update
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
   * deltaX > 0 左滑，把右边的显示出来
   * deltaX < 0 右移，把左边的显示出来
   * deltaY > 0 上移，把下面的显示出来
   * deltaY < 0 下移，把上面的显示出来
   */
  const updateCoordinate = useCallback(
    (event: { deltaX: number; deltaY: number }) => {
      // console.log(event);
      if (__DEV__) {
        console.time("updateCoordinate");
      }
      const { deltaX, deltaY } = event;
      const { columnIndex, rowIndex, left, top } = coordinate.current;
      let nextX = coordinate.current.x - deltaX;
      if (nextX > 0) {
        nextX = 0;
        coordinate.current.x = 0;
        coordinate.current.columnIndex = 0;
        coordinate.current.left = 0;
      } else {
        /**
         * 更新x
         */
        coordinate.current.x = nextX;
        /**
         * 检查左上角cell是否还在可见区域内，不在的话需要更新
         */
        let currentColumnIndex = columnIndex;
        let currentLeft = left;
        let currentRight = left;
        if (deltaX > 0) {
          // 左滑，把右边的显示出来
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
          // deltaX < 0，把左边的显示出来
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
        nextY = 0;
        coordinate.current.y = 0;
        coordinate.current.top = 0;
        coordinate.current.rowIndex = 0;
      } else {
        /**
         * 更新y
         */
        coordinate.current.y = nextY;

        /**
         * 检查左上角cell是否还在可见区域内，不在的话需要更新
         */
        let currentRowIndex = rowIndex;
        let currentTop = top;
        let currentBottom = top;
        if (deltaY > 0) {
          // deltaY > 0 上移，把下面的显示出来
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
          // deltaY < 0 下移，把上面的显示出来
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

      if (__DEV__) {
        console.log(coordinate.current);
        console.timeEnd("updateCoordinate");
      }
      update();
    },
    [update, getColumnWidth, getRowHeight]
  );

  const onWheel = useCallback(
    (event) => {
      const { deltaX, deltaY } = event;
      updateCoordinate({
        deltaX,
        deltaY,
      });
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
        if (!prevGestureState) {
          prevGestureState = { ...gestureState };
          return;
        }
        const deltaX = -gestureState.dx + prevGestureState.dx;
        const deltaY = -gestureState.dy + prevGestureState.dy;
        prevGestureState = { ...gestureState };
        updateCoordinate({
          deltaX,
          deltaY,
        });
      },
      onPanResponderRelease: () => {
        prevGestureState = null;
      },
    });
  }, [updateCoordinate]);

  return (
    <VirtualizedGridContext.Provider
      value={{
        virtualColumns,
        virtualRows,
        onChangeColumn,
        onChangeRow,
        coordinate,
        containerSize,
        updateCoordinate,
        onChangeColumnOrder,
        onChangeRowOrder,
      }}
    >
      <View
        ref={view}
        style={[{ overflow: "hidden" }, style]}
        onLayout={onContainerLayout}
        {...panResponder.panHandlers}
      >
        {[
          { key: "notFreezed", data: notFreezed, x: true, y: true },
          { key: "columnFreezed", data: columnFreezed, y: true },
          { key: "rowFreezed", data: rowFreezed, x: true },
          { key: "allFreezed", data: allFreezed },
        ].map(({ key, data, x = false, y = false }) => {
          return (
            <Animated.View
              key={key}
              style={{
                transform: [
                  {
                    translateX: x ? coordinate.current.xAnimated : 0,
                  },
                  {
                    translateY: y ? coordinate.current.yAnimated : 0,
                  },
                ],
              }}
            >
              {data}
            </Animated.View>
          );
        })}
      </View>
    </VirtualizedGridContext.Provider>
  );
}
