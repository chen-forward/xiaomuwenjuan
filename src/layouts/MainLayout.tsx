import React, { FC } from "react"
import { Outlet } from "react-router-dom"
import { Layout, Spin } from "antd"
import Logo from "../components/Logo"
import UserInfo from "../components/UserInfo"
import useNavPage from "../hooks/useNavPage"
import useLoadUserData from "../hooks/useLoadUserData"
import styles from "./MainLayout.module.scss"

const { Header, Content, Footer } = Layout

const MainLayout: FC = () => {
  // Ajax请求用户数据
  const { waitingUserData } = useLoadUserData()
  useNavPage(waitingUserData)

  return (
    <Layout>
      <Header className={styles.header}>
        <div className={styles.left}>
          <Logo />
        </div>
        <div className={styles.right}>
          <UserInfo />
        </div>
      </Header>
      <Content className={styles.main}>
        {waitingUserData ? (
          <div style={{ textAlign: "center", marginTop: "100px" }}>
            <Spin />
          </div>
        ) : (
          <Outlet />
        )}
      </Content>
      <Footer className={styles.footer}>小慕问卷 &copy;2023 - present. Created by 陈家业</Footer>
    </Layout>
  )
}

export default MainLayout
