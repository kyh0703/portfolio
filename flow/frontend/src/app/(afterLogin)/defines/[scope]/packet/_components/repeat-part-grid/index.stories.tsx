import { Meta, StoryObj } from '@storybook/react'
import RepeatPartGrid from '.'

const meta: Meta<typeof RepeatPartGrid> = {
  component: RepeatPartGrid,
  title: 'defines/RepeatPartGrid',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof RepeatPartGrid>

export const Standard: Story = {}
