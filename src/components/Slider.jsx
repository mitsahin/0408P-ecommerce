import Slider from 'react-slick'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import heroImage from '../assets/shop-hero-1-product-slide-1.jpg'

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
    image: heroImage,
  },
  {
    id: 3,
    season: 'SUMMER 2020',
    title: 'HOT DEALS',
    description: 'Limited-time offers across our catalog.',
    image: heroImage,
  },
]

const SliderArrow = ({ onClick, direction }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute top-1/2 z-10 flex h-[44.4706px] w-[24px] -translate-y-1/2 items-center justify-center text-white transition hover:text-white/80 ${
        direction === 'left' ? 'left-4 sm:left-6' : 'right-4 sm:right-6'
      }`}
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
  const settings = {
    arrows: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    nextArrow: <SliderArrow direction="right" />,
    prevArrow: <SliderArrow direction="left" />,
    appendDots: (dots) => (
      <div className="flex w-full items-center justify-center pb-6">
        <ul className="flex items-center gap-3">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <span className="block h-1.5 w-12 rounded-full bg-white/80" />
    ),
  }

  return (
    <div className="flex w-full flex-col">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id}>
            <div
              className="flex min-h-[520px] w-full overflow-hidden rounded-none bg-cover bg-center text-white sm:min-h-[560px] lg:min-h-[620px]"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="flex w-full flex-col items-center justify-center gap-4 px-6 py-10 text-center sm:w-[48%] sm:items-start sm:px-12 sm:text-left lg:w-[45%] lg:px-16">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] sm:text-sm">
                  {slide.season}
                </p>
                <h2 className="text-4xl font-bold uppercase sm:text-5xl lg:text-6xl">
                  {slide.title}
                </h2>
                <p className="text-sm text-white/90 sm:text-base">
                  {slide.description}
                </p>
                <Link
                  to="/shop"
                  className="flex w-fit items-center justify-center rounded bg-emerald-500 px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-emerald-400"
                >
                  Shop now
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
