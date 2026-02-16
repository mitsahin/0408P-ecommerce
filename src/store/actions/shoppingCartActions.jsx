export const setCart = (cart) => ({
  type: 'shoppingCart/setCart',
  payload: cart,
})

export const setCouponCode = (couponCode) => ({
  type: 'shoppingCart/setCouponCode',
  payload: couponCode,
})

export const setAppliedCoupon = (couponCode) => ({
  type: 'shoppingCart/setAppliedCoupon',
  payload: couponCode,
})

export const setPayment = (payment) => ({
  type: 'shoppingCart/setPayment',
  payload: payment,
})

export const setAddress = (address) => ({
  type: 'shoppingCart/setAddress',
  payload: address,
})
