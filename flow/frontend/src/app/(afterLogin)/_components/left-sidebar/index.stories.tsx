import { Meta, StoryObj } from '@storybook/react'
import LeftSideBar from '.'

const meta: Meta<typeof LeftSideBar> = {
  component: LeftSideBar,
  title: 'layout/LeftSideBar',
}

export default meta
type Story = StoryObj<typeof LeftSideBar>

export const Nomal: Story = {}
