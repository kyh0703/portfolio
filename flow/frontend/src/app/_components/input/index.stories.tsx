import type { Meta, StoryObj } from '@storybook/react'
import { withActions } from '@storybook/addon-actions/decorator'
import { Input } from '.'

const meta: Meta<typeof Input> = {
  component: Input,
  title: 'ui/Input',
  args: {
    placeholder: 'Placeholder',
    value: 'Placeholder',
  },
  parameters: {
    actions: {
      handles: ['click .btn'],
    },
  },
  decorators: [withActions],
  argTypes: {
    value: {
      control: { type: 'string' },
      description: 'Input content',
      table: {
        type: { summery: 'string' },
        defaultValue: { summary: '' },
        category: 'input props',
      },
    },
    placeholder: {
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '내용을 입력하세요.' },
        category: 'input props',
      },
    },
    disabled: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'input props',
      },
    },
    readOnly: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'input props',
      },
    },
    type: {
      control: { type: 'text' },
      description: 'input type',
      table: {
        type: { summary: 'string' },
        category: 'input props',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {}

export const Error: Story = {
  args: {},
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const Success: Story = {
  args: {},
}

export const Readonly: Story = {
  args: {
    readOnly: true,
  },
}

export const Password: Story = {
  args: {
    type: 'password',
  },
}
