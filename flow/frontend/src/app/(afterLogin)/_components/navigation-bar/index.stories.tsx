import { Meta, StoryObj } from '@storybook/react'
import NavigationBar from '.'

const meta: Meta<typeof NavigationBar> = {
  component: NavigationBar,
  title: 'layout/NavigationBar',
}

export default meta
type Story = StoryObj<typeof NavigationBar>

export const Standard: Story = {}
