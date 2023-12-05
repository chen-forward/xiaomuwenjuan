import React, { FC } from "react"
import { Outlet } from "react-router-dom"
import { Spin } from "antd"
import useLoadUserData from "../hooks/useLoadUserData"
import useNavPage from "../hooks/useNavPage"

const QuestionLayout: FC = () => {
  // Ajax加载用户信息
  const { waitingUserData } = useLoadUserData()
  // 用户没有登录时，跳转到登录页
  useNavPage(waitingUserData)

  return (
    <div style={{ height: "100vh" }}>
      {waitingUserData ? (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <Spin />
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  )
}

export default QuestionLayout
