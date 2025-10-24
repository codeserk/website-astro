import type { Vector3 } from '@react-three/fiber'

export interface CameraProps {
  readonly position?: number[]
  readonly target?: Vector3
}
