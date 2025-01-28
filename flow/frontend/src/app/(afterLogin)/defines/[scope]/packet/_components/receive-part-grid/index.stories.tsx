import { Meta, StoryObj } from '@storybook/react'
import ReceivePartGrid from '.'

const meta: Meta<typeof ReceivePartGrid> = {
  component: ReceivePartGrid,
  title: 'defines/ReceivePartGrid',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof ReceivePartGrid>

export const Standard: Story = {}
