const initialState = {
  items: [],
  loading: false,
  error: null,
}

const productsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'products/fetchStart':
      return {
        ...state,
        loading: true,
        error: null,
      }
    case 'products/fetchSuccess':
      return {
        ...state,
        loading: false,
        items: action.payload,
      }
    case 'products/fetchError':
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    default:
      return state
  }
}

export default productsReducer
