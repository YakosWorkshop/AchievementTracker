import { House, Library as LibraryIcon, Trophy } from 'lucide-react'
import { NavLink, useLocation } from 'react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'

const navigation = [
  {
    label: 'Home',
    to: '/',
    icon: House,
  },
  {
    label: 'Library',
    to: '/library',
    icon: LibraryIcon,
  },
]

function AppSidebar() {
  const { pathname } = useLocation()

  return (
    <Sidebar collapsible="icon" className="border-slate-700/70">
      <div className="flex h-full min-h-0 flex-col bg-slate-900 text-slate-100 [--sidebar-accent:var(--color-slate-800)] [--sidebar-accent-foreground:var(--color-slate-100)] [--sidebar-foreground:var(--color-slate-100)] [--sidebar-ring:var(--color-blue-400)]">
        <SidebarHeader className="border-b border-slate-700/70 px-4 py-6 group-data-[collapsible=icon]:px-2">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400 group-data-[collapsible=icon]:size-8">
              <Trophy className="size-5" aria-hidden="true" />
            </div>
            <span className="text-sm font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
              Achievement Tracker
            </span>
          </div>
        </SidebarHeader>

        <SidebarContent className="py-4">
          <SidebarGroup>
            <SidebarGroupLabel className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <nav aria-label="Main navigation">
                <SidebarMenu className="gap-2">
                  {navigation.map((item) => (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton
                        render={<NavLink to={item.to} end={item.to === '/'} />}
                        isActive={pathname === item.to}
                        tooltip={item.label}
                        className="relative h-11 gap-3 rounded-lg px-3 text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-slate-100 focus-visible:ring-blue-400 active:bg-slate-800 active:text-slate-100 data-active:bg-blue-500/20 data-active:text-blue-100 data-active:before:absolute data-active:before:inset-y-2 data-active:before:left-0 data-active:before:w-0.5 data-active:before:rounded-full data-active:before:bg-blue-500 [&_svg]:size-5 data-active:[&_svg]:text-blue-400"
                      >
                        <item.icon aria-hidden="true" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </nav>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarRail className="hover:after:bg-blue-500/50" />
      </div>
    </Sidebar>
  )
}

export default AppSidebar
