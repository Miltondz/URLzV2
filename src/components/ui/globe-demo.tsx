import { Globe } from "./globe"

export function GlobeDemo() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <Globe className="scale-150" />
      <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(circle_at_50%_200%,rgba(255,255,255,0.1),rgba(0,0,0,0))]" />
    </div>
  )
}