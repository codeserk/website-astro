/* eslint-disable @typescript-eslint/no-explicit-any */

import { useThree } from '@react-three/fiber'
import { useEffect, type FC } from 'react'
import { Mesh, MeshPhongMaterial } from 'three'
import { WebGLGLTFModel } from './GLTFModel'
import { WebGLEffectDither } from './Effects/Dither'

interface Props {
  readonly src: string
  readonly name?: string
  readonly isToon?: boolean
}

// Replace the porthole glass material with a phong material so it picks up
// a defined specular highlight, giving the window a "reflection" feel.
const GlassReflection: FC = () => {
  const { scene } = useThree()

  useEffect(() => {
    let cancelled = false
    let attempts = 0

    const tryPatch = () => {
      if (cancelled) {
        return
      }
      const glass = scene.getObjectByName('Rocket_PortholeGlass')
      if (glass instanceof Mesh && !(glass.material instanceof MeshPhongMaterial)) {
        glass.material = new MeshPhongMaterial({
          color: 0x4d8c9f,
          specular: 0xfff0d8,
          shininess: 70,
          emissive: 0x143036,
        })
        return
      }
      if (attempts < 60) {
        attempts++
        setTimeout(tryPatch, 80)
      }
    }
    tryPatch()

    return () => {
      cancelled = true
    }
  }, [scene])

  return null
}

export const DitherScene: FC<Props> = ({ src, name, isToon }) => {
  return (
    <>
      {/* Dim fill - top light kept low so the dome/nose doesn't read as white */}
      <directionalLight position={[0, 5, 2]} intensity={0.55} color="#f0e6d4" />
      <directionalLight position={[-1.5, 3.5, 1]} intensity={0.25} color="#f0e6d4" />
      <directionalLight position={[1.5, 3.5, 1]} intensity={0.25} color="#f0e6d4" />
      <directionalLight position={[0, 2, -1.5]} intensity={0.18} color="#8c92a4" />
      {/* Glass kicker — focused white light from camera-upper-right to put a specular dot on the porthole */}
      <directionalLight position={[2.5, 3, 2.5]} intensity={2.6} color="#ffffff" />
      {/* Warm fire glow below the rocket */}
      <pointLight position={[0, -0.2, 0]} intensity={6} distance={4} decay={1.6} color="#ff7822" />

      <WebGLGLTFModel src={src} isToon={isToon} name={name} />
      <GlassReflection />

      <WebGLEffectDither />
    </>
  )
}
