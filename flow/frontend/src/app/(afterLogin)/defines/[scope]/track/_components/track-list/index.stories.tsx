import { Meta, StoryObj } from '@storybook/react'
import TrackList from '.'

const meta: Meta<typeof TrackList> = {
  component: TrackList,
  title: 'defines/TrackList',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof TrackList>

export const Standard: Story = {}
