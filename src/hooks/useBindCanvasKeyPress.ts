import { useKeyPress } from "ahooks"
import { useDispatch } from "react-redux"
import { ActionCreators as UndoActionCreators } from "redux-undo"
import {
  removeSelectedComponent,
  copySelectedComponent,
  pasteCopiedComponent,
  selectPrevComponent,
  selectedNextComponent,
} from "../store/componentsReducer"

function isActiveElementValid() {
  // 用来返回当前在 DOM 中处于聚焦状态的Element。
  const activeElem = document.activeElement
  // 没有增加dnd-kit之前
  // if (activeElem == document.body) return true //光标没有focus 到input

  // 增加dnd-kit之后
  if (activeElem == document.body) return true //光标没有focus 到input
  if (activeElem?.matches("div[role='button']")) return true //如果匹配搭配div 增加dnd-kit之后的外框

  return false
}

function useBindCanvasKeyPress() {
  const dispatch = useDispatch()

  // 删除组件快捷键
  useKeyPress(["Backspace", "delete"], () => {
    // 如果选中的是组件属性的input输入框，不会派发任务删除组件
    if (!isActiveElementValid()) return
    // 派发任务删除
    dispatch(removeSelectedComponent())
  })

  // 快捷键复制组件
  useKeyPress(["ctrl.c", "meta.c"], () => {
    if (!isActiveElementValid()) return
    dispatch(copySelectedComponent())
  })

  //粘贴组件
  useKeyPress(["ctrl.v", "meta.v"], () => {
    if (!isActiveElementValid()) return
    dispatch(pasteCopiedComponent())
  })

  //选中上一个
  useKeyPress("uparrow", () => {
    if (!isActiveElementValid()) return
    dispatch(selectPrevComponent())
  })

  //选中下一个
  useKeyPress("downarrow", () => {
    if (!isActiveElementValid()) return
    dispatch(selectedNextComponent())
  })

  // 撤销
  useKeyPress(
    ["ctrl.z", "meta.z"],
    () => {
      if (!isActiveElementValid()) return
      dispatch(UndoActionCreators.undo())
    },
    {
      exactMatch: true, //严格匹配
    }
  )

  // 重做
  useKeyPress(["ctrl.shift.z", "meta.shift.z"], () => {
    if (!isActiveElementValid()) return
    dispatch(UndoActionCreators.redo())
  })
}

export default useBindCanvasKeyPress
