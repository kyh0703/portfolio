import type { Meta, StoryObj } from '@storybook/react'
import PlayButton from '.'

const meta: Meta<typeof PlayButton> = {
  component: PlayButton,
  title: 'ui/PlayButton',
}

export default meta
type Story = StoryObj<typeof PlayButton>

export const Standard: Story = {}
