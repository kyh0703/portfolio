import { Meta, StoryObj } from '@storybook/react'
import ServiceModal from '.'

const meta: Meta<typeof ServiceModal> = {
  component: ServiceModal,
  title: 'defines/ServiceModal',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof ServiceModal>

export const Standard: Story = {}
