import { useSelector } from "react-redux"
import { StateType } from "../store"
import { UserStateType } from "../store/userReducer"

// 从redux获取用户信息
function useGetUserInfo() {
  const { username, nickname } = useSelector<StateType>(state => state.user) as UserStateType
  return { username, nickname }
}

export default useGetUserInfo
