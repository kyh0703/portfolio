import { Meta, StoryObj } from '@storybook/react'
import CDRForm from '.'

const meta: Meta<typeof CDRForm> = {
  component: CDRForm,
  title: 'defines/CDRForm',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof CDRForm>

export const Standard: Story = {}
