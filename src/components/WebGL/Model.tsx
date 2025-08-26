import { useEffect, useMemo, useState, type FC } from 'react'
import { WebGLCanvas } from './Canvas'
import { MoebiusScene } from './MoebiusScene'

interface Props {
  readonly src: string
  readonly isToon?: boolean
  readonly models?: string[]
}

export const WebGLModel: FC<Props> = ({ src, isToon, models }) => {
  const [model, setModel] = useState<string | undefined>()
  const [isMobile, setIsSmall] = useState(false)

  const size = useMemo(() => (isMobile ? window.outerWidth : 600), [isMobile])

  const handleResize = () => {
    const mediaMobile = window.matchMedia(`(width < ${600}px)`)

    setIsSmall(mediaMobile.matches)
  }

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.addEventListener('resize', handleResize, false)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className={`webgl-model ${isMobile ? 'mobile' : ''}`} style={{ width: size, height: size }}>
      {models?.length && (
        <select onChange={(ev) => setModel(ev.target.value)}>
          <option>Scene</option>
          {models.map((model, index) => (
            <option key={`${model}_${index}`}>{model}</option>
          ))}
        </select>
      )}
      <WebGLCanvas size={size}>
        <MoebiusScene src={src} isToon={isToon} name={model} />
      </WebGLCanvas>
    </div>
  )
}
