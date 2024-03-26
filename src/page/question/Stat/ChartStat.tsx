import React, { FC, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useRequest } from "ahooks"
import { Typography } from "antd"
import { getComponentStatService } from "../../../services/stat"
import { getComponentConfByType } from "../../../components/QuestionComponents"

const { Title } = Typography

type PropsType = {
  selectedComponentId: string
  selectedComponentType: string
}

const ChartStat: FC<PropsType> = (props: PropsType) => {
  const { selectedComponentId, selectedComponentType } = props
  const { id = "" } = useParams()

  const [stat, setStat] = useState([])
  const { run } = useRequest(
    async (questionId, componentFeId) => await getComponentStatService(questionId, componentFeId),
    {
      manual: true,
      onSuccess(res) {
        setStat(res.stat)
      },
    }
  )

  useEffect(() => {
    if (selectedComponentId) run(id, selectedComponentId)
  }, [id, selectedComponentId])

  // 生成统计图表
  function genStatElem() {
    if (!selectedComponentId) return <div>未选中组件</div>

    // 找到有统计组件
    const { StatComponent } = getComponentConfByType(selectedComponentType) || {}
    if (StatComponent == null) return <div>该组件无统计图表</div>

    return <StatComponent stat={stat} />
  }

  return (
    <>
      <Title level={3}>图表统计</Title>
      <div>{genStatElem()}</div>
    </>
  )
}

export default ChartStat
