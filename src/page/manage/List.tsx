// 我的问卷列表页面
import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { useTitle, useDebounceFn, useRequest } from "ahooks"
import { Typography, Spin, Empty } from "antd"
import { useSearchParams } from "react-router-dom"
import { getQuestionListService } from "../../services/question"
import QuestionCard from "../../components/QuestionCard"
import ListSearch from "../../components/ListSearch"
import { LIST_PAGE_SIZE, LIST_SEARCH_PARAM_KEY } from "../../constant"
import styles from "./common.module.scss"

const { Title } = Typography

const List: FC = () => {
  // 修改页面标题
  useTitle("小慕问卷 - 我的问卷")
  // 接受当前url参数的hook
  // const [searchParams] = useSearchParams()
  // console.log("keyword", searchParams.get("keyword"))

  const [started, setStarted] = useState(false) //标记是否已经开始加载（防抖有延迟）
  const [page, setPage] = useState(1) //List内部的数据，不在 url 参数中体现
  const [list, setList] = useState([]) //全部的列表数据，上划加载更多，累计
  const [total, setTotal] = useState(0)
  const haveMoreData = total > list.length //有没有更多的，未加载完成的数据

  const [searchParams] = useSearchParams() //虽然没有page pageSize参数，但有keyword参数
  const keyword = searchParams.get(LIST_SEARCH_PARAM_KEY) || ""

  // 进行搜索keyword变化时，重置信息
  useEffect(() => {
    setStarted(false)
    setPage(1)
    setList([])
    setTotal(0)
  }, [keyword])

  // 真正加载
  const { run: load, loading } = useRequest(
    async () => {
      const data = await getQuestionListService({
        page,
        pageSize: LIST_PAGE_SIZE,
        keyword,
      })
      return data
    },
    {
      manual: true,
      onSuccess(result) {
        const { list: l = [], count = 0 } = result
        setList(list.concat(l)) //累计
        setTotal(count)
        setPage(page + 1)
      },
    }
  )

  // 尝试触发加载 - 防抖
  const containerRef = useRef<HTMLDivElement>(null) //获取dom
  const { run: tryLoadMore } = useDebounceFn(
    () => {
      const elem = containerRef.current
      if (elem == null) return
      const domRect = elem.getBoundingClientRect() //获取dom元素上下左右到可视窗口的距离
      if (domRect == null) return
      const { bottom } = domRect //获取dom元素底部到窗口顶部距离
      // 如果dom元素底部到窗口顶部距离小于窗口高度 进行加载
      if (bottom <= document.body.clientHeight) {
        load() // 真正加载更多
        setStarted(true)
      }
    },
    {
      wait: 1000,
    }
  )

  // 当页面加载，或者url参数keyword有变化时，触发加载
  useEffect(() => {
    tryLoadMore() //加载第一页，初始化
  }, [searchParams])

  // 监听页面滚动，尝试触发加载
  useEffect(() => {
    if (haveMoreData) {
      window.addEventListener("scroll", tryLoadMore)
    }
    return () => {
      window.removeEventListener("scroll", tryLoadMore) //解绑事件
    }
  }, [searchParams, haveMoreData])

  const LoadMoreContentElem = useMemo(() => {
    if (!started || loading) return <Spin />
    if (total === 0) return <Empty description="暂无数据" />
    if (!haveMoreData) return <span>没有更多数据了...</span>
    return <span>开始加载下一页...</span>
  }, [started, loading, haveMoreData])

  return (
    <>
      <div className={styles.header}>
        <div className={styles.left}>
          <Title level={3}>我的问卷</Title>
        </div>
        <div className={styles.right}>
          <ListSearch />
        </div>
      </div>
      <div className={styles.content}>
        {/* 问卷列表 */}
        {list.length > 0 &&
          list.map((q: any) => {
            const { _id } = q
            return <QuestionCard key={_id} {...q} />
          })}
      </div>
      <div className={styles.footer} ref={containerRef}>
        {LoadMoreContentElem}
      </div>
    </>
  )
}

export default List
