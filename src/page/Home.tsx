import React, { FC } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Typography, message } from "antd"
import { LOGIN_PATHNAME, MANAGE_INDEX_PATHNAME } from "../router"
import styles from "./Home.module.scss"
import { getToken } from "../utils/user-token"

// import axios from "axios"

const { Title, Paragraph } = Typography

const Home: FC = () => {
  // 路由跳转的第三方hook
  const nav = useNavigate()

  // useEffect(() => {
  //   fetch("/api/test")
  //     .then(res => res.json())
  //     .then(data => console.log("fetch data", data))

  // axios.get("/api/test").then(res => console.log("axios data", res))
  // })

  // function clickHandler() {
  //  路由跳转拼接参数的两种方式
  //   nav("/login?b=20")
  //   nav({
  //     pathname: "/login",
  //     search: "b=30",
  //   })
  // }

  // useParam()是获取动态路由的动态参数
  // useSearchParam()是获取url参数

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <Title>问卷调查 | 在线投票</Title>
        <Paragraph>已累计创建问卷 100 份，发布问卷 90 份 ，收到答卷 980 份</Paragraph>
        <div>
          <Button
            type="primary"
            onClick={() => {
              if (!getToken()) {
                nav(LOGIN_PATHNAME)
                return
              }
              nav(MANAGE_INDEX_PATHNAME)
            }}
          >
            开始使用
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Home
