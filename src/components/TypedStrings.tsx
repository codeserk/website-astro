import React from 'react'
import { useEffect, useRef, type FC } from 'react'
import Typed, { type TypedOptions } from 'typed.js'

interface Props {
  readonly options: TypedOptions
}

export const TypedStrings: FC<Props> = ({ options }) => {
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
