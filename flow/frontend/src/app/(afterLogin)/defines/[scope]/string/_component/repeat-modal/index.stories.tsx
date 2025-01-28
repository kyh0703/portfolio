import { Meta, StoryObj } from '@storybook/react'
import RepeatModal from '.'

const meta: Meta<typeof RepeatModal> = {
  component: RepeatModal,
  title: 'defines/RepeatModal',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof RepeatModal>

export const Standard: Story = {}
