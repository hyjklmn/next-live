
export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-[calc(100vh-3.5rem)]">
      {children}
    </div>
  )
}
