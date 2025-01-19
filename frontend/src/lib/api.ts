export const api_dev = "http://localhost:8000"
export const api_prod = "https://career-compass-teal.vercel.app/api"

export const api = import.meta.env.DEV ? api_dev : api_prod
console.log(api)