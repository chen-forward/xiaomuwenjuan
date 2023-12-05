import { ComponentInfoType, ComponentStateType } from "./index"

// 获取下一个selectedId fe_id: 当前id componentList:组件列表
export function getNextSelectedId(fe_id: string, componentList: ComponentInfoType[]) {
  // 过滤隐藏的组件
  const visibleComponentList = componentList.filter(c => !c.isHidden)
  const index = visibleComponentList.findIndex(c => c.fe_id === fe_id)
  if (index < 0) return ""

  //重新计算 selectedId
  let newSelectedId = ""
  // 获取组件列表的长度
  const length = visibleComponentList.length
  if (length <= 1) {
    // 组件长度就一个，被删除了，就没有组件
    newSelectedId = ""
  } else {
    // 组件长度大于1
    if (index + 1 === length) {
      // 要删除最后一个，就要选中上一个
      newSelectedId = visibleComponentList[index - 1].fe_id
    } else {
      // 要删除的不是最后一个，就要选中下一个
      newSelectedId = visibleComponentList[index + 1].fe_id
    }
  }
  return newSelectedId
}

// 插入新组件 draft：state draft newComponent：新组件
export function insertNewComponent(draft: ComponentStateType, newComponent: ComponentInfoType) {
  const { selectedId, componentList } = draft
  // 找到目前被选中的组件索引 判断当前有无选中组件
  const index = componentList.findIndex(c => c.fe_id === selectedId)
  if (index < 0) {
    // 未选中组件
    draft.componentList.push(newComponent)
  } else {
    // 选中了组件， 插在index后面
    draft.componentList.splice(index + 1, 0, newComponent)
  }

  draft.selectedId = newComponent.fe_id //选中新添加的组件
}
