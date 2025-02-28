import { LogoIcon } from '@/app/_components/icon'
import { colors } from '@/themes'

export default function Page() {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute inset-0 flex items-center justify-center opacity-10 text-foreground">
        <LogoIcon size={500} />
      </div>
      <section className="container relative flex min-h-screen flex-col items-center justify-center gap-4 pb-8 pt-24 md:pb-12 md:pt-32 lg:py-32">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to Our Platform
          </h1>
          <p className="mx-auto max-w-[700px] text-zinc-400 md:text-xl">
            Discover a new way to build and deploy your applications with our
            cutting-edge tools and services.
          </p>
        </div>
      </section>
    </div>
  )
}
