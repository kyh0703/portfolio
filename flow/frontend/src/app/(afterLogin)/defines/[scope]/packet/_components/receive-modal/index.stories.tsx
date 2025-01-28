import { Meta, StoryObj } from '@storybook/react'
import ReceiveModal from '.'

const meta: Meta<typeof ReceiveModal> = {
  component: ReceiveModal,
  title: 'defines/ReceiveModal',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof ReceiveModal>

export const Standard: Story = {}
