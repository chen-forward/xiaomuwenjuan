import React from "react"
import { RouterProvider } from "react-router-dom"
import routerConfig from "./router" //引入路由配置
import "antd/dist/reset.css"
import "./App.css"

function App() {
  return <RouterProvider router={routerConfig}></RouterProvider>
}

export default App
