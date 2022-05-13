import {
  cloneElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Platform,
  View,
  PanResponder,
  ScrollView,
} from "react-native";

import { Cell } from "./Cell";
import { VirtualizedGridContext } from "./VirtualizedGridContext";
import { VirtualizedGridProps } from "./VirtualizedGridTypes";
import {
  ColumnObject,
  ContentObject,
  CoordinateObject,
  RowObject,
} from "./VirtualizedGridUtils";

const useScrollView = false;

export function VirtualizedGrid({
  debug = false,
  style,
  columnCount,
  rowCount,
  renderCell,
  onChangeColumn = (column: ColumnObject) => undefined,
  onChangeRow = (row: RowObject) => undefined,
  getColumnWidth = () => 100,
  getRowHeight = () => 40,
  freezedColumns = {},
  freezedRows = {},
  onChangeColumnOrder = () => undefined,
  onChangeRowOrder = () => undefined,
  onChangeVisibleArea = () => undefined,
}: VirtualizedGridProps) {
  const view = useRef<View>(null);
  const scrollView = useRef<ScrollView>(null);

  const freezedStartColumns = freezedColumns.start ?? 0;
  const freezedStartRows = freezedRows.start ?? 0;

  const virtualColumns = useRef([]);
  const virtualRows = useRef([]);

  const [groups, setGroups] = useState<
    {
      key: string;
      children: any[];
      x?: boolean;
      y?: boolean;
    }[]
  >([]);

  /**
   * 左上角的坐标
   * 每次移动的时候，都需要重新更新每一个字段
   */
  const coordinate = useRef(new CoordinateObject());

  /**
   * container's width and height
   */
  const containerSize = useRef({ width: 0, height: 0 });

  /**
   * content's width and height
   */
  const content = useRef(new ContentObject());

  /**
   * 更新
   * 根据左上角point/cell，往右和往下推算出所有的column和row，
   * 直到最右边的column/最下面的row超出可见区域
   */
  const update = useCallback(() => {
    if (debug) {
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
    let minColumn = null;
    let maxColumn = null;
    let minRow = null;
    let maxRow = null;

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
      if (!minColumn) {
        minColumn = columns.slice(-1)[0];
      }

      right += currentColumnWidth;
      currentColumnIndex++;

      if (right > -x + width) {
        // console.log("column到达边界，停止");
        maxColumn = columns.slice(-1)[0];
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

      if (!minRow) {
        minRow = rows.slice(-1)[0];
      }

      bottom += currentRowHeight;
      currentRowIndex++;

      if (bottom > -y + height) {
        // console.log("row到达边界，停止");
        maxRow = rows.slice(-1)[0];
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

    setGroups([
      { key: "notFreezed", children: notFreezed, x: true, y: true },
      { key: "columnFreezed", children: columnFreezed, y: true },
      { key: "rowFreezed", children: rowFreezed, x: true },
      { key: "allFreezed", children: allFreezed },
    ]);
    if (debug) {
      console.timeEnd("setCells");
    }
  }, [
    debug,
    onChangeVisibleArea,
    getColumnWidth,
    getRowHeight,
    renderCell,
    freezedStartColumns,
    freezedStartRows,
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
      console.log(event);
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

  const onScroll = useCallback(
    (event) => {
      const { x, y } = event.nativeEvent.contentOffset;
      const { offsetX, offsetY } = content.current;

      const deltaX = x - offsetX;
      const deltaY = y - offsetY;
      content.current.offsetX = x;
      content.current.offsetY = y;
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
      if (el) {
        el.addEventListener("wheel", onWheel);
        return () => {
          el.removeEventListener("wheel", onWheel);
        };
      }
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

  const container = useMemo(() => {
    if (Platform.OS === "web") {
      if (useScrollView) {
        return (
          <ScrollView
            ref={scrollView}
            style={[
              {
                overflow: "scroll",
              },
              style,
            ]}
            onLayout={onContainerLayout}
            onScroll={onScroll}
            scrollEventThrottle={16}
            {...panResponder.panHandlers}
          />
        );
      } else {
        return (
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
          />
        );
      }
    }
  }, [onContainerLayout, onScroll, panResponder, style]);

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
      {cloneElement(
        container,
        null,
        groups.map(({ key, children, x = false, y = false }) => {
          return (
            <Animated.View
              key={key}
              style={[
                {
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
                useScrollView && {
                  top: content.current.offsetY,
                  left: content.current.offsetX,
                  width: key === "notFreezed" ? content.current.width : 0,
                  height: key === "notFreezed" ? content.current.height : 0,
                },
              ]}
            >
              {children}
            </Animated.View>
          );
        })
      )}
    </VirtualizedGridContext.Provider>
  );
}
