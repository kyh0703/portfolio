type BlockingOverlayProps = {
  children: React.ReactNode
}

export default function BlockingOverlay({ children }: BlockingOverlayProps) {
  return (
    <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-foreground/20 text-2xl">
      {children}
    </div>
  )
}
