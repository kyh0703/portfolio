import { Meta, StoryObj } from '@storybook/react'
import SendPartGrid from '.'

const meta: Meta<typeof SendPartGrid> = {
  component: SendPartGrid,
  title: 'defines/SendPartGrid',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof SendPartGrid>

export const Standard: Story = {}
