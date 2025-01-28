import { Meta, StoryObj } from '@storybook/react'
import PacketDetail from '.'

const meta: Meta<typeof PacketDetail> = {
  component: PacketDetail,
  title: 'defines/PacketDetail',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof PacketDetail>

export const Standard: Story = {}
