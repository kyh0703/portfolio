import { Meta, StoryObj } from '@storybook/react'
import FlowLayout from '.'

const meta: Meta<typeof FlowLayout> = {
  component: FlowLayout,
  title: 'flows/FlowLayout',
}

export default meta
type Story = StoryObj<typeof FlowLayout>

export const Standard: Story = {}
