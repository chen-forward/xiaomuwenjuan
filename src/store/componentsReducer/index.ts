import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import produce from "immer"
import cloneDeep from "lodash.clonedeep"
import { nanoid } from "nanoid"
import { arrayMove } from "@dnd-kit/sortable"
import { ComponentPropsType } from "../../components/QuestionComponents"
import { getNextSelectedId, insertNewComponent } from "./utils"

// 组件信息类型
export type ComponentInfoType = {
  fe_id: string
  type: string
  title: string
  isHidden?: boolean
  isLocked?: boolean
  props: ComponentPropsType
}

export type ComponentStateType = {
  selectedId: string //记录选中的组件的id
  componentList: Array<ComponentInfoType> //组件列表
  copiedComponent: ComponentInfoType | null //复制的组件
}

const INIT_STATE: ComponentStateType = {
  selectedId: "",
  componentList: [],
  copiedComponent: null,
}

export const componentsSlice = createSlice({
  name: "components",
  initialState: INIT_STATE,
  reducers: {
    // 重置所有组件
    resetComponents: (state: ComponentStateType, action: PayloadAction<ComponentStateType>) => {
      return action.payload
    },

    // 修改selectedId
    changeSelectedId: produce((draft: ComponentStateType, action: PayloadAction<string>) => {
      draft.selectedId = action.payload
    }),

    // 添加新组件
    addComponent: produce((draft: ComponentStateType, action: PayloadAction<ComponentInfoType>) => {
      const newComponent = action.payload

      insertNewComponent(draft, newComponent)
    }),

    // 修改组件属性
    changeComponentProps: produce(
      (
        draft: ComponentStateType,
        action: PayloadAction<{ fe_id: string; newProps: ComponentPropsType }>
      ) => {
        const { fe_id, newProps } = action.payload
        // 找到当前要修改属性的这个组件
        const curComp = draft.componentList.find(c => c.fe_id === fe_id)
        if (curComp) {
          curComp.props = {
            ...curComp.props,
            ...newProps,
          }
        }
      }
    ),

    // 删除选中的组件
    removeSelectedComponent: produce((draft: ComponentStateType) => {
      const { componentList = [], selectedId: removeId } = draft

      // 重新计算selectedId
      const newSelectedId = getNextSelectedId(removeId, componentList)
      draft.selectedId = newSelectedId

      const index = componentList.findIndex(c => c.fe_id === removeId)
      componentList.splice(index, 1)
    }),

    // 隐藏/显示组件
    changeComponentHidden: produce(
      (draft: ComponentStateType, action: PayloadAction<{ fe_id: string; isHidden: boolean }>) => {
        const { componentList } = draft
        const { fe_id, isHidden } = action.payload

        // 重新计算selectedId
        let newSelectedId = ""
        if (isHidden) {
          // 要隐藏 重新计算selectedId
          newSelectedId = getNextSelectedId(fe_id, componentList)
        } else {
          // 要显示 选中显示的组件
          newSelectedId = fe_id
        }
        draft.selectedId = newSelectedId

        const curComp = componentList.find(c => c.fe_id === fe_id)
        if (curComp) {
          curComp.isHidden = isHidden
        }
      }
    ),

    // 锁定/解锁组件
    toggleComponentLocked: produce(
      (draft: ComponentStateType, action: PayloadAction<{ fe_id: string }>) => {
        const { fe_id } = action.payload

        const curComp = draft.componentList.find(c => c.fe_id === fe_id)
        if (curComp) {
          curComp.isLocked = !curComp.isLocked
        }
      }
    ),

    // 拷贝当前选中的组件
    copySelectedComponent: produce((draft: ComponentStateType) => {
      const { componentList = [], selectedId } = draft
      // 找到当前选中组件
      const selectedComponent = componentList.find(c => c.fe_id === selectedId)
      if (selectedComponent == null) return
      draft.copiedComponent = cloneDeep(selectedComponent) //深拷贝
    }),

    // 粘贴组件
    pasteCopiedComponent: produce((draft: ComponentStateType) => {
      const { copiedComponent } = draft
      if (copiedComponent == null) return

      // 要将fe_id修改掉，重要！！！
      copiedComponent.fe_id = nanoid()
      // 插入copierComponent
      insertNewComponent(draft, copiedComponent)
    }),

    // 选中上一个
    selectPrevComponent: produce((draft: ComponentStateType) => {
      const { selectedId, componentList } = draft
      const selectedIndex = componentList.findIndex(c => c.fe_id === selectedId)

      if (selectedIndex < 0) return //未选中组件
      // if (selectedIndex <= 0) return //选中第一个组件，无法向上选中

      // 如果选中的是第一个组件，再向上选中则选中最后一个组件
      if (selectedIndex <= 0) {
        draft.selectedId = componentList[componentList.length - 1].fe_id
        return
      }

      draft.selectedId = componentList[selectedIndex - 1].fe_id
    }),

    // 选中下一个
    selectedNextComponent: produce((draft: ComponentStateType) => {
      const { selectedId, componentList } = draft
      const selectedIndex = componentList.findIndex(c => c.fe_id === selectedId)

      if (selectedIndex < 0) return //未选中组件
      // if (selectedIndex + 1 === componentList.length) return //已经选中最后一个

      // 如果选中的是第一个组件，再向下选中则选中第一个组件
      if (selectedIndex + 1 === componentList.length) {
        draft.selectedId = componentList[0].fe_id
        return
      }

      draft.selectedId = componentList[selectedIndex + 1].fe_id
    }),

    // 修改组件标题
    changeComponentTitle: produce(
      (draft: ComponentStateType, action: PayloadAction<{ fe_id: string; title: string }>) => {
        const { title, fe_id } = action.payload
        const curComp = draft.componentList.find(c => c.fe_id === fe_id)
        if (curComp) curComp.title = title
      }
    ),

    // 移动组件位置
    moveComponent: produce(
      (
        draft: ComponentStateType,
        action: PayloadAction<{ oldIndex: number; newIndex: number }>
      ) => {
        const { componentList: curComponentList } = draft
        const { oldIndex, newIndex } = action.payload

        draft.componentList = arrayMove(curComponentList, oldIndex, newIndex)
      }
    ),
  },
})

export const {
  resetComponents,
  changeSelectedId,
  addComponent,
  changeComponentProps,
  removeSelectedComponent,
  changeComponentHidden,
  toggleComponentLocked,
  copySelectedComponent,
  pasteCopiedComponent,
  selectPrevComponent,
  selectedNextComponent,
  changeComponentTitle,
  moveComponent,
} = componentsSlice.actions

export default componentsSlice.reducer
