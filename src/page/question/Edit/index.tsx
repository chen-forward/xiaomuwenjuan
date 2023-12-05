import React, { FC } from "react"
import { useDispatch } from "react-redux"
import { useTitle } from "ahooks"
import { changeSelectedId } from "../../../store/componentsReducer"
import useLoadQuestionData from "../../../hooks/useLoadQuestionData"
import useGetPageInfo from "../../../hooks/useGetPageInfo"
import EditCanvas from "./EditCanvas"
import LeftPanel from "./LeftPanel"
import RightPanel from "./RightPanel"
import EditHeader from "./EditHeader"
import styles from "./index.module.scss"

const Edit: FC = () => {
  const dispatch = useDispatch()
  // 使用自定义hook获取问卷信息和loading状态
  const { loading } = useLoadQuestionData()

  // 获取问卷页面信息
  const { title } = useGetPageInfo()

  //修改标题
  useTitle(`问卷编辑 - ${title}`)

  function clearSelectedId() {
    dispatch(changeSelectedId(""))
  }

  return (
    <div className={styles.container}>
      <EditHeader />
      <div className={styles["content-wrapper"]}>
        <div className={styles.content}>
          <div className={styles.left}>
            <LeftPanel />
          </div>
          <div className={styles.main} onClick={clearSelectedId}>
            <div className={styles["canvas-wrapper"]}>
              <EditCanvas loading={loading} />
            </div>
          </div>
          <div className={styles.right}>
            <RightPanel />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Edit
