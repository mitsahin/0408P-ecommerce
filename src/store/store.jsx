import { applyMiddleware, createStore } from 'redux'
import { thunk } from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from './rootReducer'

const logger = createLogger({ collapsed: true })
const SHOPPING_CART_STORAGE_KEY = 'shoppingCartState'

const loadShoppingCartState = () => {
  try {
    const serialized = localStorage.getItem(SHOPPING_CART_STORAGE_KEY)
    if (!serialized) return undefined
    const parsed = JSON.parse(serialized)
    if (!parsed || typeof parsed !== 'object') return undefined
    return { shoppingCart: parsed }
  } catch {
    return undefined
  }
}

const saveShoppingCartState = (shoppingCartState) => {
  try {
    localStorage.setItem(
      SHOPPING_CART_STORAGE_KEY,
      JSON.stringify(shoppingCartState)
    )
  } catch {
    // Ignore write errors (private mode/quota)
  }
}

const preloadedState = loadShoppingCartState()
const store = createStore(
  rootReducer,
  preloadedState,
  applyMiddleware(thunk, logger)
)

store.subscribe(() => {
  const { shoppingCart } = store.getState()
  saveShoppingCartState(shoppingCart)
})

export default store
