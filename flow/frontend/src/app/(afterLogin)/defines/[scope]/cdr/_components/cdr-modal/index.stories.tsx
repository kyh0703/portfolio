import { Meta, StoryObj } from '@storybook/react'
import CDRModal from '.'

const meta: Meta<typeof CDRModal> = {
  component: CDRModal,
  title: 'defines/CDRModal',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof CDRModal>

export const Standard: Story = {}
