import axios from "axios"

const api = axios.create({
    baseUrl: import.meta.env.VITE_API_BASE_URL
})

// Attach token if present
api.interceptors.request.use((config) => {
    const raw = localStorage.getItem('ustadi_user');
    if (raw) {
        const user = JSON.parse(raw)
        if (token) config.headers.Authorization = `Bearer ${token}`
    }
    return config
})
export default api