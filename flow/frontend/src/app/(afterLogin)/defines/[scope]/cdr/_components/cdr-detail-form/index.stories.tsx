import { Meta, StoryObj } from '@storybook/react'
import CDRDetail from '.'

const meta: Meta<typeof CDRDetail> = {
  component: CDRDetail,
  title: 'defines/CDRDetail',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof CDRDetail>

export const Standard: Story = {}
