import type { Meta, StoryObj } from '@storybook/react'
import { Modal } from '.'

const meta: Meta<typeof Modal> = {
  component: Modal,
  title: 'ui/Modal',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof Modal>

export const Standard: Story = {}
