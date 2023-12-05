import { useSelector } from "react-redux"
import type { StateType } from "../store"
import type { PageInfoType } from "../store/pageInfoReducer"

// 从redux store 获取页面信息
function useGetPageInfo() {
  const pageInfo = useSelector<StateType>(state => state.pageInfo) as PageInfoType
  return pageInfo
}

export default useGetPageInfo
