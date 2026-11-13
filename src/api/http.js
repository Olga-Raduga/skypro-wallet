const API_BASE_URL = 'https://wedev-api.sky.pro/api'
const TOKEN_STORAGE_KEY = 'skypro-wallet-token'
export function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}
export function setToken(token) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}
export function clearToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}
export async function apiRequest(path, options = {}) {
  const { method = 'GET', body, auth = true } = options
  const headers = {
    Accept: 'application/json',
  }
  
  const token = auth ? getToken() : null
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })
  const responseText = await response.text()
  let data = null
  if (responseText) {
    try {
      data = JSON.parse(responseText)
    } catch {
      data = responseText
    }
  }
  if (!response.ok) {
    const message =
      typeof data === 'string'
        ? data
        : data?.message || data?.error || `Ошибка запроса: ${response.status}`
    const error = new Error(message)
    error.status = response.status
    throw error
  }
  return data
}