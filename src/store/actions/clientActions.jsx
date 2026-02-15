import axiosClient, { clearAuthToken, setAuthToken } from '../../api/axiosClient'

export const setUser = (user) => ({
  type: 'client/setUser',
  payload: user,
})

export const setRoles = (roles) => ({
  type: 'client/setRoles',
  payload: roles,
})

export const setTheme = (theme) => ({
  type: 'client/setTheme',
  payload: theme,
})

export const setLanguage = (language) => ({
  type: 'client/setLanguage',
  payload: language,
})

export const fetchRolesIfNeeded = () => async (dispatch, getState) => {
  const currentRoles = getState()?.client?.roles ?? []
  if (currentRoles.length > 0) return

  try {
    const response = await axiosClient.get('/roles')
    dispatch(setRoles(response?.data ?? []))
  } catch (error) {
    dispatch(setRoles([]))
  }
}

export const loginUser = ({ email, password, remember }) => async (dispatch) => {
  const response = await axiosClient.post('/login', { email, password })
  const token = response?.data?.token
  const user = response?.data?.user ?? response?.data

  if (token) {
    setAuthToken(token)
    if (remember) {
      localStorage.setItem('token', token)
    }
  }

  dispatch(setUser(user ?? {}))
  return { user, token }
}

export const verifyTokenIfExists = () => async (dispatch) => {
  const token = localStorage.getItem('token')
  if (!token) return null

  try {
    setAuthToken(token)
    const response = await axiosClient.get('/verify')
    const user = response?.data?.user ?? response?.data
    const renewedToken = response?.data?.token
    if (renewedToken) {
      localStorage.setItem('token', renewedToken)
      setAuthToken(renewedToken)
    }
    dispatch(setUser(user ?? {}))
    return user
  } catch (error) {
    localStorage.removeItem('token')
    clearAuthToken()
    dispatch(setUser({}))
    return null
  }
}

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('token')
  clearAuthToken()
  dispatch(setUser({}))
}
