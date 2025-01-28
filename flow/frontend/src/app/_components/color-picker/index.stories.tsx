import logger from '@/utils/logger'
import type { Meta, StoryObj } from '@storybook/react'
import ColorPickerIcon from '.'
// import { RadioIcon } from '@/app/_components/icon'

const meta: Meta<typeof ColorPickerIcon> = {
  component: ColorPickerIcon,
  title: 'ui/ColorPickerIcon',
  argTypes: {
    icon: {
      description: '아이콘',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    onChange: {
      description: '체크박스 변경 이벤트',
      table: {
        type: { summary: 'function' },
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof ColorPickerIcon>

export const WithLabel: Story = {
  args: {
    // icon: <RadioIcon />,
    onChange: () => logger.debug('change'),
  },
}

export const WithRender: Story = {
  args: {
    // icon: <RadioIcon />,
    onChange: () => logger.debug('change'),
  },
  render: (args) => {
    return (
      <div>
        <ColorPickerIcon {...args} />
      </div>
    )
  },
}
