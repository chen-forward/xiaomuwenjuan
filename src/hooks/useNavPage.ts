import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { isLoginOrRegister, LOGIN_PATHNAME, MANAGE_INDEX_PATHNAME, noNeedUserInfo } from "../router"
import useGetUserInfo from "./useGetUserInfo"

function useNavPage(waitingUserData: boolean) {
  const { username } = useGetUserInfo()
  const { pathname } = useLocation()
  const nav = useNavigate()

  useEffect(() => {
    if (waitingUserData) return

    // 已经登录
    if (username) {
      if (isLoginOrRegister(pathname)) {
        nav(MANAGE_INDEX_PATHNAME)
      }
      return
    }

    // 未登录
    // if (noNeedUserInfo(pathname)) {
    //   return
    // } else {
    //   nav(LOGIN_PATHNAME)
    // }
  }, [waitingUserData, username, pathname])
}

export default useNavPage
