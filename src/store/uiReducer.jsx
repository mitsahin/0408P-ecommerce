const initialState = {
  loading: false,
}

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ui/setLoading':
      return {
        ...state,
        loading: action.payload,
      }
    default:
      return state
  }
}

export default uiReducer
