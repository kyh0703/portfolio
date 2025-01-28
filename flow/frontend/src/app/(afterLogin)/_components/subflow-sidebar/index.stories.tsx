import type { Meta, StoryObj } from '@storybook/react'
import SubFlowSidebar from '.'

const meta: Meta<typeof SubFlowSidebar> = {
  component: SubFlowSidebar,
  title: 'common/SubFlowSidebar',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof SubFlowSidebar>

export const Standard: Story = {}
