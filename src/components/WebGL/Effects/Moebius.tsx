import { Effects, useFBO } from '@react-three/drei'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { type FC } from 'react'
import { DepthTexture } from 'three'
import { SSAOPass } from 'three-stdlib'
import { MoebiusPass } from '~/modules/webgl/shaders/moebius/moebius.pass'

import { normalMaterial } from '~/modules/webgl/shaders/normal/normal.shader'

interface Props {}

extend({ SSAOPass })
extend({ MoebiusPass })

export const WebGLEffectMoebius: FC<Props> = () => {
  const depthTexture = new DepthTexture(600, 600)
  const depthRenderTarget = useFBO(600, 600, { depthTexture, depthBuffer: true })
  const normalRenderTarget = useFBO()
  const { camera } = useThree()

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

  return (
    <Effects>
      <moebiusPass
        args={[
          {
            depthRenderTarget,
            normalRenderTarget,
            camera,
          },
        ]}
      />
    </Effects>
  )
}
