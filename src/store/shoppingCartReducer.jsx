const initialState = {
  cart: [],
  couponCode: '',
  appliedCoupon: '',
  payment: {},
  address: {},
}

const normalizeCartItems = (items) => {
  if (!Array.isArray(items)) return []
  return items
    .map((item) => {
      const count = Number(item?.count ?? 1)
      if (!item?.product || !item.product.id) return null
      return {
        ...item,
        count: Number.isFinite(count) && count > 0 ? Math.floor(count) : 1,
        checked: item?.checked !== false,
      }
    })
    .filter(Boolean)
}

const shoppingCartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'shoppingCart/setCart':
      return { ...state, cart: normalizeCartItems(action.payload) }
    case 'shoppingCart/setCouponCode':
      return { ...state, couponCode: action.payload }
    case 'shoppingCart/setAppliedCoupon':
      return { ...state, appliedCoupon: action.payload }
    case 'shoppingCart/setPayment':
      return { ...state, payment: action.payload }
    case 'shoppingCart/setAddress':
      return { ...state, address: action.payload }
    default:
      return state
  }
}

export default shoppingCartReducer
