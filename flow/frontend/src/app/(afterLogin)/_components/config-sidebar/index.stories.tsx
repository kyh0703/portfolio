import type { Meta, StoryObj } from '@storybook/react'
import ConfigListBox from '.'

const meta: Meta<typeof ConfigListBox> = {
  component: ConfigListBox,
  title: 'managements/ConfigListBox',
}

export default meta
type Story = StoryObj<typeof ConfigListBox>

export const Logo: Story = {}
