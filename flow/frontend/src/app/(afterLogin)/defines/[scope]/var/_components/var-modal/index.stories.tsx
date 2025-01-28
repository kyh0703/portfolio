import { Meta, StoryObj } from '@storybook/react'
import VarModal from '.'

const meta: Meta<typeof VarModal> = {
  component: VarModal,
  title: 'defines/VarModal',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof VarModal>

export const Standard: Story = {}
