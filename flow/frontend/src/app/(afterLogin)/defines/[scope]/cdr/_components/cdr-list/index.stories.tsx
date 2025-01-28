import { Meta, StoryObj } from '@storybook/react'
import CDRList from '.'

const meta: Meta<typeof CDRList> = {
  component: CDRList,
  title: 'defines/CDRList',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof CDRList>

export const Standard: Story = {}
