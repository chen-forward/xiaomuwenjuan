//Input 组件
import Component from "./Component"
import PropComponent from "./PropComponent"
import { QuestionInputDefaultProps } from "./interface"

export * from "./interface"

//Input 组件的配置
export default {
  title: "输入框",
  type: "questionInput", //和后端统一
  Component, // 画布显示的组件
  PropComponent, // 属性组件
  defaultProps: QuestionInputDefaultProps, //默认属性
}
