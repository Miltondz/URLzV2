import { Globe } from "./globe"

export function GlobeDemo() {
  return (
    <div className="relative flex size-full max-w-lg items-center justify-center overflow-hidden">
      <Globe className="top-28" />
      <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.1),rgba(255,255,255,0))] dark:bg-[radial-gradient(circle_at_50%_200%,rgba(255,255,255,0.05),rgba(0,0,0,0))]" />
    </div>
  )
}