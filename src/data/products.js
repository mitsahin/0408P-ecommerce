import productCover from '../assets/product-cover-5.png'
import productCover1 from '../assets/product-cover-5 (1).png'
import productCover2 from '../assets/product-cover-5 (2).png'
import productCover3 from '../assets/product-cover-5 (3).png'
import productCover4 from '../assets/product-cover-5 (4).png'
import productCover5 from '../assets/product-cover-5 (5).png'
import productCover6 from '../assets/product-cover-5 (6).png'
import productCover7 from '../assets/product-cover-5 (7).png'

const baseProducts = [
  productCover,
  productCover1,
  productCover2,
  productCover3,
  productCover4,
  productCover5,
  productCover6,
  productCover7,
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
