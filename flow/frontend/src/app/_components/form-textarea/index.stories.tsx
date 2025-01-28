import type { Meta, StoryObj } from '@storybook/react'
import FormTextarea from '.'

const meta: Meta<typeof FormTextarea> = {
  component: FormTextarea,
  title: 'ui/FormTextarea',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof FormTextarea>

export const WithLabel: Story = {}
