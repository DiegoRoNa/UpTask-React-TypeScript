

// CLIENTE DE AXIOS
import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

// configurar headers para caada peticion http
api.interceptors.request.use( config => {
    const token = localStorage.getItem('AUTH_TOKEN_UPTASK')

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

export default api