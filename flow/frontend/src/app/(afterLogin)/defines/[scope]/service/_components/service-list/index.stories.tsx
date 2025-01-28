import { Meta, StoryObj } from '@storybook/react'
import ServiceList from '.'

const meta: Meta<typeof ServiceList> = {
  component: ServiceList,
  title: 'defines/ServiceList',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof ServiceList>

export const Standard: Story = {}
