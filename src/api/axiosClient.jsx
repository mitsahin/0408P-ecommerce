import axios from 'axios'
import { clearStoredToken, getStoredToken } from '../utils/authStorage'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 15000,
})

export const setAuthToken = (token) => {
  if (token) {
    axiosClient.defaults.headers.common.Authorization = token
  } else {
    delete axiosClient.defaults.headers.common.Authorization
  }
}

export const clearAuthToken = () => {
  delete axiosClient.defaults.headers.common.Authorization
}

axiosClient.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = token
  }
  return config
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearStoredToken()
      clearAuthToken()
    }
    return Promise.reject(error)
  }
)

export default axiosClient
