'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation' // Hook to get the current path
import React from 'react'
import { CiBoxList } from 'react-icons/ci'

const menu = [
  {
    name: 'Table of Athletes',
    icon: <CiBoxList />,
    link: '/members',
  },
]

export default function SideBar() {
  const pathname = usePathname()
  return (
    <ul className='menu bg-base-200  w-56'>
      {menu.map((item) => {
        const active = item.link === pathname
        return (
          <li
            key={item.name}
            className={`menu-item ${
              active ? 'active text-primary outline-primary' : ''
            }`}
          >
            <Link href={item.link}>
              <div className='text-xl'>{item.icon}</div>
              {item.name}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
