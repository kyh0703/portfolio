import { Meta, StoryObj } from '@storybook/react'
import Folder, { type FolderProps } from '.'

const meta: Meta<typeof Folder> = {
  component: Folder,
  title: 'ui/Folder',
  argTypes: {
    title: {
      control: 'text',
      description: '폴더제목',
      table: {
        category: 'content',
        defaultValue: { summary: 'Folder' },
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof Folder>

export const Standard: Story = {
  render(args: FolderProps) {
    return (
      <>
        <Folder {...args}>test</Folder>
      </>
    )
  },
}
