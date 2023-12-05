import { useRequest } from "ahooks"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { ActionCreators as UndoActionCreators } from "redux-undo"
import { getQuestionService } from "../services/question"
import { resetComponents } from "../store/componentsReducer"
import { resetPageInfo } from "../store/pageInfoReducer"

// 加载问卷信息并存储到redux store
function useLoadQuestionData() {
  // 接受动态路由参数
  const { id = "" } = useParams()

  const dispatch = useDispatch()

  // 获取单个问卷信息的网络请求
  const { data, loading, error, run } = useRequest(
    async (id: string) => {
      if (!id) throw new Error("没有问卷id")
      const data = getQuestionService(id)
      return data
    },
    {
      manual: true,
    }
  )

  // 根据获取的 data 设置到 redux store
  useEffect(() => {
    if (!data) return
    const {
      title = "",
      desc = "",
      js = "",
      css = "",
      isPublished = false,
      componentList = [],
    } = data

    // 获取默认的selectedId
    let selectedId = ""
    if (componentList.length > 0) {
      selectedId = componentList[0].fe_id //获取第一个组件的id 默认选中第一个组件
    }

    // 把componentList组件列表 选中的组件的id 复制的组件 存储到redux store
    dispatch(resetComponents({ componentList, selectedId, copiedComponent: null }))

    // 改变state后，重置undoable内部保存的past,present,future之类的history，
    dispatch(UndoActionCreators.clearHistory())

    // pageInfo存储到redux store
    dispatch(resetPageInfo({ title, desc, js, css, isPublished }))
  }, [data])

  //根据id变化，执行Ajax加载问卷
  useEffect(() => {
    run(id)
  }, [id])

  return { loading, error }
}

export default useLoadQuestionData
