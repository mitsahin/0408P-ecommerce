const initialState = {
  categories: [],
  productList: [],
  total: 0,
  limit: 25,
  offset: 0,
  filter: '',
  fetchState: 'NOT_FETCHED',
}

const productsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'products/setCategories':
      return { ...state, categories: action.payload }
    case 'products/setProductList':
      return { ...state, productList: action.payload }
    case 'products/setTotal':
      return { ...state, total: action.payload }
    case 'products/setFetchState':
      return { ...state, fetchState: action.payload }
    case 'products/setLimit':
      return { ...state, limit: action.payload }
    case 'products/setOffset':
      return { ...state, offset: action.payload }
    case 'products/setFilter':
      return { ...state, filter: action.payload }
    default:
      return state
  }
}

export default productsReducer
