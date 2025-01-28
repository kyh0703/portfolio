import { Meta, StoryObj } from '@storybook/react'
import UserfuncModal from '.'

const meta: Meta<typeof UserfuncModal> = {
  component: UserfuncModal,
  title: 'defines/UserfuncModal',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof UserfuncModal>

export const Standard: Story = {}
