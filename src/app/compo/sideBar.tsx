import Link from 'next/link'
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
  return (
    <ul className='menu bg-base-200  w-56'>
      {menu.map((item) => {
        const active = item.link === window.location.pathname ? true : false
        return (
          <li key={item.name} className={`menu-item ${active ? 'active' : ''}`}>
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
