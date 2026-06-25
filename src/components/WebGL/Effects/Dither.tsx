import { Effects, useFBO } from '@react-three/drei'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef, type FC } from 'react'
import { DepthTexture } from 'three'
import { DitherPass } from '~/modules/webgl/shaders/dither/dither.pass'

interface Props {
  readonly ditherStrength?: number
  readonly ditherScale?: number
  readonly paletteLevels?: number
  readonly fireFlickerAmount?: number
}

extend({ DitherPass })

export const WebGLEffectDither: FC<Props> = ({ ditherStrength, ditherScale, paletteLevels, fireFlickerAmount }) => {
  const passRef = useRef<DitherPass>(null)
  const { camera } = useThree()

  const depthTexture = useMemo(() => new DepthTexture(600, 600), [])
  const depthRenderTarget = useFBO(600, 600, { depthTexture, depthBuffer: true })

  useFrame((state) => {
    const { gl, scene, camera: c } = state

    gl.setRenderTarget(depthRenderTarget)
    gl.render(scene, c)
    gl.setRenderTarget(null)

    passRef.current?.setTime(state.clock.elapsedTime)
  })

  return (
    <Effects>
      <ditherPass
        ref={passRef}
        args={[
          {
            depthRenderTarget,
            camera,
            ditherStrength,
            ditherScale,
            paletteLevels,
            fireFlickerAmount,
          },
        ]}
      />
    </Effects>
  )
}
