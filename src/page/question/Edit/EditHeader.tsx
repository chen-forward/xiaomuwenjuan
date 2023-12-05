import React, { ChangeEvent, FC, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useRequest, useKeyPress, useDebounceEffect } from "ahooks"
import { Button, Typography, Space, Input, message } from "antd"
import { LeftOutlined, EditOutlined, LoadingOutlined } from "@ant-design/icons"
import EditToolbar from "./EditToolbar"
import useGetPageInfo from "../../../hooks/useGetPageInfo"
import useGetComponentInfo from "../../../hooks/useGetComponentInfo"
import { updateQuestionService } from "../../../services/question"
import { changePageTitle } from ".././../../store/pageInfoReducer"
import styles from "./EditHeader.module.scss"

const { Title } = Typography

// 显示和修改标题
const TitleElem: FC = () => {
  const { title } = useGetPageInfo()
  const dispatch = useDispatch()

  // 定义编辑标题状态
  const [editState, setEditState] = useState(false)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const newTitle = event.target.value.trim()
    if (!newTitle) return
    dispatch(changePageTitle(newTitle))
  }

  if (editState) {
    return (
      <Input
        value={title}
        onChange={handleChange}
        onPressEnter={() => setEditState(false)}
        onBlur={() => setEditState(false)}
      />
    )
  }

  return (
    <Space>
      <Title>{title}</Title>
      <Button icon={<EditOutlined />} type="text" onClick={() => setEditState(true)} />
    </Space>
  )
}

// 保存按钮组件
const SaveButton: FC = () => {
  const { id } = useParams()
  // 保存组件列表和页面信息
  const { componentList = [] } = useGetComponentInfo()
  const pageInfo = useGetPageInfo()

  const { loading, run: save } = useRequest(
    async () => {
      if (!id) return
      await updateQuestionService(id, { ...pageInfo, componentList })
    },
    { manual: true }
  )

  // 快捷键保存
  useKeyPress(["ctrl.s", "meta.s"], (event: KeyboardEvent) => {
    // 阻止默认行为
    event.preventDefault()
    if (!loading) save()
  })

  // 自动保存
  // useEffect(() => {
  //   save()
  // }, [componentList, pageInfo])

  // 监听内容变化，自动保存 对上面自动保存的优化 使用第三方库ahooks的useDebounceEffect
  useDebounceEffect(
    () => {
      save()
    },
    [componentList, pageInfo],
    {
      wait: 1000,
    }
  )

  return (
    <Button onClick={save} disabled={loading} icon={loading ? <LoadingOutlined /> : null}>
      保存
    </Button>
  )
}

// 发布按钮组件
const PublishButton: FC = () => {
  const nav = useNavigate()
  const { id } = useParams()
  // 发布组件列表和页面信息
  const { componentList = [] } = useGetComponentInfo()
  const pageInfo = useGetPageInfo()

  const { loading, run: pub } = useRequest(
    async () => {
      if (!id) return
      await updateQuestionService(id, {
        ...pageInfo,
        componentList,
        isPublish: true, //标志问卷已经被发布
      })
    },
    {
      manual: true,
      onSuccess() {
        message.success("发布成功")
        nav("/question/stat/" + id) //发布成功 跳转到统计页面
      },
    }
  )

  return (
    <Button type="primary" onClick={pub} disabled={loading}>
      发布
    </Button>
  )
}

// 编辑器头部
const EditHeader: FC = () => {
  const nav = useNavigate()

  return (
    <div className={styles["header-wrapper"]}>
      <div className={styles.header}>
        <div className={styles.left}>
          <Space>
            <Button type="link" icon={<LeftOutlined />} onClick={() => nav(-1)}>
              返回
            </Button>
            <TitleElem />
          </Space>
        </div>
        <div className={styles.main}>
          <EditToolbar />
        </div>
        <div className={styles.right}>
          <Space>
            <SaveButton />
            <PublishButton />
          </Space>
        </div>
      </div>
    </div>
  )
}

export default EditHeader
