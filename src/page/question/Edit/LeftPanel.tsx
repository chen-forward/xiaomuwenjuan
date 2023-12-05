import React, { FC } from "react"
import { Tabs } from "antd"
import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons"
import ComponentLib from "./ComponentLib"
import Layers from "./Layers"

// 问卷编辑页左侧组件
const LeftPanel: FC = () => {
  // tab栏数据
  const tabsItems = [
    {
      key: "componentLib",
      label: (
        <span>
          <AppstoreOutlined />
          组件库
        </span>
      ),
      children: <ComponentLib />,
    },
    {
      key: "layers",
      label: (
        <span>
          <BarsOutlined />
          图层
        </span>
      ),
      children: <Layers />,
    },
  ]
  return <Tabs defaultActiveKey="componentLib" items={tabsItems} />
}

export default LeftPanel
