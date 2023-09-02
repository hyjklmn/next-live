'use client'
import { ScrollArea } from "@/components/ui/scroll-area"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  function handleScoll() {
    console.log('...');

  }
  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <ScrollArea className="h-full overflow-hidden" onScroll={handleScoll}>
        {children}
      </ScrollArea>
    </div>
  )
}
