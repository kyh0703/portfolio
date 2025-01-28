import type { Meta, StoryObj } from '@storybook/react'
import AppLogo from '.'

const meta: Meta<typeof AppLogo> = {
  component: AppLogo,
  title: 'ui/AppLogo',
}

export default meta
type Story = StoryObj<typeof AppLogo>

export const Logo: Story = {}
