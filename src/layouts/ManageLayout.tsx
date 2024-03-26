import React, { FC } from "react"
import { useRequest } from "ahooks"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { Button, Space, Divider, message } from "antd"
import { PlusOutlined, BarsOutlined, StarOutlined, DeleteOutlined } from "@ant-design/icons"
import { createQuestionService } from "../services/question"
import styles from "./ManageLayout.module.scss"

const ManageLayout: FC = () => {
  // 路由跳转
  const nav = useNavigate()
  // 获取当前路径 利用路径实现高亮
  const { pathname } = useLocation()

  // const [loading, setLoading] = useState(false)
  // async function handleCreateClick() {
  //   setLoading(true)
  //   const data = await createQuestionService()
  //   const { id } = data || {}
  //   if (id) {
  //     nav(`/question/edit/${id}`)
  //     message.success("创建成功")
  //   }
  //   setLoading(false)
  // }

  // 向服务端发送网络请求 创建问卷
  const { loading, run: handleCreateClick } = useRequest(createQuestionService, {
    manual: true,
    onSuccess(result) {
      nav(`/question/edit/${result.id || result._id}`)
      message.success("创建成功")
    },
  })

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Space direction="vertical">
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleCreateClick}
            disabled={loading}
          >
            新建问卷
          </Button>
          <Divider style={{ borderTop: "transparent" }} />
          <Button
            type={pathname.startsWith("/manage/list") ? "default" : "text"}
            size="large"
            icon={<BarsOutlined />}
            onClick={() => {
              nav("/manage/list")
            }}
          >
            我的问卷
          </Button>
          <Button
            type={pathname.startsWith("/manage/star") ? "default" : "text"}
            size="large"
            icon={<StarOutlined />}
            onClick={() => {
              nav("/manage/star")
            }}
          >
            星标问卷
          </Button>
          <Button
            type={pathname.startsWith("/manage/trash") ? "default" : "text"}
            size="large"
            icon={<DeleteOutlined />}
            onClick={() => {
              nav("/manage/trash")
            }}
          >
            回收站
          </Button>
        </Space>
      </div>
      <div className={styles.right}>
        <Outlet />
      </div>
    </div>
  )
}

export default ManageLayout
