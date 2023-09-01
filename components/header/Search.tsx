import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import React from 'react'
export default function Search() {
  return (
    <div className="flex items-center space-x-2">
      <Input type="text" placeholder="Email" />
      <Button size="icon" variant="outline" className="rounded-full shrink-0">
        <MagnifyingGlassIcon />
      </Button>
    </div>
  )
}
