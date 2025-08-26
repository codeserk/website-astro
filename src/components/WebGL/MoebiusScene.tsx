/* eslint-disable @typescript-eslint/no-explicit-any */
import { Effects, useFBO } from '@react-three/drei'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { SSAOPass } from 'three-stdlib'

import { useRef, type FC } from 'react'
import { DepthTexture } from 'three'
import { MoebiusPass } from '~/modules/webgl/shaders/moebius/moebius.pass'
import { WebGLGLTFModel } from './GLTFModel'
import { normalMaterial } from '~/modules/webgl/shaders/normal/normal.shader'

extend({ SSAOPass })
extend({ MoebiusPass })

interface Props {
  readonly src: string
  readonly name?: string
  readonly isToon?: boolean
}

export const MoebiusScene: FC<Props> = ({ src, name, isToon }) => {
  const ground = useRef()

  const amplitude = useRef(1)
  const frequency = useRef(0.01)

  const { camera } = useThree()

  const depthTexture = new DepthTexture(600, 600)
  const depthRenderTarget = useFBO(600, 600, { depthTexture, depthBuffer: true })

  const normalRenderTarget = useFBO()

  useFrame((state) => {
    const { gl, scene, camera } = state

    gl.setRenderTarget(depthRenderTarget)
    gl.render(scene, camera)

    const originalSceneMaterial = scene.overrideMaterial

    gl.setRenderTarget(normalRenderTarget)

    scene.matrixWorldNeedsUpdate = true
    scene.overrideMaterial = normalMaterial
    ;(scene.overrideMaterial as unknown).uniforms.lightPosition.value = camera.position

    gl.render(scene, camera)

    scene.overrideMaterial = originalSceneMaterial

    gl.setRenderTarget(null)
  })

  if (!depthRenderTarget) {
    return null
  }

  return (
    <>
      <directionalLight position={[0, 5, -1]} intensity={2} color="#999" target={ground.current} />
      <directionalLight position={[0, 5, 0]} intensity={5} color="#999" target={ground.current} />
      <directionalLight position={[-1, 5, 0]} intensity={1} color="#999" target={ground.current} />
      <directionalLight position={[1, 5, 0]} intensity={1} color="#999" target={ground.current} />

      <WebGLGLTFModel src={src} isToon={isToon} name={name} />

      <Effects>
        <moebiusPass
          args={[
            {
              depthRenderTarget,
              normalRenderTarget,
              camera,
              amplitude: amplitude.current,
              frequency: frequency.current,
            },
          ]}
        />
      </Effects>
    </>
  )
}
