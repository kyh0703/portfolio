import { Meta, StoryObj } from '@storybook/react'
import MentModal from '.'

const meta: Meta<typeof MentModal> = {
  component: MentModal,
  title: 'defines/MentModal',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof MentModal>

export const Standard: Story = {}
