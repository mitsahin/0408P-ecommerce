import axios from 'axios'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
})

export const setAuthToken = (token) => {
  if (token) {
    axiosClient.defaults.headers.common.Authorization = token
  }
}

export const clearAuthToken = () => {
  delete axiosClient.defaults.headers.common.Authorization
}

export default axiosClient
