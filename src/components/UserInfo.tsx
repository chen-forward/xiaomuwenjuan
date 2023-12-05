import React, { FC } from "react"
import { Link, useNavigate } from "react-router-dom"
import { UserOutlined } from "@ant-design/icons"
// import { useRequest } from "ahooks"
import { Button, message } from "antd"
import { useDispatch } from "react-redux"
import { LOGIN_PATHNAME } from "../router"
// import { getUserInfoService } from "../services/user"
import { removeToken } from "../utils/user-token"
import useGetUserInfo from "../hooks/useGetUserInfo"
import { logoutReducer } from "../store/userReducer"

const UserInfo: FC = () => {
  const nav = useNavigate()
  const dispatch = useDispatch()
  // const { data } = useRequest(getUserInfoService)
  // const { username, nickname } = data || {}
  // 获取用户信息
  const { username, nickname } = useGetUserInfo()

  // 退出登录
  function logout() {
    dispatch(logoutReducer()) //派发任务 清空redux user用户信息数据
    removeToken() //清除token的存储
    message.success("退出成功")
    nav(LOGIN_PATHNAME)
  }

  const UserInfo = (
    <>
      <span style={{ color: "#fff" }}>
        <UserOutlined />
        {nickname}
      </span>
      <Button type="link" onClick={logout}>
        退出登录
      </Button>
    </>
  )

  const Login = <Link to={LOGIN_PATHNAME}>登录</Link>

  return <>{username ? UserInfo : Login}</>
}

export default UserInfo
