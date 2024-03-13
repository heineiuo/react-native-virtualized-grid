import { useEffect, useMemo, useState } from "react";
import { Animated, Platform, View } from "react-native";

import { ColumnResizer } from "./ColumnResizer";
import { useGrid } from "./VirtualizedGridContext";
import { ColumnObject } from "./VirtualizedGridUtils";

export function Column(props: {
  height: number;
  renderColumn?: any;
  column: ColumnObject;
}) {
  const { column, height, renderColumn } = props;
  const { coordinate, freezedArea } = useGrid();
  const color = "#eee";

  const visible = useMemo(() => {
    if (column.freezed) {
      return true;
    }
    // 该列的右侧 减去画布位移 再减去固定列的左侧， 如果大于0则显示，否则说明完全隐藏了
    const columnX2 = Animated.add(column.xAnimated, column.widthAnimated);
    const columnX2R = Animated.add(coordinate.current.xAnimated, columnX2);
    const columnX2RD = Animated.subtract(
      columnX2R,
      freezedArea.current.leftAnimated
    );
    return JSON.parse(JSON.stringify(columnX2RD)) > 0;
  }, [column, coordinate, freezedArea]);

  /**
   * 隐藏列不显示
   */
  if (column.width === 0) {
    return null;
  }

  return (
    <Animated.View
      style={[
        {
          left: 0,
          position: "absolute",
          width: 1,
          height,
          zIndex: column.zIndexAnimated,
          backgroundColor: color,
          opacity: visible ? 1 : 0,
          transform: [
            {
              translateX: Animated.add(column.xAnimated, column.widthAnimated),
            },
          ],
        },
        Platform.OS === "web" &&
          ({
            cursor: "pointer",
          } as any),
      ]}
    >
      <View>{renderColumn && renderColumn({ column })}</View>
      {!column.freezed && <ColumnResizer column={column} />}
    </Animated.View>
  );
}
