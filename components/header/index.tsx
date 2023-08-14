'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { themeChange } from 'theme-change'
import { MoonIcon, SunIcon, ChevronDownIcon, } from '@radix-ui/react-icons'
import Search from './Search'
import Hamburg from './Hamburg'
import { NavLinks } from '@/composables/NavLinks'

export default function Header() {
  useEffect(() => {
    themeChange(false)
  }, [])


  const [mode, setMode] = useState('dark')
  const changeColorMode = () => {
    let doc = document.querySelector('html')
    let dataTheme = doc?.getAttribute('data-theme')
    mode === 'dark' ? setMode('light') : setMode('dark')
  }

  return (
    <div className="navbar sticky t-0 l-0 z-10 backdrop-blur gap-2 shadow-gray-500 shadow-sm justify-between">
      <div className="flex px-2 lg:flex-none">
        <a className="text-lg font-bold">daisyUI</a>
      </div>
      <div className="hidden md:flex flex-1 justify-end gap-2">
        {
          NavLinks.map((nav) => {
            return (
              <Link href={nav.url} className='btn btn-ghost w-20' key={nav.key}>{nav.title}</Link>
            )
          })
        }
      </div>
      <div className="hidden md:flex flex-1 justify-end">
        <div className="flex items-center">
          <Search />
          <button className='btn btn-circle btn-sm' data-set-theme={mode} data-act-class={mode} onClick={changeColorMode}>
            {mode === "light" ? <SunIcon /> : <MoonIcon />}
          </button>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost rounded-btn btn-sm">关注列表</label>
            <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
              <li><a>Item 1</a></li>
              <li><a>Item 2</a></li>
            </ul>
          </div>
          <details className="dropdown dropdown-end">
            <summary tabIndex={0} className="btn btn-ghost rounded-btn btn-sm">8588 <ChevronDownIcon /></summary>
            <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
              <li><a>Item 1</a></li>
              <li><a>Item 2</a></li>
            </ul>
          </details>
        </div>
      </div>
      <Hamburg />
    </div>
  )
}
