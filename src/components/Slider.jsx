import { useEffect, useRef, useState } from 'react'
import Slider from 'react-slick'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import heroImage from '../assets/mobil-s1.jpg'
import heroImageAlt from '../assets/vv2.jpg'
import heroImageAlt2 from '../assets/vv1.jpg'
import heroImageAlt3 from '../assets/card-cover-7-11.jpg'


const slides = [
  {
    id: 1,
    season: 'SUMMER 2020',
    title: 'NEW COLLECTION',
    description:
      'We know how large objects will act, but things on a small scale.',
    image: heroImage,
  },
  {
    id: 2,
    season: 'SUMMER 2020',
    title: 'STYLE EDIT',
    description: 'Curated looks inspired by the season.',
    image: heroImageAlt,
  },
  {
    id: 3,
    season: 'SUMMER 2020',
    title: 'HOT DEALS',
    description: 'Limited-time offers across our catalog.',
    image: heroImageAlt2,
    position: '80% center',
  },
  {
    id: 4,
    season: 'SUMMER 2020',
    title: 'NEW ARRIVALS',
    description: 'Fresh picks designed for the season.',
    image: heroImageAlt3,
    position: '80% center',
  },
]

const SliderArrow = ({ onClick, direction, className, style }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${className ?? ''} absolute top-1/2 z-30 flex h-[44.4706px] w-[24px] -translate-y-1/2 items-center justify-center text-white transition hover:text-white/80 ${
        direction === 'left' ? 'left-4 sm:left-6' : 'right-4 sm:right-6'
      }`}
      style={{ display: 'flex', pointerEvents: 'auto', ...style }}
    >
      {direction === 'left' ? (
        <ArrowLeft className="h-7 w-7" />
      ) : (
        <ArrowRight className="h-7 w-7" />
      )}
    </button>
  )
}

const HomeSlider = () => {
  const sliderRef = useRef(null)
  const sliderContainerRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px)')
    const handleChange = () => setIsMobile(mediaQuery.matches)
    handleChange()
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [])
  const settings = {
    arrows: false,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    beforeChange: (current, next) => {
      setActiveIndex(next)
      if (
        sliderContainerRef.current &&
        sliderContainerRef.current.contains(document.activeElement)
      ) {
        document.activeElement.blur()
      }
    },
    appendDots: (dots) => (
      <div className="flex w-full items-center justify-center pb-6">
        <ul className="flex items-center gap-3">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <span className="block h-1.5 w-12 rounded-full bg-white/70" />
    ),
  }

  return (
    <div className="relative flex w-full flex-col" ref={sliderContainerRef}>
      <button
        type="button"
        onClick={() => sliderRef.current?.slickPrev()}
        className="absolute left-2 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/20 text-white shadow-lg transition hover:bg-white/30"
        aria-label="Previous slide"
      >
        <ArrowLeft className="h-8 w-8" />
      </button>
      <button
        type="button"
        onClick={() => sliderRef.current?.slickNext()}
        className="absolute right-2 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/20 text-white shadow-lg transition hover:bg-white/30"
        aria-label="Next slide"
      >
        <ArrowRight className="h-8 w-8" />
      </button>
      <Slider ref={sliderRef} {...settings}>
      {slides.map((slide, index) => (
        <div key={slide.id}>
            <div
              className="relative mx-auto flex min-h-[753px] w-[412px] overflow-hidden rounded-none bg-cover bg-right text-white sm:mx-0 sm:min-h-[560px] sm:w-full lg:min-h-[620px]"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundPosition: isMobile
                  ? 'center'
                  : slide.position || 'right center',
              }}
            >
              <div className="relative z-10 flex w-full max-w-[320px] flex-col items-center justify-center gap-4 px-6 py-12 text-center sm:w-[52%] sm:max-w-none sm:items-start sm:px-12 sm:text-left lg:w-[48%] lg:px-16">
                <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-white/85 sm:text-sm">
                  {slide.season}
                </p>
                <h2
                  className="h-[100px] w-[268px] text-center text-[40px] font-bold uppercase leading-[50px] tracking-[0.2px] sm:h-auto sm:w-auto sm:text-5xl sm:leading-[56px] sm:text-left lg:text-6xl lg:leading-[64px]"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {slide.title}
                </h2>
                <p
                  className="text-center text-[20px] font-normal leading-[30px] tracking-[0.2px] text-white/85 sm:max-w-[420px] sm:text-base sm:text-left"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {slide.description}
                </p>
                <Link
                  to="/shop"
                  tabIndex={activeIndex === index ? 0 : -1}
                  aria-hidden={activeIndex === index ? 'false' : 'true'}
                  className="flex h-[62px] w-[221px] items-center justify-center gap-[10px] rounded-[5px] bg-[#2DC071] px-[40px] py-[15px] text-center text-[24px] font-bold leading-[32px] tracking-[0.1px] text-white shadow-sm transition hover:bg-[#26aa60]"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  SHOP NOW
                </Link>
              </div>
              <div className="hidden flex-1 sm:flex" />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default HomeSlider
