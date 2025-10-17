'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { Briefcase, FileText, Building2, Link as LinkIcon } from 'lucide-react'
import logo from '@/media/logo.png'
import { NavMain } from './nav-main'
import { NavUser } from './nav-user'
import { TeamSwitcher } from '../team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

const companyNav = {
  user: {
    name: 'Company User',
    email: 'company@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [{ name: 'Your Company', logo: Briefcase, plan: 'Pro' }],
  navMain: [
    {
      title: 'Company',
      url: '/company',
      icon: Briefcase,
      items: [
        { title: 'Dashboard', url: '/company/dashboard' },
        { title: 'Applicants', url: '/company/applicants' },
        { title: 'Feedback', url: '/company/feedback' },
      ],
    },
    {
      title: 'Post Jobs',
      url: '/company/jobs/post',
      icon: FileText,
      items: [
        { title: 'All Jobs', url: '/company/jobs' },
        { title: 'Post Job', url: '/company/jobs/post' },
      ],
    },
    {
      title: 'Universities',
      url: '/company/universities',
      icon: Building2,
      items: [
        { title: 'Browse Universities', url: '/company/universities' },
        { title: 'My Connections', url: '/company/universities/connected' },
      ]
    }
  ],
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const [companyName, setCompanyName] = useState('Company Admin')

  // Fetch company profile to get company name
  useEffect(() => {
    const fetchCompanyProfile = async () => {
      if (user && user.role === 'company') {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/company/profile`,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }
          )

          if (response.ok) {
            const data = await response.json()
            if (data.success && data.data?.companyName) {
              setCompanyName(data.data.companyName)
            }
          }
        } catch (error) {
          console.error('Error fetching company profile:', error)
        }
      }
    }

    fetchCompanyProfile()
  }, [user])

  // Inject active flags so CSS has something definite to match
  const navMainWithActive = companyNav.navMain.map((section) => ({
    ...section,
    // mark section button active if its base url matches
    'data-active': pathname === section.url ? 'true' : undefined,
    'aria-current': pathname === section.url ? 'page' : undefined,
    items: section.items?.map((it) => {
      const isActive = pathname === it.url
      return {
        ...it,
        'data-active': isActive ? 'true' : undefined,
        'aria-current': isActive ? 'page' : undefined,
      }
    }),
  }))

  return (
    <Sidebar
      collapsible="icon"
      className={[
        'bg-[#2F4156] text-white border-r border-[#243447]',
        // Force icons/text white
        '[&_*]:!text-white [&_svg]:!text-white [&_svg]:!stroke-white',

        // Hover tint (links, buttons, menu items)
        "[&_a:hover]:!bg-[#6BB9F0]/25",
        "[&_button:hover]:!bg-[#6BB9F0]/25",
        "[&_[role='menuitem']:hover]:!bg-[#6BB9F0]/25",
        "[&_[data-sidebar='menu-item']:hover]:!bg-[#6BB9F0]/25",
        "[&_[data-sidebar='menu-button']:hover]:!bg-[#6BB9F0]/25",

        // Focus visible for keyboard users
        "[&_a:focus-visible]:!bg-[#6BB9F0]/25",
        "[&_button:focus-visible]:!bg-[#6BB9F0]/25",

        // ACTIVE — make it the SAME as hover (covers many attribute variants)
        "[&_a[aria-current='page']]:!bg-[#6BB9F0]/25",
        "[&_a[aria-current='true']]:!bg-[#6BB9F0]/25",
        "[&_[data-active='true']]:!bg-[#6BB9F0]/25",
        "[&_[data-selected='true']]:!bg-[#6BB9F0]/25",
        "[&_[aria-current='true']]:!bg-[#6BB9F0]/25",
        "[&_[data-state='active']]:!bg-[#6BB9F0]/25",

        // When a section/group button is "open", prevent default white block
        "[&_[data-sidebar='menu-button'][data-state='open']]:!bg-[#6BB9F0]/25",

        // Don’t paint disabled as white
        "[&_[aria-disabled='true']]:!bg-transparent",
      ].join(' ')}
      {...props}
    >
      {/* HEADER */}
      <SidebarHeader className="border-b border-[#243447] bg-[#2F4156]/90 backdrop-blur-sm">
        <div className="text-white">
          <TeamSwitcher
            team={{ name: companyName, logo: logo.src, plan: 'Company' }}
          />
        </div>
      </SidebarHeader>

      {/* MAIN NAV */}
      <SidebarContent className="bg-[#2F4156] text-white">
        <NavMain
          items={navMainWithActive.map((section) => ({
            ...section,
            className:
              'text-white rounded-md transition-all duration-150 hover:text-white',
            itemClassName:
              // also style via data attr just in case NavMain passes it through
              'text-white rounded-md transition-all duration-150 hover:text-white data-[active=true]:!bg-[#6BB9F0]/25 aria-[current=page]:!bg-[#6BB9F0]/25',
          }))}
        />
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="border-t border-[#243447] bg-[#2F4156]/90 text-white">
        <NavUser
          user={{
            name: user?.name || companyName,
            email: user?.email || 'company@example.com',
            avatar: logo.src,
          }}
          onLogout={logout}
          onProfile={() => console.log('profile')}
        />
      </SidebarFooter>

      {/* RAIL */}
      <SidebarRail className="bg-[#2F4156] text-white border-r border-[#243447]" />
    </Sidebar>
  )
}
