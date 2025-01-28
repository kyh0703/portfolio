import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from '.'

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
  title: 'ui/Checkbox',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const WithLabel: Story = {}
