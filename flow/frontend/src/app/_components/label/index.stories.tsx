import type { Meta, StoryObj } from '@storybook/react'
import Label from '.'

const meta: Meta<typeof Label> = {
  component: Label,
  title: 'ui/Label',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof Label>

export const Standard: Story = {}
