import React, { FC } from "react"
import { useDispatch } from "react-redux"
import { Button, Space, Tooltip } from "antd"
import { ActionCreators as UndoActionCreators } from "redux-undo"
import {
  DeleteOutlined,
  EyeInvisibleOutlined,
  LockOutlined,
  CopyOutlined,
  BlockOutlined,
  UpOutlined,
  DownOutlined,
  UndoOutlined,
  RedoOutlined,
} from "@ant-design/icons"
import {
  removeSelectedComponent,
  changeComponentHidden,
  toggleComponentLocked,
  copySelectedComponent,
  pasteCopiedComponent,
  moveComponent,
} from "../../../store/componentsReducer"
import useGetComponentInfo from "../../../hooks/useGetComponentInfo"

// 工具栏组件
const EditToolbar: FC = () => {
  const dispatch = useDispatch()
  const { selectedId, componentList, selectedComponent, copiedComponent } = useGetComponentInfo()
  const { isLocked } = selectedComponent || {}
  const length = componentList.length //组件列表的长度
  const selectIndex = componentList.findIndex(c => c.fe_id === selectedId) //选中组件的index
  const isFirst = selectIndex <= 0 // 已经选中了第一个组件
  const isLast = selectIndex + 1 >= length //已经选中最后一个组件

  //删除组件
  function handleDelete() {
    dispatch(removeSelectedComponent())
  }

  //隐藏组件
  function handleHidden() {
    dispatch(changeComponentHidden({ fe_id: selectedId, isHidden: true }))
  }

  //锁定组件
  function handleLock() {
    dispatch(toggleComponentLocked({ fe_id: selectedId }))
  }

  // 复制组件
  function copy() {
    dispatch(copySelectedComponent())
  }

  // 粘贴组件
  function paste() {
    dispatch(pasteCopiedComponent())
  }

  // 上移组件
  function moveUp() {
    if (isFirst) return
    dispatch(moveComponent({ oldIndex: selectIndex, newIndex: selectIndex - 1 }))
  }

  // 下移组件
  function moveDown() {
    if (isLast) return
    dispatch(moveComponent({ oldIndex: selectIndex, newIndex: selectIndex + 1 }))
  }

  // 撤销
  function undo() {
    dispatch(UndoActionCreators.undo())
  }

  // 重做
  function redo() {
    dispatch(UndoActionCreators.redo())
  }

  return (
    <Space>
      <Tooltip title="删除">
        <Button shape="circle" icon={<DeleteOutlined />} onClick={handleDelete} />
      </Tooltip>
      <Tooltip title="隐藏">
        <Button shape="circle" icon={<EyeInvisibleOutlined />} onClick={handleHidden} />
      </Tooltip>
      <Tooltip title="锁定">
        <Button
          shape="circle"
          icon={<LockOutlined />}
          onClick={handleLock}
          type={isLocked ? "primary" : "default"}
        />
      </Tooltip>
      <Tooltip title="复制">
        <Button shape="circle" icon={<CopyOutlined />} onClick={copy} />
      </Tooltip>
      <Tooltip title="粘贴">
        <Button
          shape="circle"
          icon={<BlockOutlined />}
          onClick={paste}
          disabled={copiedComponent == null}
        />
      </Tooltip>
      <Tooltip title="上移">
        <Button shape="circle" icon={<UpOutlined />} onClick={moveUp} disabled={isFirst} />
      </Tooltip>
      <Tooltip title="下移">
        <Button shape="circle" icon={<DownOutlined />} onClick={moveDown} disabled={isLast} />
      </Tooltip>
      <Tooltip title="撤销">
        <Button shape="circle" icon={<UndoOutlined />} onClick={undo} />
      </Tooltip>
      <Tooltip title="重做">
        <Button shape="circle" icon={<RedoOutlined />} onClick={redo} />
      </Tooltip>
    </Space>
  )
}

export default EditToolbar
