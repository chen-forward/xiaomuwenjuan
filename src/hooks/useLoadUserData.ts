import { useEffect, useState } from "react"
import { useRequest } from "ahooks"
import { useDispatch } from "react-redux"
import { getUserInfoService } from "../services/user"
import { loginReducer } from "../store/userReducer"
import useGetUserInfo from "./useGetUserInfo"

function useLoadUserData() {
  const dispatch = useDispatch()
  // 定义等待网络请求的状态
  const [waitingUserData, setWaitingUserData] = useState(true)

  // ajax网络请求加载用户信息
  const { run } = useRequest(getUserInfoService, {
    manual: true,
    onSuccess(result) {
      const { username, nickname } = result
      dispatch(loginReducer({ username, nickname })) //存储到redux store
    },
    onFinally() {
      setWaitingUserData(false)
    },
  })

  //判断redux store是否已经存在用户信息
  const { username } = useGetUserInfo() //redux store
  useEffect(() => {
    if (username) {
      setWaitingUserData(false) //如果redux store存在用户信息，就不用加载
      return
    }
    run() //如果redux store没有用户信息，则进行加载
  }, [username])

  return { waitingUserData }
}

export default useLoadUserData
