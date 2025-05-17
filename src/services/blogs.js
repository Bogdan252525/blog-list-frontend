import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
let config = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const setConfig = () => {
  config = {
    headers: { Authorization: token },
  }
}

const getAll = async () => {
  setConfig()

  const response = await axios.get(baseUrl, config)
  console.log(response)
  return response.data
}

const create = async (newObject) => {
  setConfig()

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const put = async (likes, id) => {
  setConfig()

  const response = await axios.put(`${baseUrl}/${id}`, likes, config)
  return response.data
}

const deleteBlog = async (id) => {
  setConfig()

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { getAll, create, put, deleteBlog, setToken }
