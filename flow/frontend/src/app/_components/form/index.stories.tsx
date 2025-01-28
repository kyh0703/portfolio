import type { Meta, StoryObj } from '@storybook/react'
import { Form } from '.'

const meta: Meta<typeof Form> = {
  component: Form,
  title: 'ui/Form',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof Form>

export const Standard: Story = {}
