import { Meta, StoryObj } from '@storybook/react'
import LogList from '.'

const meta: Meta<typeof LogList> = {
  component: LogList,
  title: 'defines/LogList',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof LogList>

export const Standard: Story = {}
