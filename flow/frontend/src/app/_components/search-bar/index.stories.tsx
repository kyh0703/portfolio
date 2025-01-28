import { Meta, StoryObj } from '@storybook/react'
import SearchBar from '.'

const meta: Meta<typeof SearchBar> = {
  component: SearchBar,
  title: 'ui/SearchBar',
  argTypes: {
    placeHolder: {
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Search' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    onChange: {
      table: {
        type: { summary: 'function' },
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof SearchBar>

export const Standard: Story = {}
