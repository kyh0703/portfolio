import { Meta, StoryObj } from '@storybook/react'
import SendModal from '.'

const meta: Meta<typeof SendModal> = {
  component: SendModal,
  title: 'defines/SendModal',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof SendModal>

export const Standard: Story = {}
