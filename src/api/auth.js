import { apiRequest } from './http.js'
export function registerUser({ login, name, password }) {
  return apiRequest('/user', {
    method: 'POST',
    auth: false,
    body: { login, name, password },
  })
}
export function loginUser({ login, password }) {
  return apiRequest('/user/login', {
    method: 'POST',
    auth: false,
    body: { login, password },
  })
}