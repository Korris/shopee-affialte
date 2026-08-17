import axios from "axios"

// Khởi tạo axios instance — API cùng repo (Nuxt server routes) nên baseURL rỗng
const api = axios.create({
  baseURL: "",
  timeout: 20000,
})

export default api
