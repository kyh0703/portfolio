import { Meta, StoryObj } from '@storybook/react'
import TrackModal from '.'

const meta: Meta<typeof TrackModal> = {
  component: TrackModal,
  title: 'defines/TrackModal',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof TrackModal>

export const Standard: Story = {}
