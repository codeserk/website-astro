import React from 'react'
import { useEffect, useRef, type FC } from 'react'
import Swiper from 'swiper'
// import 'swiper/css'

export interface GalleryImage {
  readonly image: ImageMetadata
  readonly title: string
}

interface Props {
  readonly items: GalleryImage[]
}

export const Gallery: FC<Props> = ({ items }) => {
  const swiper = useRef<Swiper>()

  useEffect(() => {
    swiper.current = new Swiper('.swiper')
  }, [])

  return (
    <div className="Gallery swiper" id="Gallery">
      {items.map((item) => (
        <div className="swiper-slide">
          <img src={item.image.src} alt="full" />
        </div>
      ))}
    </div>
  )
}
