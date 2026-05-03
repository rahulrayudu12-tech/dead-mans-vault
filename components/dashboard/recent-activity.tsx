"use client"

import { useState, useEffect } from "react"
import { Lock, UserCheck, Bell, AlertTriangle } from "lucide-react"
import { useDemoStore } from "@/lib/demo-store"

function timeAgo(date: Date, now: number): string {
  const seconds = Math.floor((now - date.getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

const severityConfig = {
  ok: { icon: UserCheck, color: "text-vault-active", bg: "bg-vault-active/10", badge: "OK", badgeColor: "bg-vault-active/20 text-vault-active" },
  info: { icon: Lock, color: "text-primary", bg: "bg-primary/10", badge: "INFO", badgeColor: "bg-primary/20 text-primary" },
  warn: { icon: Bell, color: "text-vault-pending", bg: "bg-vault-pending/10", badge: "WARN", badgeColor: "bg-vault-pending/20 text-vault-pending" },
  alert: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", badge: "ALERT", badgeColor: "bg-destructive/20 text-destructive" },
}

export function RecentActivity() {
  const { logs } = useDemoStore()
  const [now, setNow] = useState<number | null>(null)
  const displayLogs = logs.slice(0, 8)

  useEffect(() => {
    setNow(Date.now())
    const interval = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
        <span className="text-xs text-muted-foreground font-mono">{logs.length} total events</span>
      </div>
      <div className="flex flex-col gap-4">
        {displayLogs.map((log) => {
          const cfg = severityConfig[log.severity]
          const Icon = cfg.icon
          return (
            <div key={log.id} className="flex gap-3">
              <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center ${cfg.bg}`}>
                <Icon className={`w-4 h-4 ${cfg.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-foreground">{log.action}</span>
                  <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${cfg.badgeColor}`}>{cfg.badge}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{log.detail}</p>
              </div>
              <span className="text-xs text-muted-foreground font-mono shrink-0">{now ? timeAgo(log.time, now) : "—"}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
