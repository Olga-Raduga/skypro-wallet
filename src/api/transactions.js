import { apiRequest } from './http.js'
function makePayload({ description, sum, category, date }) {
  return {
    description: description.trim(),
    sum: Number(sum),
    category,
    date,
  }
}
export function getTransactions() {
  return apiRequest('/transactions')
}
export function addTransaction(transaction) {
  return apiRequest('/transactions', {
    method: 'POST',
    body: makePayload(transaction),
  })
}
export function updateTransaction(id, transaction) {
  return apiRequest(`/transactions/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: makePayload(transaction),
  })
}