import axios from "axios"

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE ?? 'http://localhost:5000',
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) { config.headers['Authorization'] = `Basic ${token}` }
  return config
})

export async function login({ seller_id, seller_zip_code_prefix }) {
  const token = window.btoa(seller_id + ":" + seller_zip_code_prefix)
  localStorage.setItem("token", token)
}

export async function logout() {
  localStorage.removeItem("token")
}

// account
export async function getAccount() {
  const { data } = await http.get("/account")
  return data
}

export async function updateAccount({ seller_city, seller_state }) {
  const { data } = await http.put("/account", { seller_city, seller_state })
  return data
}

// order items
export async function getOrderItems({ offset, limit, sort }) {
  const query = new URLSearchParams()
  query.set("offset", offset)
  query.set("limit", limit)
  if (sort) query.set("sort", sort)

  const { data } = await http.get(`/order_items?${query}`)
  return data
}

export async function getOrderItem({ id }) {
  const { data } = await http.get(`/order_items/${id}`)
  return data
}

export async function updateOrderItem({ id, price, date }) {
  const { data } = await http.put(`/order_items/${id}`, { id, price, date })
  return data
}

export async function deleteOrderItem({ id }) {
  const { data } = await http.delete(`/order_items/${id}`)
  return data
}

// sellers
export async function getSellers({ offset, limit }) {
  const query = new URLSearchParams()
  query.set("offset", offset)
  query.set("limit", limit)

  const { data } = await http.get(`/sellers?${query}`)
  return data
}
