const initialState = {
  user: {},
  addressList: [],
  creditCards: [],
  roles: [],
  theme: '',
  language: '',
}

const clientReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'client/setUser':
      return { ...state, user: action.payload }
    case 'client/setRoles':
      return { ...state, roles: action.payload }
    case 'client/setTheme':
      return { ...state, theme: action.payload }
    case 'client/setLanguage':
      return { ...state, language: action.payload }
    default:
      return state
  }
}

export default clientReducer
