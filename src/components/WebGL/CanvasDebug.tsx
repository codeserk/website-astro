/* eslint-disable no-console */
import { useFrame } from '@react-three/fiber'
import { useRef, type FC } from 'react'

const DEBUG_EVERY_TICKS = 60

interface Props {}

export const CanvasDebug: FC<Props> = () => {
  const ticks = useRef<number>(DEBUG_EVERY_TICKS)

  useFrame((state) => {
    if (ticks.current-- > 0) {
      return
    }

    console.log(
      `POS(${state.camera.position.x.toFixed(2)}, ${state.camera.position.y.toFixed(2)}, ${state.camera.position.z.toFixed(2)}) ROT(${state.camera.rotation.x.toFixed(2)}, ${state.camera.rotation.y.toFixed(2)}, ${state.camera.rotation.z.toFixed(2)})`,
    )
    ticks.current = DEBUG_EVERY_TICKS
  })

  return null
}
