// 问卷卡片组件
import React, { FC, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button, Space, Divider, Tag, Popconfirm, Modal, message } from "antd"
import {
  EditOutlined,
  LineChartOutlined,
  StarOutlined,
  CopyOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons"
import { useRequest } from "ahooks"
import dayjs from "dayjs"
import { updateQuestionService, duplicateQuestionService } from "../services/question"
import styles from "./QuestionCard.module.scss"

const { confirm } = Modal //解构出弹窗组件

type PropsType = {
  _id: string // 服务端 mongodb ，自动，_id 不重复
  title: string
  isPublished: boolean
  isStar: boolean
  answerCount: number
  createdAt: string
  refresh?: () => void
}

const QuestionCard: FC<PropsType> = (props: PropsType) => {
  const nav = useNavigate()
  const { _id, title, createdAt, isPublished, answerCount = 0, isStar, refresh } = props

  // 修改 标星
  const [isStarState, setIsStarState] = useState(isStar)
  const { run: changeStar, loading: changeStarLoading } = useRequest(
    async () => {
      await updateQuestionService(_id, { isStar: !isStarState })
    },
    {
      manual: true,
      onSuccess() {
        setIsStarState(!isStarState) //更新state
        refresh?.()
        message.success("已更新") //提示信息
      },
    }
  )

  // 复制问卷
  const { loading: duplicateLoading, run: duplicate } = useRequest(
    async () => {
      const data = await duplicateQuestionService(_id)
      return data
    },
    {
      manual: true,
      onSuccess(result) {
        message.success("复制成功") //提示信息
        nav(`/question/edit/${result.id || result._id}`) //跳转到问卷编辑页
      },
    }
  )

  // 删除问卷
  const [isDeletedState, setIsDeletedState] = useState(false)
  const { loading: deleteLoading, run: deleteQuestion } = useRequest(
    async () => await updateQuestionService(_id, { isDeleted: true }),
    {
      manual: true,
      onSuccess() {
        message.success("删除成功") //提示信息
        setIsDeletedState(true)
      },
    }
  )

  // 点击删除，显示弹窗组件
  function del() {
    confirm({
      title: "确定删除该问卷？",
      icon: <ExclamationCircleOutlined />,
      onOk: deleteQuestion,
    })
  }

  // 已经删除的问卷，不要再渲染了
  if (isDeletedState) return null

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>
          <div className={styles.left}>
            <Link to={isPublished ? `/question/stat/${_id}` : `/question/edit/${_id}`}>
              <Space>
                {isStarState && <StarOutlined style={{ color: "red" }} />}
                {title}
              </Space>
            </Link>
          </div>
          <div className={styles.right}>
            <Space>
              {isPublished ? <Tag color={"processing"}>已发布</Tag> : <Tag>未发布</Tag>}
              <span>答卷: {answerCount}</span>
              <span>{dayjs(createdAt).format("YYYY-MM-DD HH:mm")}</span>
            </Space>
          </div>
        </div>
        <Divider style={{ margin: "12px 0" }} />
        <div className={styles["button-container"]}>
          <div className={styles.left}>
            <Space>
              <Button
                icon={<EditOutlined />}
                type="text"
                size="small"
                onClick={() => nav(`/question/edit/${_id}`)}
              >
                编辑问卷
              </Button>
              <Button
                icon={<LineChartOutlined />}
                type="text"
                size="small"
                onClick={() => nav(`/question/stat/${_id}`)}
                disabled={!isPublished}
              >
                数据统计
              </Button>
            </Space>
          </div>
          <div className={styles.right}>
            <Space>
              <Button
                icon={<StarOutlined />}
                type="text"
                size="small"
                onClick={changeStar}
                disabled={changeStarLoading}
              >
                {isStarState ? "取消标星" : "标星"}
              </Button>
              {/* 弹窗组件 */}
              <Popconfirm
                title="确定复制该问卷吗"
                okText="确定"
                cancelText="取消"
                onConfirm={duplicate}
              >
                <Button
                  icon={<CopyOutlined />}
                  type="text"
                  size="small"
                  disabled={duplicateLoading}
                >
                  复制
                </Button>
              </Popconfirm>
              {/* <Popconfirm title="确定删除该问卷吗" okText="确定" cancelText="取消" onConfirm={del}>
                <Button icon={<DeleteOutlined />} type="text" size="small">
                  删除
                </Button>
              </Popconfirm> */}
              <Button
                icon={<DeleteOutlined />}
                type="text"
                size="small"
                onClick={del}
                disabled={deleteLoading}
              >
                删除
              </Button>
            </Space>
          </div>
        </div>
      </div>
    </>
  )
}

export default QuestionCard
