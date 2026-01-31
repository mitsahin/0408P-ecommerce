import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'https://workintech-fe-ecommerce.onrender.com',
  timeout: 10000,
})

export default axiosClient
