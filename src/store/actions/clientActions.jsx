import axiosClient, { clearAuthToken, setAuthToken } from '../../api/axiosClient'
import {
  clearStoredToken,
  getStoredToken,
  persistToken,
  renewStoredToken,
} from '../../utils/authStorage'
import { clearWishlistIds } from '../../utils/wishlist'

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
  } catch (_error) {
    dispatch(setRoles([]))
  }
}

export const loginUser = ({ email, password, remember }) => async (dispatch) => {
  try {
    const response = await axiosClient.post('/login', { email, password })
    const token = response?.data?.token
    const user = response?.data?.user ?? response?.data

    if (token) {
      setAuthToken(token)
      persistToken(token, Boolean(remember))
    }

    dispatch(setUser(user ?? {}))
    return { user, token }
  } catch (error) {
    dispatch(setUser({}))
    throw error
  }
}

export const verifyTokenIfExists = () => async (dispatch) => {
  const token = getStoredToken()
  if (!token) return null

  try {
    setAuthToken(token)
    const response = await axiosClient.get('/verify')
    const user = response?.data?.user ?? response?.data
    const renewedToken = response?.data?.token
    const nextToken = renewedToken || token
    renewStoredToken(nextToken)
    setAuthToken(nextToken)
    dispatch(setUser(user ?? {}))
    return user
  } catch (_error) {
    clearStoredToken()
    clearAuthToken()
    dispatch(setUser({}))
    return null
  }
}

export const logoutUser = () => (dispatch) => {
  clearStoredToken()
  clearAuthToken()
  clearWishlistIds()
  dispatch(setUser({}))
}
