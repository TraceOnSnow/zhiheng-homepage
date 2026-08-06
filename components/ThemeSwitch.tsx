'use client'

import { Fragment, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'

const Sun = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    className={className}
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.41M17.66 6.34l1.41-1.41" />
  </svg>
)

const Moon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z" />
  </svg>
)

const Monitor = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="4" width="18" height="13" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
)

const options = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Monitor },
]

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  return (
    <Menu as="div" className="relative">
      <MenuButton className="icon-button" aria-label="Theme switcher">
        {mounted ? resolvedTheme === 'dark' ? <Moon /> : <Sun /> : <span className="h-5 w-5" />}
      </MenuButton>
      <Transition
        as={Fragment}
        enter="transition duration-150 ease-out"
        enterFrom="translate-y-1 opacity-0 scale-95"
        enterTo="translate-y-0 opacity-100 scale-100"
        leave="transition duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <MenuItems
          anchor="bottom end"
          className="z-80 mt-2 w-36 origin-top-right rounded-2xl border border-white/80 bg-white/90 p-1.5 text-sm shadow-xl backdrop-blur-xl focus:outline-none dark:border-white/10 dark:bg-gray-900/92"
        >
          {options.map(({ value, label, Icon }) => (
            <MenuItem key={value}>
              {({ focus }) => (
                <button
                  onClick={() => setTheme(value)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 font-semibold transition ${focus || theme === value ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-200' : 'text-gray-600 dark:text-gray-300'}`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              )}
            </MenuItem>
          ))}
        </MenuItems>
      </Transition>
    </Menu>
  )
}

export default ThemeSwitch
