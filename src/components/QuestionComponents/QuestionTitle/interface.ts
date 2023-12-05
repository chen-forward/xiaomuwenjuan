// 组件的属性类型
export type QuestionTitlePropsType = {
  text?: string //文本
  level?: 1 | 2 | 3 | 4 | 5 //文本大小
  isCenter?: boolean //是否居中

  onChange?: (newProps: QuestionTitlePropsType) => void
  disabled?: boolean
}

// 组件的默认属性值
export const QuestionTitleDefaultProps: QuestionTitlePropsType = {
  text: "一行标题",
  level: 1,
  isCenter: false,
}
