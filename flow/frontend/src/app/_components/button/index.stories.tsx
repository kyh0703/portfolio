import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '.'

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'common/Button',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: ['primary', 'secondary', 'secondary2', 'secondary3', 'error'],
      control: { type: 'radio' },
      description: '버튼의 스타일',
      table: {
        type: { summary: 'text | contained | outlined' },
        defaultValue: { summary: 'contained' },
        category: 'attributes',
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: '버튼의 비활성화 플래그',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'attributes',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
  render: (args) => <Button {...args}>Primary</Button>,
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
  render: (args) => <Button {...args}>Secondary</Button>,
}

export const Secondary2: Story = {
  args: {
    variant: 'secondary2',
  },
  render: (args) => <Button {...args}>Secondary2</Button>,
}

export const Secondary3: Story = {
  args: {
    variant: 'secondary3',
  },
  render: (args) => <Button {...args}>Secondary3</Button>,
}

export const Error: Story = {
  args: {
    variant: 'error',
  },
  render: (args) => <Button {...args}>Error</Button>,
}

export const Destructve: Story = {
  args: {
    variant: 'destructive',
  },
  render: (args) => <Button {...args}>Destructive</Button>,
}

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
  render: (args) => <Button {...args}>Outline</Button>,
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
  },
  render: (args) => <Button {...args}>Ghost</Button>,
}

export const Link: Story = {
  args: {
    variant: 'link',
  },
  render: (args) => <Button {...args}>Link</Button>,
}

export const NormalSize: Story = {
  args: {
    size: 'default',
  },
  render: (args) => <Button {...args}>Normal Size</Button>,
}

export const SmallSize: Story = {
  args: {
    size: 'sm',
  },
  render: (args) => <Button {...args}>Small Size</Button>,
}

export const LargeSize: Story = {
  args: {
    size: 'lg',
  },
  render: (args) => <Button {...args}>Large Size</Button>,
}

export const IconSize: Story = {
  args: {
    size: 'icon',
  },
  render: (args) => <Button {...args}>Icon Size</Button>,
}
