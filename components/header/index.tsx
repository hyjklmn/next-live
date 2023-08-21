'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { themeChange } from 'theme-change'
import { MoonIcon, SunIcon, ChevronDownIcon, ArrowRightIcon } from '@radix-ui/react-icons'
import Search from './Search'
import Hamburg from './Hamburg'
import { NavLinks } from '@/composables/NavLinks'
import { usePathname } from 'next/navigation'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'


function NavItem({ href, children, }: {
  href: string
  children: React.ReactNode
}) {
  const isActive = usePathname() === href

  return (
    <li>
      <Link
        href={href}
        className={
          `relative block whitespace-nowrap px-3 py-2 transition ${isActive
            ? 'text-lime-600 dark:text-lime-400'
            : 'hover:text-lime-600 dark:hover:text-lime-400'}`
        }
      >
        {children}
        {isActive && (
          <motion.span
            className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-lime-700/0 via-lime-700/70 to-lime-700/0 dark:from-lime-400/0 dark:via-lime-400/40 dark:to-lime-400/0"
            layoutId="active-nav-item"
          />
        )}
      </Link>
    </li>
  )
}


export default function Header() {
  useEffect(() => {
    themeChange(false)
  }, [])

  let isLogin = false


  const [mode, setMode] = useState('dark')
  const changeColorMode = () => {
    let doc = document.querySelector('html')
    let dataTheme = doc?.getAttribute('data-theme')
    mode === 'dark' ? setMode('light') : setMode('dark')
  }

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const radius = useMotionValue(0)
  const handleMouseMove = useCallback(
    ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
      const bounds = currentTarget.getBoundingClientRect()
      mouseX.set(clientX - bounds.left)
      mouseY.set(clientY - bounds.top)
      radius.set(Math.sqrt(bounds.width ** 2 + bounds.height ** 2) / 2.5)
    },
    [mouseX, mouseY, radius]
  )
  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, var(--spotlight-color) 0%, transparent 65%)`

  return (
    <div className="navbar sticky t-0 l-0 z-10 backdrop-blur gap-2 shadow-gray-500 shadow-sm justify-between">
      <div className="flex px-2 lg:flex-none">
        <a className="text-lg font-bold">daisyUI</a>
      </div>
      <div className="hidden md:flex flex-1 justify-end gap-2">
        <nav
          onMouseMove={handleMouseMove}
          className="group relative rounded-full bg-gradient-to-b from-zinc-50/70 to-white/90 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur-md dark:from-zinc-900/70 dark:to-zinc-800/90 dark:ring-zinc-100/10 [--spotlight-color:rgb(236_252_203_/_0.6)] dark:[--spotlight-color:rgb(217_249_157_/_0.07)]
        ">
          {/* Spotlight overlay */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background }}
            aria-hidden="true"
          />

          <ul className="flex bg-transparent px-3 text-sm font-medium text-Indigo-800 dark:text-zinc-200 ">
            {NavLinks.map((nav) => (
              <NavItem key={nav.key} href={nav.url}>
                {nav.title}
              </NavItem>
            ))}
          </ul>
        </nav>
      </div>

      <div className="hidden md:flex flex-1 justify-end">
        <div className="flex items-center">
          <Search />
          <button className='btn btn-circle btn-sm mr-2' data-set-theme={mode} data-act-class={mode} onClick={changeColorMode}>
            {mode === "light" ? <SunIcon /> : <MoonIcon />}
          </button>
          {
            !isLogin ?
              <div className='mx-3'>
                <button className="btn btn-sm">登录</button>
              </div> : <div>
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
          }


        </div>
      </div>
      <Hamburg />
    </div>
  )
}
