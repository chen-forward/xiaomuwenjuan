// 回收站列表
import React, { FC, useState } from "react"
import { useRequest, useTitle } from "ahooks"
import { Typography, Empty, Table, Tag, Button, Space, Modal, Spin, message } from "antd"
import { ExclamationCircleOutlined } from "@ant-design/icons"
import ListSearch from "../../components/ListSearch"
import ListPage from "../../components/ListPage"
import useLoadQuestionListData from "../../hooks/useLoadQuestionListData"
import { deletedQuestionService, updateQuestionService } from "../../services/question"
import styles from "./common.module.scss"

const { confirm } = Modal
const { Title } = Typography

const Trash: FC = () => {
  useTitle("小慕问卷 - 我的问卷")

  // 获取问卷列表数据
  const { data = {}, loading, refresh } = useLoadQuestionListData({ isDeleted: true })
  const { list = [], total = 0 } = data

  // 记录选中的问卷id
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // 向服务端发送请求 问卷恢复
  const { run: recover } = useRequest(
    async () => {
      // 处理多个异步请求
      for await (const id of selectedIds) {
        await updateQuestionService(id, { isDeleted: false })
      }
    },
    {
      manual: true, //手动点击按钮执行
      debounceWait: 500, //防抖
      onSuccess() {
        message.success("恢复成功")
        refresh() //手动刷新列表
        setSelectedIds([])
      },
    }
  )

  // 向服务端发送请求 彻底删除问卷
  const { run: deletedQuestion } = useRequest(
    async () => await deletedQuestionService(selectedIds),
    {
      manual: true,
      onSuccess() {
        message.success("删除成功")
        refresh()
        setSelectedIds([]) //操作完成后清空选择的问卷id让删除恢复按钮禁用
      },
    }
  )

  // 点击删除按钮
  function del() {
    // 弹窗提示
    confirm({
      title: "确定删除该问卷?",
      icon: <ExclamationCircleOutlined />,
      content: "删除以后不可以找回",
      onOk: deletedQuestion,
    })
  }

  // 定义表格的列数据
  const tableColumns = [
    {
      title: "标题",
      dataIndex: "title",
      // key: "title",循环列的key，它会默认取dataIndex的值
    },
    {
      title: "是否发布",
      dataIndex: "isPublished",
      // 根据数据源返回自定义的jsx片段
      render: (isPublished: boolean) => {
        return isPublished ? <Tag color="processing">已发布</Tag> : <Tag>未发布</Tag>
      },
    },
    {
      title: "答卷",
      dataIndex: "answerCount",
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
    },
  ]
  // 可以把jsx片段定义为一个变量
  const TableElem = (
    <>
      <div style={{ marginBottom: "16px" }}>
        <Space>
          <Button type="primary" disabled={selectedIds.length === 0} onClick={recover}>
            恢复
          </Button>
          <Button danger disabled={selectedIds.length === 0} onClick={del}>
            彻底删除
          </Button>
        </Space>
      </div>
      <Table
        dataSource={list}
        columns={tableColumns}
        pagination={false}
        rowKey={q => q._id}
        rowSelection={{
          type: "checkbox",
          onChange: selectedRowKeys => {
            setSelectedIds(selectedRowKeys as string[])
          },
        }}
      />
    </>
  )

  return (
    <>
      <div className={styles.header}>
        <div className={styles.left}>
          <Title level={3}>回收站</Title>
        </div>
        <div className={styles.right}>
          <ListSearch />
        </div>
      </div>
      <div className={styles.content}>
        {loading && (
          <div style={{ textAlign: "center" }}>
            <Spin />
          </div>
        )}
        {!loading && list.length === 0 && <Empty description="暂无数据" />}
        {!loading && list.length > 0 && TableElem}
      </div>
      <div className={styles.footer}>
        <ListPage total={total} />
      </div>
    </>
  )
}

export default Trash
