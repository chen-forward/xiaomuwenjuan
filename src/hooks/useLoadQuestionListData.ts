import { useRequest } from "ahooks"
import { useSearchParams } from "react-router-dom"
import { getQuestionListService } from "../services/question"
import {
  LIST_SEARCH_PARAM_KEY,
  LIST_PAGE_PARAM_KEY,
  LIST_PAGE_SIZE_PARAM_KEY,
  LIST_PAGE_SIZE,
} from "../constant"

type OptionType = {
  isStar: boolean
  isDeleted: boolean
}

function useLoadQuestionListData(opt: Partial<OptionType> = {}) {
  const { isStar, isDeleted } = opt
  // 当前url参数的hook
  const [searchParams] = useSearchParams()

  // 执行refresh函数会重新刷新
  const { loading, data, error, refresh } = useRequest(
    async () => {
      const keyword = searchParams.get(LIST_SEARCH_PARAM_KEY) || ""
      const page = parseInt(searchParams.get(LIST_PAGE_PARAM_KEY) || "") || 1
      const pageSize = parseInt(searchParams.get(LIST_PAGE_SIZE_PARAM_KEY) || "") || LIST_PAGE_SIZE
      const data = await getQuestionListService({ keyword, isStar, isDeleted, page, pageSize })
      return data
    },
    { refreshDeps: [searchParams] } // 刷新的依赖项
  )
  return { loading, data, error, refresh }
}

export default useLoadQuestionListData
