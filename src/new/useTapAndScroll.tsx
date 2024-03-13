import { useEffect, useMemo, useRef } from 'react'
import { PanResponder } from 'react-native'

export function useTapAndScroll(updateCoordinate: any, debug = false) {
  const ticker = useRef(null)
  const stateID = useRef(null)

  useEffect(() => {
    return () => {
      clearInterval(ticker.current)
    }
  }, [])

  /**
   * pan responder for touch screen device
   *
   * The kinetic scrolling algorithm inspired by Ariya
   * https://ariya.io/2013/11/javascript-kinetic-scrolling-part-2
   */
  return useMemo(() => {
    let prevGestureState = null
    const startGestureState = null

    // 自动滚动的requestId
    let autoScrollId = null

    let deltaX = 0
    let deltaY = 0

    /**
     * for track()
     */
    let totalX = 0
    let totalY = 0
    let timestamp = Date.now()
    /**
     * 水平速度
     */
    let vx = 0
    /**
     * 垂直速度
     */
    let vy = 0

    /**
     * for autoScroll
     */
    let finalX = 0
    let finalY = 0

    const timeConstant = 325 // ms

    const trackMs = 20

    function init() {
      finalX = 0
      finalY = 0
      totalX = 0
      totalY = 0
      vx = 0
      vy = 0
      timestamp = Date.now()
      clearInterval(ticker.current)
      ticker.current = setInterval(track, trackMs)
    }

    /**
     * 计算速度
     *
     * 实时速度 = 1000 * 位移 / 时间间隔 + 1
     * 速度(移动平均值) = 实时速度 * 0.8 + 速度前值 * 0.2
     */
    function track() {
      if (debug) {
        console.time('track')
      }
      const now = Date.now()
      const elapsed = now - timestamp + 1
      timestamp = now
      const velocityX = (10 * trackMs * totalX) / elapsed
      const velocityY = (10 * trackMs * totalY) / elapsed
      vx = velocityX * 0.8 + vx * 0.2
      vy = velocityY * 0.8 + vy * 0.2

      totalX = 0
      totalY = 0
      if (debug) {
        console.timeEnd('track')
      }
    }

    function cancelAutoScroll() {
      cancelAnimationFrame(autoScrollId)
    }

    function autoScroll() {
      const elapsed = Date.now() - timestamp
      const per = Math.exp(-elapsed / timeConstant)
      const deltaX = finalX * per
      const deltaY = finalY * per
      if (deltaX > 0.5 || deltaX < -0.5 || deltaY > 0.5 || deltaY < -0.5) {
        updateCoordinate({ deltaX, deltaY })
        autoScrollId = requestAnimationFrame(autoScroll)
      } else {
        updateCoordinate({ deltaX, deltaY })
      }
    }

    return PanResponder.create({
      onStartShouldSetPanResponderCapture: () => false,
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dx, dy } = gestureState
        return dx > 5 || dx < -5 || dy > 5 || dy < -5
      },
      onMoveShouldSetPanResponderCapture: (_, gestureState) => false,
      onPanResponderTerminate: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (event, gestureState) => {
        stateID.current = gestureState.stateID
        prevGestureState = { ...gestureState }
        // 重新按住的时候需要停止之前的动画
        cancelAutoScroll()
        init()
      },
      onPanResponderMove: (event, gestureState) => {
        if (stateID.current !== gestureState.stateID) {
          return
        }
        if (!prevGestureState) {
          prevGestureState = { ...gestureState }
          init()
          return
        }
        deltaX = -gestureState.dx + prevGestureState.dx
        deltaY = -gestureState.dy + prevGestureState.dy
        totalX = deltaX
        totalY = deltaY
        prevGestureState = { ...gestureState }
        updateCoordinate({
          deltaX,
          deltaY,
        })
      },
      onPanResponderRelease: () => {
        prevGestureState = null
        clearInterval(ticker.current)
        if (vx > 10 || vx < -10) {
          finalX = 0.8 * vx
        }
        if (vy > 10 || vy < -10) {
          finalY = 0.8 * vy
        }
        timestamp = Date.now()
        requestAnimationFrame(autoScroll)
      },
    })
  }, [updateCoordinate, debug])
}
