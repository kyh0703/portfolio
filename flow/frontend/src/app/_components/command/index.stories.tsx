import type { Meta, StoryObj } from '@storybook/react'
import { Command } from '.'

const meta: Meta<typeof Command> = {
  component: Command,
  title: 'ui/Command',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof Command>

export const WithLabel: Story = {}
