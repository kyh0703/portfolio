import type { Meta, StoryObj } from '@storybook/react'
import FormSelect from '.'

const meta: Meta<typeof FormSelect> = {
  component: FormSelect,
  title: 'ui/FormSelect',
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof FormSelect>

export const WithLabel: Story = {}
