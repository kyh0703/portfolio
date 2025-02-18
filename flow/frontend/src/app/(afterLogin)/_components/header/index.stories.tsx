import { Meta, StoryObj } from '@storybook/react'
import Header from '.'

const meta: Meta<typeof Header> = {
  component: Header,
  title: 'layout/Header',
}

export default meta
type Story = StoryObj<typeof Header>

export const Standard: Story = {}
