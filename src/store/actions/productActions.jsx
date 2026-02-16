import { toast } from 'react-toastify'
import axiosClient from '../../api/axiosClient'

export const setCategories = (categories) => ({
  type: 'products/setCategories',
  payload: categories,
})

export const setProductList = (products) => ({
  type: 'products/setProductList',
  payload: products,
})

export const setProduct = (product) => ({
  type: 'products/setProduct',
  payload: product,
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

export const fetchCategories = () => async (dispatch) => {
  try {
    const response = await axiosClient.get('/categories')
    dispatch(setCategories(response?.data ?? []))
  } catch (_error) {
    dispatch(setCategories([]))
  }
}

const buildQueryParams = (params = {}) => {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    query.set(key, String(value))
  })
  const queryString = query.toString()
  return queryString ? `?${queryString}` : ''
}

export const fetchProducts = (params = {}) => async (dispatch) => {
  dispatch(setFetchState('FETCHING'))

  try {
    const queryString = buildQueryParams(params)
    if (import.meta.env?.DEV) {
      console.info(`Fetching products${queryString}`)
    }
    const response = await axiosClient.get(`/products${queryString}`)
    const list = response?.data?.products ?? response?.data ?? []
    const total = response?.data?.total ?? list?.length ?? 0
    dispatch(setProductList(list))
    dispatch(setTotal(total))
    dispatch(setFetchState('FETCHED'))
  } catch (error) {
    if (import.meta.env?.DEV) {
      const status = error?.response?.status
      const detail = error?.response?.data?.message || error?.message
      const parts = [
        'Products fetch failed',
        status ? `(${status})` : null,
        detail ? `- ${detail}` : null,
      ].filter(Boolean)
      toast.error(parts.join(' '), {
        autoClose: 2000,
        toastId: 'products-fetch-error',
      })
    }
    dispatch(setFetchState('FAILED'))
  }
}

export const fetchProductById = (productId) => async (dispatch) => {
  dispatch(setFetchState('FETCHING'))

  try {
    const response = await axiosClient.get(`/products/${productId}`)
    dispatch(setProduct(response?.data ?? null))
    dispatch(setFetchState('FETCHED'))
  } catch (_error) {
    dispatch(setFetchState('FAILED'))
  }
}
