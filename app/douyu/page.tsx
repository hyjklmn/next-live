"use client"
import React from 'react'
import Link from 'next/link'
export default function Page() {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 place-items-center">
      <Link href='/douyu/categories'>categories</Link>
    </div>
  )
}
