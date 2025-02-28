import { PlayOnIcon } from '@/app/_components/icon'
import { Button } from '../button'

export default function PlayButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return (
    <Button variant="secondary3" {...props}>
      <PlayOnIcon size={11}></PlayOnIcon>
      <span className="ml-[5px]">Play</span>
    </Button>
  )
}
