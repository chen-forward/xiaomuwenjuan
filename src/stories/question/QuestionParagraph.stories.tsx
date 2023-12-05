import type { Meta, StoryObj } from "@storybook/react"

import Component from "../../components/QuestionComponents/QuestionParagraph/Component"

const meta = {
  title: "Question/QuestionParagraph",
  component: Component,
} satisfies Meta<typeof Component>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const setProps: Story = {
  args: {
    text: "hello",
    isCenter: true,
  },
}

// 文字换行
export const DescBreakLine: Story = {
  args: {
    text: "hello\nhello\nhello",
  },
}
