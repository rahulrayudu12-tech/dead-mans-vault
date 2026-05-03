"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Shield,
  LayoutDashboard,
  Lock,
  Clock,
  Users,
  ScrollText,
  Activity,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useDemoStore } from "@/lib/demo-store"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vault", label: "Vault Creation", icon: Lock },
  { href: "/schedule", label: "Release Schedule", icon: Clock },
  { href: "/contacts", label: "Emergency Contacts", icon: Users },
  { href: "/logs", label: "Audit Logs", icon: ScrollText },
  { href: "/admin", label: "Admin Panel", icon: Activity },
]

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}

export function Sidebar() {
  const pathname = usePathname()
  const { vaults, contacts, lastCheckIn, switchPeriodDays } = useDemoStore()

  const totalSeconds = switchPeriodDays * 24 * 60 * 60
  const elapsedSeconds = Math.floor((Date.now() - lastCheckIn.getTime()) / 1000)
  const percent = Math.min((elapsedSeconds / totalSeconds) * 100, 100)
  const isWarning = percent > 70
  const isCritical = percent > 90

  const badgeCounts: Record<string, number | null> = {
    "/vault": vaults.length,
    "/contacts": contacts.filter((c) => !c.verified).length || null,
  }

  return (
    <aside className="w-64 shrink-0 flex flex-col h-screen bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shrink-0">
          <Shield className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-bold text-sidebar-foreground tracking-wide leading-none">
            Dead Man&apos;s
          </p>
          <p className="text-xs text-primary font-semibold tracking-widest uppercase leading-none mt-0.5">
            Vault
          </p>
        </div>
      </div>

      {/* Status indicator */}
      <div className="px-4 py-3 border-b border-sidebar-border">
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded",
            isCritical ? "bg-destructive/10" : isWarning ? "bg-vault-pending/10" : "bg-secondary"
          )}
        >
          <span
            className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              isCritical ? "bg-destructive" : isWarning ? "bg-vault-pending" : "bg-vault-active"
            )}
          />
          <span
            className={cn(
              "text-xs font-mono",
              isCritical ? "text-destructive" : isWarning ? "text-vault-pending" : "text-muted-foreground"
            )}
          >
            {isCritical ? "CRITICAL" : isWarning ? "WARNING" : "SWITCH ACTIVE"}
          </span>
          <Link href="/dashboard" className="ml-auto">
            <ChevronRight className="w-3 h-3 text-muted-foreground hover:text-foreground transition-colors" />
          </Link>
        </div>
        <p className="text-xs text-muted-foreground font-mono mt-2 px-1">
          Last check-in: {timeAgo(lastCheckIn)}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/")
          const badge = badgeCounts[href]
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors",
                active
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {badge != null && badge > 0 && (
                <span
                  className={cn(
                    "text-xs font-mono px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
                    active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-secondary text-muted-foreground"
                  )}
                >
                  {badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-sidebar-border flex flex-col gap-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-destructive-foreground hover:bg-destructive/20 transition-colors w-full text-left">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
        <p className="text-xs text-muted-foreground font-mono mt-2 px-3">v1.0.0 — E2E Encrypted</p>
      </div>
    </aside>
  )
}
