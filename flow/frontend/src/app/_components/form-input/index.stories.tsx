import type { Meta, StoryObj } from '@storybook/react'
import FormInputText from '.'

const meta: Meta<typeof FormInputText> = {
  component: FormInputText,
  title: 'ui/FormInputText',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof FormInputText>

export const WithLabel: Story = {}
