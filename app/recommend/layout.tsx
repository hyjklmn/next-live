import { ScrollArea } from "@/components/ui/scroll-area"

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <ScrollArea className="h-full overflow-hidden">
        {children}
      </ScrollArea>
    </div>
  )
}
