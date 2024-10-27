import { useState, type FC } from 'react'
import { WebGLCanvas } from './Canvas'
import { MoebiusScene } from './MoebiusScene'

interface Props {
  readonly src: string
  readonly models?: string[]
}

export const WebGLModel: FC<Props> = ({ src, models }) => {
  const [model, setModel] = useState<string | undefined>()

  return (
    <div className="webgl-model">
      {models?.length && (
        <select onChange={(ev) => setModel(ev.target.value)}>
          <option>Scene</option>
          {models.map((model, index) => (
            <option key={`${model}_${index}`}>{model}</option>
          ))}
        </select>
      )}
      <WebGLCanvas>
        <MoebiusScene src={src} name={model} />
      </WebGLCanvas>
    </div>
  )
}
