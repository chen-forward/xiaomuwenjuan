import React, { FC, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Typography, Space, Form, Input, Button, Checkbox, message } from "antd"
import { UserAddOutlined } from "@ant-design/icons"
import { Link } from "react-router-dom"
import { useRequest } from "ahooks"
import { MANAGE_INDEX_PATHNAME, REGISTER_PATHNAME } from "../router"
import { loginService } from "../services/user"
import { setToken } from "../utils/user-token"
import styles from "./Register.module.scss"

const { Title } = Typography

const USERNAME_KEY = "username"
const PASSWORD_KEY = "password"

function rememberUser(username: string, password: string) {
  localStorage.setItem(USERNAME_KEY, username)
  localStorage.setItem(PASSWORD_KEY, password)
}

function deleteUserFromStorage() {
  localStorage.removeItem(USERNAME_KEY)
  localStorage.removeItem(PASSWORD_KEY)
}

function getUserFromStorage() {
  return {
    username: localStorage.getItem(USERNAME_KEY),
    password: localStorage.getItem(PASSWORD_KEY),
  }
}

const Login: FC = () => {
  const nav = useNavigate()
  const [form] = Form.useForm() // Form组件的第三方hook

  useEffect(() => {
    const { username, password } = getUserFromStorage()
    form.setFieldsValue({ username, password }) // 将密码设置到表单
  }, [])

  // 登录网络请求
  const { run } = useRequest(
    async (username: string, password: string) => {
      const data = await loginService(username, password)
      return data
    },
    {
      manual: true,
      onSuccess(result) {
        const { token = "" } = result
        setToken(token) //存储token
        message.success("登录成功")
        nav(MANAGE_INDEX_PATHNAME)
      },
    }
  )

  // 提交整个表单信息
  const onFinish = (values: any) => {
    const { username, password, remember } = values || {}
    run(username, password)

    if (remember) {
      // 记住用户名
      rememberUser(username, password)
    } else {
      // 删除用户名
      deleteUserFromStorage()
    }
  }

  return (
    <div className={styles.container}>
      <div>
        <Space>
          <Title level={2}>
            <UserAddOutlined />
          </Title>
          <Title level={2}>用户登录</Title>
        </Space>
      </div>
      <div>
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }} //表单默认数据
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: "请输入用户名" },
              { type: "string", min: 5, max: 20, message: "字符长度在 5-20 之间" },
              { pattern: /^\w+$/, message: "只能是字母数字下划线" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 16 }} valuePropName="checked" name="remember">
            <Checkbox>记住我</Checkbox>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                登录
              </Button>
              <Link to={REGISTER_PATHNAME}>注册新用户</Link>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login
