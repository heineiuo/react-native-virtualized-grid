import { useMemo } from "react";
import { Animated, View } from "react-native";

import { RowResizer } from "./RowResizer";
import { useGrid } from "./VirtualizedGridContext";
import { RowObject } from "./VirtualizedGridUtils";

export function Row(props: { width: number; renderRow?: any; row: RowObject }) {
  const { row, width, renderRow } = props;
  const { coordinate, freezedArea } = useGrid();
  const color = "#eee";

  const visible = useMemo(() => {
    if (row.freezed) {
      return true;
    }

    // 该行的下侧 减去画布位移 再减去固定行的下侧， 如果大于0则显示，否则说明完全隐藏了
    return (
      JSON.parse(
        JSON.stringify(
          Animated.subtract(
            Animated.add(
              coordinate.current.yAnimated,
              Animated.add(row.yAnimated, row.heightAnimated)
            ),
            freezedArea.current.topAnimated
          )
        )
      ) > 0
    );
  }, [row, coordinate, freezedArea]);

  /**
   * 隐藏行不显示
   */
  if (row.height === 0) {
    return null;
  }

  return (
    <Animated.View
      style={{
        top: 0,
        position: "absolute",
        width,
        zIndex: row.zIndexAnimated,
        height: 1,
        opacity: visible ? 1 : 0,
        backgroundColor: color,
        transform: [
          {
            translateY: Animated.add(row.yAnimated, row.heightAnimated),
          },
        ],
      }}
    >
      <View>{renderRow && renderRow({ row })}</View>
      {!row.freezed && <RowResizer row={row} />}
    </Animated.View>
  );
}
