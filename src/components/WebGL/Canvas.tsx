import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, type FC, type PropsWithChildren } from 'react'
import { Vector3 } from 'three'
import { CanvasDebug } from './CanvasDebug'
import type { CameraProps } from './WebGL.types'

interface Props extends PropsWithChildren {
  readonly size: number
  readonly camera?: CameraProps
}

export const WebGLCanvas: FC<Props> = ({ size, camera, children }) => {
  const cameraPosition = new Vector3(
    camera?.position?.[0] ?? -5,
    camera?.position?.[1] ?? 3,
    camera?.position?.[2] ?? 0,
  )

  return (
    <>
      <Canvas shadows dpr={[1, 2]} style={{ width: size, height: size }} linear gl={{ antialias: true }}>
        <Suspense fallback="Loading">
          <color attach="background" args={['#ACBACB']} />

          {children}

          <OrbitControls target={camera?.target} />
          <PerspectiveCamera makeDefault position={cameraPosition} near={0.001} far={1000} />
          <CanvasDebug />
        </Suspense>
      </Canvas>
    </>
  )
}
