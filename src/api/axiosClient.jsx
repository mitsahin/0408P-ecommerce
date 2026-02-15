import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'https://workintech-fe-ecommerce.onrender.com',
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
