export default function CategoryLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <div className="p-5 pt-1">
      {children}
    </div>
  )
}
