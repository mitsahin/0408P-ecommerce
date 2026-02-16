const initialState = {
  cart: [],
  couponCode: '',
  appliedCoupon: '',
  payment: {},
  address: {},
}

const shoppingCartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'shoppingCart/setCart':
      return { ...state, cart: action.payload }
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
