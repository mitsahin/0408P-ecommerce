export const setCart = (cart) => ({
  type: 'shoppingCart/setCart',
  payload: cart,
})

export const setPayment = (payment) => ({
  type: 'shoppingCart/setPayment',
  payload: payment,
})

export const setAddress = (address) => ({
  type: 'shoppingCart/setAddress',
  payload: address,
})
