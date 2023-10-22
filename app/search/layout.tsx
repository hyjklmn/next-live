'use client'
import { ScrollArea } from "@/components/ui/scroll-area"

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <ScrollArea className="h-full overflow-hidden p-5 pt-1 pb-0 mb-2">
        {children}
      </ScrollArea>
    </div>
  )
}
