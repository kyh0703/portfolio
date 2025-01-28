import type { Meta, StoryObj } from '@storybook/react'
import Grid from '.'

const meta: Meta<typeof Grid> = {
  component: Grid,
  title: 'ui/Grid',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof Grid>

export const Standard: Story = {}
