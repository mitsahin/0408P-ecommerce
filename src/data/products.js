import bestsellerOne from '../assets/23057910d190d178c2a7b276e896b9d38b982bf6.jpg'
import bestsellerTwo from '../assets/4a6a10161217dc07ba1cda4632e93a5851162bcb.jpg'
import bestsellerThree from '../assets/74e648e43f346f3e64ec6890751ec33b3c7f5197.jpg'
import bestsellerFour from '../assets/edfda1c222054dedce3ff32fe480d8fc8eb07474.jpg'
import bestsellerFive from '../assets/110bc11c4432558f247264194359558513a225fe.jpg'
import bestsellerSix from '../assets/41ba1a582a6be5d0abdf4716fbac8cd3a73cb266.jpg'
import bestsellerSeven from '../assets/a4b9d5defc9e3b83803619da05903140ffc77947.jpg'
import bestsellerEight from '../assets/c91168410dcfe4d267b32aaf7b21288f7b9656f2.jpg'

const baseProducts = [
  bestsellerOne,
  bestsellerTwo,
  bestsellerThree,
  bestsellerFour,
  bestsellerFive,
  bestsellerSix,
  bestsellerSeven,
  bestsellerEight,
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
