import type { Meta, StoryObj } from '@storybook/react'
import FormCheckbox from '.'

const meta: Meta<typeof FormCheckbox> = {
  component: FormCheckbox,
  title: 'ui/FormCheckbox',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof FormCheckbox>

export const WithLabel: Story = {}
