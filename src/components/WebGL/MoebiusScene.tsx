/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRef, type FC } from 'react'
import { WebGLGLTFModel } from './GLTFModel'
import { WebGLEffectMoebius } from './Effects/Moebius'
import { WebGLEffectMoebiusNoOutline } from './Effects/MoebiusNoOutline'

interface Props {
  readonly src: string
  readonly name?: string
  readonly isToon?: boolean
  readonly effect?: 'moebius' | 'moebius-no-outline'
}

export const MoebiusScene: FC<Props> = ({ src, name, isToon, effect }) => {
  const ground = useRef()

  return (
    <>
      <directionalLight position={[0, 5, -1]} intensity={2} color="#999" target={ground.current} />
      <directionalLight position={[0, 5, 0]} intensity={5} color="#999" target={ground.current} />
      <directionalLight position={[-1, 5, 0]} intensity={1} color="#999" target={ground.current} />
      <directionalLight position={[1, 5, 0]} intensity={1} color="#999" target={ground.current} />
      <WebGLGLTFModel src={src} isToon={isToon} name={name} />

      {effect === 'moebius' && <WebGLEffectMoebius />}
      {effect === 'moebius-no-outline' && <WebGLEffectMoebiusNoOutline />}
    </>
  )
}
