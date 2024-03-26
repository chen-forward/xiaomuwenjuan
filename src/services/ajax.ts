import { message } from "antd"
import axios from "axios"
import { getToken } from "../utils/user-token"

// 传入配置创造一个实例
const instance = axios.create({
  baseURL: "http://localhost:3005/",
  timeout: 10 * 1000,
  headers: {},
})

// request请求拦截：每次请求都带上token
instance.interceptors.request.use(
  config => {
    config.headers["Authorization"] = `Bearer ${getToken()}` //JWT的固定格式
    return config
  },
  error => Promise.reject(error)
)

// response 拦截：统一处理error和msg
instance.interceptors.response.use(res => {
  const resData = (res.data || {}) as ResType
  const { errno, data, msg } = resData

  if (errno !== 0) {
    // 错误提示
    if (msg) {
      message.error(msg)
    }

    throw new Error(msg)
  }

  return data as any
})

export default instance

export type ResType = {
  errno: number
  data?: ResDataType
  msg?: string
}

export type ResDataType = {
  [key: string]: any
}
