import type { Meta, StoryObj } from '@storybook/react'
import { FileMenuIcon, IconButtonProps } from '.'

const meta: Meta<typeof FileMenuIcon> = {
  component: FileMenuIcon,
  title: 'ui/Icon',
  argTypes: {
    color: {
      control: { type: 'string' },
      description: '아이콘 색상',
      table: {
        type: { summary: 'ThemeColors' },
        category: 'Color',
      },
    },
    backgroundColor: {
      control: { type: 'color' },
      description: '아이콘 배경색상',
      table: {
        type: { summary: 'string' },
        category: 'Color',
      },
    },
    width: {
      control: { type: 'number' },
      description: '아이콘 넓이',
      table: {
        type: { summary: 'number' },
        category: 'size',
      },
    },
    height: {
      control: { type: 'number' },
      description: '아이콘 높이',
      table: {
        type: { summary: 'number' },
        category: 'size',
      },
    },
    onClick: {
      description: '아이콘 클릭 이벤트',
      table: {
        type: { summary: 'function' },
        category: 'function',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof FileMenuIcon>

export const Standard: Story = {
  render: (args: IconButtonProps) => (
    <>
      <FileMenuIcon {...args} />
    </>
  ),
}
