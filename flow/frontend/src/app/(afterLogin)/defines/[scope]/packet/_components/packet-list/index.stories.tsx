import { Meta, StoryObj } from '@storybook/react'
import PacketList from '.'

const meta: Meta<typeof PacketList> = {
  component: PacketList,
  title: 'defines/PacketList',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof PacketList>

export const Standard: Story = {}
