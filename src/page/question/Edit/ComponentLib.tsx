import React, { FC, useCallback } from "react"
import { Typography } from "antd"
import { useDispatch } from "react-redux"
import { nanoid } from "nanoid"
import { componentConfGroup, ComponentConfType } from "../../../components/QuestionComponents"
import { addComponent } from "../../../store/componentsReducer"
import styles from "./ComponentLib.module.scss"

const { Title } = Typography

// 生成组件
function genComponent(c: ComponentConfType) {
  const { title, type, Component, defaultProps } = c
  const dispatch = useDispatch()

  // useCallback用于缓存函数
  const handleClick = useCallback(() => {
    dispatch(
      addComponent({
        fe_id: nanoid(),
        title,
        type,
        props: defaultProps,
      })
    )
  }, [])

  return (
    <div key={type} className={styles.wrapper} onClick={handleClick}>
      <div className={styles.component}>
        <Component />
      </div>
    </div>
  )
}

// 组件库组件
const Lib: FC = () => {
  return (
    <>
      {componentConfGroup.map((group, index) => {
        const { groupId, groupName, components } = group

        return (
          <div key={groupId}>
            <Title level={3} style={{ fontSize: "16px", marginTop: index > 0 ? "20px" : "0" }}>
              {groupName}
            </Title>
            <div>{components.map(c => genComponent(c))}</div>
          </div>
        )
      })}
    </>
  )
}

export default Lib
