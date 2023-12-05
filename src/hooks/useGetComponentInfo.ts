import { useSelector } from "react-redux"
import { StateType } from "../store"
import { ComponentStateType } from "../store/componentsReducer"

function useGetComponentInfo() {
  // 从redux store中获取组件信息 增加了undo redo
  const components = useSelector<StateType>(state => state.components.present) as ComponentStateType

  const { componentList = [], selectedId = "", copiedComponent } = components

  const selectedComponent = componentList.find(c => c.fe_id === selectedId) //寻找选中的组件

  return { componentList, selectedId, selectedComponent, copiedComponent }
}

export default useGetComponentInfo
