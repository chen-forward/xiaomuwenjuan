import React, { FC } from "react"
import { useDispatch } from "react-redux"
import { ComponentPropsType, getComponentConfByType } from "../../../components/QuestionComponents"
import useGetComponentInfo from "../../../hooks/useGetComponentInfo"
import { changeComponentProps } from "../../../store/componentsReducer"

const NoProp: FC = () => {
  return <div style={{ textAlign: "center" }}>未选中组件</div>
}

// 根据画布选中的组件显示属性组件
const ComponentProp: FC = () => {
  const dispatch = useDispatch()

  //获取选中的组件
  const { selectedComponent } = useGetComponentInfo()
  if (selectedComponent == null) return <NoProp />
  //根据选中组件的类型获取组件配置
  const { type, props, isLocked, isHidden } = selectedComponent
  const componentConf = getComponentConfByType(type)
  if (componentConf == null) return <NoProp />

  // 修改属性
  function changeProps(newProps: ComponentPropsType) {
    if (selectedComponent == null) return
    const { fe_id } = selectedComponent
    // 修改属性 存储到redux
    dispatch(changeComponentProps({ fe_id, newProps }))
  }

  const { PropComponent } = componentConf
  return <PropComponent {...props} onChange={changeProps} disabled={isLocked || isHidden} />
}

export default ComponentProp
