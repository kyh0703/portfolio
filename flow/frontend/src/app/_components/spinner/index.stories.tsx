import type { Meta, StoryObj } from '@storybook/react'
import Spinner from '.'

const meta: Meta<typeof Spinner> = {
  component: Spinner,
  title: 'ui/Spinner',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof Spinner>

export const Standard: Story = {}
