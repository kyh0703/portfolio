import { Button } from '@/app/_components/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover'
import { useState } from 'react'
import { CommonFlowAddFormType } from '.'
import FlowAddForm from './form'

interface FlowAddPopoverProps {
  data: CommonFlowAddFormType
  onSubmit: (data: CommonFlowAddFormType) => void
}

export default function CommonFlowAddPopover({
  data,
  onSubmit,
}: FlowAddPopoverProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleReplicateSubmit = (payload: CommonFlowAddFormType) => {
    setIsOpen(false)
    onSubmit && onSubmit({ ...payload, oldFlowId: data.oldFlowId })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          className="h-7 w-14 font-poppins"
          variant="outline"
          onClick={() => setIsOpen(true)}
        >
          Copy
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <FlowAddForm
          name={data.name}
          version={data.version}
          onSubmit={handleReplicateSubmit}
        />
      </PopoverContent>
    </Popover>
  )
}
