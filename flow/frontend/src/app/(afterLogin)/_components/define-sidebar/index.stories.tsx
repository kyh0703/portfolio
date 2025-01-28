import type { Meta, StoryObj } from '@storybook/react'
import DefineListBox from '.'

const meta: Meta<typeof DefineListBox> = {
  component: DefineListBox,
  title: 'defines/DefineListBox',
}

export default meta
type Story = StoryObj<typeof DefineListBox>

export const Logo: Story = {}
