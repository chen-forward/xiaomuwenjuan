import React, { FC, useState } from "react"
import { useRequest } from "ahooks"
import { useParams } from "react-router-dom"
import { Typography, Spin, Table, Pagination } from "antd"
import { getQuestionStatListService } from "../../../services/stat"
import useGetComponentInfo from "../../../hooks/useGetComponentInfo"
import { STAT_PAGE_SIZE } from "../../../constant"

const { Title } = Typography

type PropsType = {
  selectedComponentId: string
  setSelectedComponentId: (id: string) => void
  setSelectedComponentType: (type: string) => void
}

const PageStat: FC<PropsType> = (props: PropsType) => {
  const { selectedComponentId, setSelectedComponentId, setSelectedComponentType } = props
  const { id = "" } = useParams()

  const [page, setPage] = useState(1) //定义第几页
  const [pageSize, setPageSize] = useState(STAT_PAGE_SIZE) //定义一页的数量
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])

  // 网络请求
  const { loading } = useRequest(
    async () => {
      const res = await getQuestionStatListService(id, { page, pageSize })
      return res
    },
    {
      // 重新请求的依赖项
      refreshDeps: [id, page, pageSize],
      onSuccess(res) {
        const { total, list = [] } = res
        setTotal(total)
        setList(list)
      },
    }
  )

  const { componentList } = useGetComponentInfo()
  const columns = componentList.map(c => {
    const { fe_id, title, props = {}, type } = c
    const colTitle = props!.title || title //优先使用组件属性的标题

    return {
      // title: colTitle,
      title: (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            setSelectedComponentId(fe_id)
            setSelectedComponentType(type)
          }}
        >
          <span style={{ color: fe_id === selectedComponentId ? "#1890ff" : "inherit" }}>
            {colTitle}
          </span>
        </div>
      ),
      dataIndex: fe_id,
    }
  })

  //给list都加上key
  const dataSource = list.map((i: any) => ({ ...i, key: i._id }))
  const TableElem = (
    <>
      <Table columns={columns} dataSource={dataSource} pagination={false}></Table>
      <div style={{ textAlign: "center", marginTop: "18px" }}>
        <Pagination
          total={total}
          pageSize={pageSize}
          current={page}
          onChange={page => setPage(page)}
          onShowSizeChange={(page, pageSize) => {
            setPage(page)
            setPageSize(pageSize)
          }}
        />
      </div>
    </>
  )

  return (
    <div>
      <Title level={3}>答卷数量: {!loading && total}</Title>
      {loading && (
        <div style={{ textAlign: "center" }}>
          <Spin />
        </div>
      )}
      {!loading && TableElem}
    </div>
  )
}

export default PageStat
