"use client"

import { useState } from "react"
import { Users, Search, AlertTriangle, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const users = [
  { id: "u1", email: "alice@proton.me", vaults: 7, status: "active", switchDays: 12, lastSeen: "2h ago", risk: "low" },
  { id: "u2", email: "bob@tutanota.com", vaults: 3, status: "active", switchDays: 27, lastSeen: "1d ago", risk: "medium" },
  { id: "u3", email: "carol@skiff.com", vaults: 12, status: "triggered", switchDays: 0, lastSeen: "38d ago", risk: "high" },
  { id: "u4", email: "dave@pm.me", vaults: 2, status: "active", switchDays: 4, lastSeen: "3h ago", risk: "low" },
  { id: "u5", email: "eve@proton.me", vaults: 5, status: "inactive", switchDays: 21, lastSeen: "14d ago", risk: "medium" },
  { id: "u6", email: "frank@tutanota.com", vaults: 9, status: "active", switchDays: 8, lastSeen: "5h ago", risk: "low" },
  { id: "u7", email: "grace@proton.me", vaults: 1, status: "pending", switchDays: 30, lastSeen: "Never", risk: "low" },
]

const statusConfig: Record<string, string> = {
  active: "bg-vault-active/20 text-vault-active",
  triggered: "bg-destructive/20 text-destructive",
  inactive: "bg-vault-pending/20 text-vault-pending",
  pending: "bg-secondary text-muted-foreground",
}

const riskConfig: Record<string, string> = {
  low: "text-vault-active",
  medium: "text-vault-pending",
  high: "text-destructive",
}

export function AdminUserTable() {
  const [query, setQuery] = useState("")

  const filtered = users.filter((u) =>
    !query || u.email.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <Users className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Users ({users.length})</h2>
        <div className="relative flex-1 max-w-xs ml-auto">
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 h-8 text-xs bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              {["Email", "Vaults", "Switch Status", "Days Left", "Last Seen", "Risk", ""].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-secondary/20 transition-colors group">
                <td className="px-5 py-3 text-foreground font-mono">{user.email}</td>
                <td className="px-5 py-3 text-muted-foreground font-mono">{user.vaults}</td>
                <td className="px-5 py-3">
                  <span className={cn("font-mono px-1.5 py-0.5 rounded text-[10px]", statusConfig[user.status])}>
                    {user.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className={cn("font-mono font-bold", user.switchDays <= 5 ? "text-destructive" : user.switchDays <= 10 ? "text-vault-pending" : "text-muted-foreground")}>
                    {user.status === "triggered" ? "—" : `${user.switchDays}d`}
                  </span>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{user.lastSeen}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    {user.risk === "high" && <AlertTriangle className="w-3 h-3 text-destructive" />}
                    <span className={cn("font-mono uppercase", riskConfig[user.risk])}>{user.risk}</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <Button variant="ghost" size="icon" className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                    <Eye className="w-3.5 h-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
