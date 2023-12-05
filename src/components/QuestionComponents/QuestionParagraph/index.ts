// 段落组件
import Component from "./Component"
import { QuestionParagraphDefaultProps } from "./interface"
import PropComponent from "./PropComponent"

export * from "./interface"

// paragraph组件配置
export default {
  title: "标题",
  type: "questionParagraph",
  Component,
  PropComponent,
  defaultProps: QuestionParagraphDefaultProps,
}
