import type { Meta, StoryObj } from "@storybook/react"

import Component from "../../components/QuestionComponents/QuestionTextarea/Component"

const meta = {
  title: "Question/QuestionTextarea",
  component: Component,
} satisfies Meta<typeof Component>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const setProps: Story = {
  args: {
    title: "Custom Title",
    placeholder: "Type, here",
  },
}
