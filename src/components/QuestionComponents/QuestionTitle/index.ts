// Title 组件
import Component from "./Component"
import PropComponent from "./PropComponent"
import { QuestionTitleDefaultProps } from "./interface"

export * from "./interface"

//Title 组件的配置
export default {
  title: "标题",
  type: "questionTitle",
  Component,
  PropComponent,
  defaultProps: QuestionTitleDefaultProps,
}
