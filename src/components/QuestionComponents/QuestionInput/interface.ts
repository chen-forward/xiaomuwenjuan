// 组件需要的属性类型
export type QuestionInputPropsType = {
  title?: string
  placeholder?: string

  onChange?: (newProps: QuestionInputPropsType) => void
  disabled?: boolean //禁用表单
}

// 组件的默认属性
export const QuestionInputDefaultProps: QuestionInputPropsType = {
  title: "输入框标题",
  placeholder: "请输入...",
}
