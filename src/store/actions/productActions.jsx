import axiosClient from '../../api/axiosClient'

export const fetchProducts = () => async (dispatch) => {
  dispatch({ type: 'products/fetchStart' })

  try {
    const response = await axiosClient.get('/products')
    dispatch({ type: 'products/fetchSuccess', payload: response.data })
  } catch (error) {
    const message =
      error?.response?.data?.message || error?.message || 'Request failed'
    dispatch({ type: 'products/fetchError', payload: message })
  }
}
