// 标星列表
import React, { FC, useEffect } from "react"
import { useTitle } from "ahooks"
import { Typography, Empty, Spin } from "antd"
import useLoadQuestionListData from "../../hooks/useLoadQuestionListData"
import QuestionCard from "../../components/QuestionCard"
import ListSearch from "../../components/ListSearch"
import ListPage from "../../components/ListPage"
import styles from "./common.module.scss"

const { Title } = Typography

const Star: FC = () => {
  useTitle("小慕问卷 - 我的问卷")

  // 获取问卷标星列表数据
  const { data = {}, loading, refresh } = useLoadQuestionListData({ isStar: true })
  const { list = [], count = 0 } = data

  return (
    <>
      <div className={styles.header}>
        <div className={styles.left}>
          <Title level={3}>星标问卷</Title>
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
        {!loading &&
          list.length > 0 &&
          list.map((q: any) => {
            const { _id } = q
            return <QuestionCard refresh={refresh} key={_id} {...q} />
          })}
      </div>
      <div className={styles.footer}>
        <ListPage total={count} />
      </div>
    </>
  )
}

export default Star
