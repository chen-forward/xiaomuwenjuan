import React, { lazy } from "react"
import { createBrowserRouter } from "react-router-dom"

import MainLayout from "../layouts/MainLayout"
import ManageLayout from "../layouts/ManageLayout"
import QuestionLayout from "../layouts/QuestionLayout"
import Home from "../page/Home"
import Login from "../page/Login"
import NotFound from "../page/NotFound"
import Register from "../page/Register"
import Star from "../page/manage/Star"
import List from "../page/manage/List"
import Trash from "../page/manage/Trash"
// import Edit from "../page/question/Edit"
// import Stat from "../page/question/Stat"

// 路由懒加载，拆分bundle，优化首页体积
const Edit = lazy(() => import("../page/question/Edit"))
const Stat = lazy(() => import("../page/question/Stat"))

// 定义常用的路由常量
export const HOME_PATHNAME = "/"
export const LOGIN_PATHNAME = "/login"
export const REGISTER_PATHNAME = "/register"
export const MANAGE_INDEX_PATHNAME = "/manage/list"

// 判断是否在登录页或注册页
export function isLoginOrRegister(pathname: string) {
  if ([LOGIN_PATHNAME, REGISTER_PATHNAME].includes(pathname)) return true
  return false
}

// 判断当前页面是否需要用户信息
export function noNeedUserInfo(pathname: string) {
  if ([HOME_PATHNAME, LOGIN_PATHNAME, REGISTER_PATHNAME].includes(pathname)) return true
  return false
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "manage",
        element: <ManageLayout />,
        children: [
          {
            path: "list",
            element: <List />,
          },
          {
            path: "star",
            element: <Star />,
          },
          {
            path: "trash",
            element: <Trash />,
          },
        ],
      },
      {
        path: "*", //404路由配置
        element: <NotFound />,
      },
    ],
  },
  {
    path: "question",
    element: <QuestionLayout />,
    children: [
      {
        path: "edit/:id",
        element: <Edit />,
      },
      {
        path: "stat/:id",
        element: <Stat />,
      },
    ],
  },
])

export default router
