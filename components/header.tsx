'use client'
import { useState, useEffect } from 'react'
import { themeChange } from 'theme-change'
import { MoonIcon, SunIcon, ChevronDownIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
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
    <div className="navbar border-b-1">
      <div className="flex-1 px-2 lg:flex-none">
        <a className="text-lg font-bold">daisyUI</a>
      </div>
      <div className='flex-1 justify-center gap-1'>
        <input type="text" placeholder="Type here" className="input input-sm input-bordered focus:outline-0" />
        <button className='btn btn-circle btn-sm border'><MagnifyingGlassIcon /></button>
      </div>
      <div className="flex">
        <div className="flex items-center">
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
    </div>
  )
}
