import React, { FC, useEffect, useState } from "react"
import { Space, Typography } from "antd"
import { Link } from "react-router-dom"
import { FormOutlined } from "@ant-design/icons"
import useGetUserInfo from "../hooks/useGetUserInfo"
import { HOME_PATHNAME, MANAGE_INDEX_PATHNAME } from "../router"
import styles from "./Logo.module.scss"
import { getToken } from "../utils/user-token"

const { Title } = Typography //排版文本

const Logo: FC = () => {
  // 获取用户信息
  const { username } = useGetUserInfo()

  const [pathname, setPathname] = useState(HOME_PATHNAME)

  const token = getToken()

  useEffect(() => {
    // 已经登录 进入列表页面
    if (username) {
      setPathname(MANAGE_INDEX_PATHNAME)
    }
  }, [username])

  return (
    <div className={styles.container}>
      <Link to={token ? pathname : HOME_PATHNAME}>
        <Space>
          <Title>
            <FormOutlined />
          </Title>
          <Title>小慕问卷</Title>
        </Space>
      </Link>
    </div>
  )
}

export default Logo
