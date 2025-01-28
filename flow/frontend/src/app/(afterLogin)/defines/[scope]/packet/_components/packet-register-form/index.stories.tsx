import { Meta, StoryObj } from '@storybook/react'
import PacketForm from '.'

const meta: Meta<typeof PacketForm> = {
  component: PacketForm,
  title: 'defines/PacketForm',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof PacketForm>

export const Standard: Story = {}
