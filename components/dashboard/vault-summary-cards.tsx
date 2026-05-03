"use client"

import { Lock, FileText, Users, Key } from "lucide-react"
import { useDemoStore } from "@/lib/demo-store"

export function VaultSummaryCards() {
  const { vaults, contacts } = useDemoStore()

  const active = vaults.filter((v) => v.status === "active").length
  const staged = vaults.filter((v) => v.status === "staged").length
  const locked = vaults.filter((v) => v.status === "locked").length
  const totalFiles = vaults.reduce((acc, v) => acc + v.files, 0)
  const verifiedContacts = contacts.filter((c) => c.verified).length
  const pendingContacts = contacts.filter((c) => !c.verified).length

  const stats = [
    {
      label: "Total Vaults",
      value: String(vaults.length),
      sub: `${active} active · ${staged} staged · ${locked} locked`,
      icon: Lock,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Encrypted Files",
      value: String(totalFiles),
      sub: "All encrypted · AES-256-GCM",
      icon: FileText,
      color: "text-vault-active",
      bg: "bg-vault-active/10",
    },
    {
      label: "Recipients",
      value: String(contacts.length),
      sub: `${verifiedContacts} verified · ${pendingContacts} pending`,
      icon: Users,
      color: "text-vault-pending",
      bg: "bg-vault-pending/10",
    },
    {
      label: "Encryption Keys",
      value: String(vaults.length * 2 + contacts.filter((c) => c.shards > 0).length),
      sub: "RSA-4096 + AES-256 hybrid",
      icon: Key,
      color: "text-muted-foreground",
      bg: "bg-secondary",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, sub, icon: Icon, color, bg }) => (
        <div key={label} className="rounded-lg border border-border bg-card p-5">
          <div className={`inline-flex items-center justify-center w-9 h-9 rounded ${bg} mb-4`}>
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
          <div className="text-2xl font-bold text-foreground font-mono">{value}</div>
          <div className="text-xs font-semibold text-foreground mt-0.5">{label}</div>
          <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{sub}</div>
        </div>
      ))}
    </div>
  )
}
