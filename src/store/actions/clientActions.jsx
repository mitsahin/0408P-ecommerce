import axiosClient from '../../api/axiosClient'

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
