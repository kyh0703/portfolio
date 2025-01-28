import { Meta, StoryObj } from '@storybook/react'
import UserfuncList from '.'

const meta: Meta<typeof UserfuncList> = {
  component: UserfuncList,
  title: 'defines/UserfuncList',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof UserfuncList>

export const Standard: Story = {}
