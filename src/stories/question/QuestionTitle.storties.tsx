import type { Meta, StoryObj } from "@storybook/react"

import Component from "../../components/QuestionComponents/QuestionTitle/Component"

const meta = {
  title: "Question/QuestionTitle",
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
    level: 2,
    isCenter: true,
  },
}
