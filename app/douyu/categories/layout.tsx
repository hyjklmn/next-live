export default function CategoryLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {

  return (
    <div className="px-5">
      {children}
    </div>
  )
}
