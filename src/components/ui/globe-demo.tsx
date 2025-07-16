import { Globe } from "./globe"

export function GlobeDemo() {
  return (
    <div className="relative flex size-full max-w-lg items-center justify-center overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-40 pb-40 pt-8 md:pb-60 md:shadow-xl">
      <Globe className="top-28" />
      <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))] dark:bg-[radial-gradient(circle_at_50%_200%,rgba(255,255,255,0.1),rgba(0,0,0,0))]" />
    </div>
  )
}