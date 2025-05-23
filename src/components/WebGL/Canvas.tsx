import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, type FC, type PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {
  readonly size: number
}

export const WebGLCanvas: FC<Props> = ({ size, children }) => {
  return (
    <Canvas shadows dpr={[1, 2]} style={{ width: size, height: size }} flat linear gl={{ antialias: true }}>
      <Suspense fallback="Loading">
        <color attach="background" args={['#ACBACB']} />

        {children}

        <OrbitControls />
        <PerspectiveCamera makeDefault position={[-5, 3, 0]} near={0.001} far={1000} />
      </Suspense>
    </Canvas>
  )
}
