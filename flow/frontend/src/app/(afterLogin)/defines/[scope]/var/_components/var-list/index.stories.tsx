import { Meta, StoryObj } from '@storybook/react'
import VarList from '.'

const meta: Meta<typeof VarList> = {
  component: VarList,
  title: 'defines/VarList',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof VarList>

export const Standard: Story = {}
