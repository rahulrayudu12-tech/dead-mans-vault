"use client"

import { Hash, ShieldCheck, AlertTriangle, Activity } from "lucide-react"
import { useDemoStore } from "@/lib/demo-store"

export function LogStats() {
  const { logs } = useDemoStore()

  const alerts = logs.filter((l) => l.severity === "alert").length
  const stats = [
    {
      label: "Total Events",
      value: String(logs.length),
      icon: Activity,
      color: "text-foreground",
      bg: "bg-secondary",
    },
    {
      label: "Hash Chain Valid",
      value: "100%",
      icon: Hash,
      color: "text-vault-active",
      bg: "bg-vault-active/10",
    },
    {
      label: "Security Alerts",
      value: String(alerts),
      icon: AlertTriangle,
      color: alerts > 0 ? "text-destructive" : "text-vault-active",
      bg: alerts > 0 ? "bg-destructive/10" : "bg-vault-active/10",
    },
    {
      label: "Integrity Score",
      value: "A+",
      icon: ShieldCheck,
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className="rounded-lg border border-border bg-card p-4 flex items-center gap-3">
          <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${bg}`}>
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
          <div>
            <div className={`text-xl font-bold font-mono ${color}`}>{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
