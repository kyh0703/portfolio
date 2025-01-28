import { Meta, StoryObj } from '@storybook/react'
import Title from '.'

const meta: Meta<typeof Title> = {
  component: Title,
  title: 'layout/Title',
}

export default meta
type Story = StoryObj<typeof Title>

export const Standard: Story = {}
