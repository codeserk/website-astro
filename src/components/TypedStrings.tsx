import { type FunctionalComponent } from 'preact'
import { useEffect, useRef } from 'preact/hooks'
import Typed, { type TypedOptions } from 'typed.js'

interface Props {
  readonly options: TypedOptions
}

export const TypedStrings: FunctionalComponent<Props> = ({ options }) => {
  const element = useRef(null)

  useEffect(() => {
    const typed = new Typed(element.current, options)

    return () => {
      typed.destroy()
    }
  }, [])

  return <span ref={element}></span>
}

export default TypedStrings
