import { configureStore } from "@reduxjs/toolkit"
import undoable, { excludeAction, StateWithHistory } from "redux-undo"
import componentsReducer, { ComponentStateType } from "./componentsReducer"
import userReducer, { UserStateType } from "./userReducer"
import pageInfoReducer, { PageInfoType } from "./pageInfoReducer"

export type StateType = {
  user: UserStateType
  // components: ComponentStateType
  components: StateWithHistory<ComponentStateType> // 增加了undo
  pageInfo: PageInfoType
}

export default configureStore({
  reducer: {
    user: userReducer, //用户信息模块

    // 没有增加 undo
    // components: componentsReducer,

    // 增加了 undo redo
    components: undoable(componentsReducer, {
      limit: 20, //限制 undo 20步
      // 屏蔽一些action的撤销重做
      filter: excludeAction([
        "components/resetComponents",
        "components/changeSelectedId",
        "components/selectPrevComponent",
        "components/selectedNextComponent",
      ]),
    }),

    pageInfo: pageInfoReducer, //页面信息模块
  },
})
