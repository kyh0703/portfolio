import { Meta, StoryObj } from '@storybook/react'
import CommandSidebar from '.'

const meta: Meta<typeof CommandSidebar> = {
  component: CommandSidebar,
  title: 'flows/CommandSidebar',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof CommandSidebar>

export const Standard: Story = {}
