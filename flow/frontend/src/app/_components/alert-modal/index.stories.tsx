import type { Meta, StoryObj } from '@storybook/react'
import AlertModal from '.'

const meta: Meta<typeof AlertModal> = {
  component: AlertModal,
  title: 'common/AlertModal',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof AlertModal>

export const Standard: Story = {}
