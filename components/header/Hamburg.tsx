import React from 'react'
import Link from 'next/link'
import { NavLinks } from '@/composables/NavLinks'

export default function Hamburg() {
  return (
    <>
      <div className="sm:hidden flex flex-1 justify-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M13 18h7" />
          </svg>
        </label>
      </div>
    </>
  )
}
