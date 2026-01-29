import { combineReducers } from 'redux'
import uiReducer from './uiReducer'
import productsReducer from './productsReducer'

const rootReducer = combineReducers({
  ui: uiReducer,
  products: productsReducer,
})

export default rootReducer
