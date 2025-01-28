import type { Meta, StoryObj } from '@storybook/react'
import SearchWrapper from '.'

const meta: Meta<typeof SearchWrapper> = {
  component: SearchWrapper,
  title: 'search/SearchWrapper',
}

export default meta
type Story = StoryObj<typeof SearchWrapper>

export const Logo: Story = {}
