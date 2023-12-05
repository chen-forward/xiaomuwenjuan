import React, { FC } from "react"
import {
  DndContext,
  closestCenter,
  MouseSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"

type PropsType = {
  children: JSX.Element | JSX.Element[]
  items: Array<{ id: string; [key: string]: any }>
  onDragEnd: (oldIndex: number, newIndex: number) => void
}

// 拖放排序列表容器组件
const SortableContainer: FC<PropsType> = (props: PropsType) => {
  const { children, items, onDragEnd } = props

  //选择以什么方式进行拖拽排序的第三方hook 这里用鼠标拖拽
  const sensors = useSensors(
    useSensor(MouseSensor, {
      // 配置 如果拖拽对象拖拽不超过8px就不会进行拖拽
      activationConstraint: {
        distance: 8, //8px
      },
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over == null) return

    if (active.id !== over.id) {
      const oldIndex = items.findIndex(c => c.fe_id === active.id)
      const newIndex = items.findIndex(c => c.fe_id === over.id)
      onDragEnd(oldIndex, newIndex) //外面组件处理 这里不出来
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  )
}

export default SortableContainer
