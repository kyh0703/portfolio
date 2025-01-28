import { Meta, StoryObj } from '@storybook/react'
import MentList from '.'

const meta: Meta<typeof MentList> = {
  component: MentList,
  title: 'defines/MentList',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof MentList>

export const Standard: Story = {}
