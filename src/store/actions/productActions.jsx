import axiosClient from '../../api/axiosClient'

export const setCategories = (categories) => ({
  type: 'products/setCategories',
  payload: categories,
})

export const setProductList = (products) => ({
  type: 'products/setProductList',
  payload: products,
})

export const setTotal = (total) => ({
  type: 'products/setTotal',
  payload: total,
})

export const setFetchState = (fetchState) => ({
  type: 'products/setFetchState',
  payload: fetchState,
})

export const setLimit = (limit) => ({
  type: 'products/setLimit',
  payload: limit,
})

export const setOffset = (offset) => ({
  type: 'products/setOffset',
  payload: offset,
})

export const setFilter = (filter) => ({
  type: 'products/setFilter',
  payload: filter,
})

export const fetchProducts = () => async (dispatch) => {
  dispatch(setFetchState('FETCHING'))

  try {
    const response = await axiosClient.get('/products')
    const list = response?.data?.products ?? response?.data ?? []
    const total = response?.data?.total ?? list?.length ?? 0
    dispatch(setProductList(list))
    dispatch(setTotal(total))
    dispatch(setFetchState('FETCHED'))
  } catch (error) {
    dispatch(setFetchState('FAILED'))
  }
}
