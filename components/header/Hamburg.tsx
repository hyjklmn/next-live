import React from 'react'
import Link from 'next/link'
import { NavLinks } from '@/composables/NavLinks'

export default function Hamburg() {
  return (
    <>
      <div className="dropdown dropdown-end sm:hidden">
        <label tabIndex={0} className="btn btn-ghost btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M13 18h7" />
          </svg>
        </label>
        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          {
            NavLinks.map((nav) => {
              return (
                <li key={nav.key}>
                  <Link href={nav.url}>{nav.title}</Link>
                </li>
              )
            })
          }
        </ul>
      </div>
    </>
  )
}
