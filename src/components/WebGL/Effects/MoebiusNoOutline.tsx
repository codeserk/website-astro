import { Effects, useFBO } from '@react-three/drei'
import { extend, useThree } from '@react-three/fiber'
import { type FC } from 'react'
import { DepthTexture } from 'three'
import { SSAOPass } from 'three-stdlib'
import { MoebiusPass } from '~/modules/webgl/shaders/moebius/moebius.pass'

interface Props {}

extend({ SSAOPass })
extend({ MoebiusPass })

export const WebGLEffectMoebiusNoOutline: FC<Props> = () => {
  const depthTexture = new DepthTexture(600, 600)
  const depthRenderTarget = useFBO(600, 600, { depthTexture, depthBuffer: true })
  const normalRenderTarget = useFBO()
  const { camera } = useThree()

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
