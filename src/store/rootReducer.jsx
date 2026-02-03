import { combineReducers } from 'redux'
import clientReducer from './clientReducer'
import productsReducer from './productsReducer'
import shoppingCartReducer from './shoppingCartReducer'

const rootReducer = combineReducers({
  client: clientReducer,
  products: productsReducer,
  shoppingCart: shoppingCartReducer,
})

export default rootReducer
