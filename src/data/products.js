import productCover7 from '../assets/fixed-height.png'
import productCover8 from '../assets/a1.png'
import productCover9 from '../assets/p1.png'
import productAlt1 from '../assets/a2.jpg'
import productAlt2 from '../assets/accc.jpg'
import productAlt3 from '../assets/p5.png'
import productAlt4 from '../assets/a3.jpg'

const baseProducts = [
  productCover7,
  productCover8,
  productCover9,
  productAlt1,
  productAlt2,
  productAlt3,
  productAlt4,
  productCover8,
  productCover7,
  productAlt1,
  productAlt2,
  productCover9,
]

export const products = baseProducts.map((image, index) => ({
  id: `product-${index + 1}`,
  image,
  title: 'Graphic',
  department: 'English Department',
  price: '6.48',
  oldPrice: '16.48',
  colors: ['bg-sky-500', 'bg-emerald-500', 'bg-orange-400', 'bg-slate-800'],
}))
