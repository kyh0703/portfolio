import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from '.'

const meta: Meta<typeof Textarea> = {
  component: Textarea,
  title: 'ui/Textarea',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Standard: Story = {}
