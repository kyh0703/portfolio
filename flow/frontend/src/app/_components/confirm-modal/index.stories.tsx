import type { Meta, StoryObj } from '@storybook/react'
import ConfirmModal from '.'

const meta: Meta<typeof ConfirmModal> = {
  component: ConfirmModal,
  title: 'common/ConfirmModal',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof ConfirmModal>

export const Standard: Story = {}
