import { type FunctionalComponent } from 'preact'
import { useEffect, useRef } from 'preact/hooks'
import Swiper from 'swiper'
// import 'swiper/css'

export interface GalleryImage {
  readonly image: ImageMetadata
  readonly title: string
}

interface Props {
  readonly items: GalleryImage[]
}

export const Gallery: FunctionalComponent<Props> = ({ items }) => {
  const swiper = useRef<Swiper>()

  useEffect(() => {
    swiper.current = new Swiper('.swiper')
  }, [])

  return (
    <div class="Gallery swiper" id="Gallery">
      {items.map((item) => (
        <div class="swiper-slide">
          <img src={item.image.src} alt="full" />
        </div>
      ))}
    </div>
  )
}
