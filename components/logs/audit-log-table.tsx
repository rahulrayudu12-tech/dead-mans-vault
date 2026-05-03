"use client"

import { useState } from "react"
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useDemoStore } from "@/lib/demo-store"
import type { LogEntry } from "@/lib/demo-store"

type DisplayLevel = "OK" | "INFO" | "WARN" | "ALERT"

const severityToLevel: Record<LogEntry["severity"], DisplayLevel> = {
  ok: "OK",
  info: "INFO",
  warn: "WARN",
  alert: "ALERT",
}

const levelConfig: Record<DisplayLevel, { color: string; bg: string }> = {
  OK: { color: "text-vault-active", bg: "bg-vault-active/20" },
  INFO: { color: "text-muted-foreground", bg: "bg-secondary" },
  WARN: { color: "text-vault-pending", bg: "bg-vault-pending/20" },
  ALERT: { color: "text-destructive", bg: "bg-destructive/20" },
}

function formatTimestamp(date: Date): string {
  return date.toISOString().replace("T", " ").slice(0, 19) + " UTC"
}

function shortHash(id: string): string {
  // deterministic display hash from the id
  return id.replace("l", "").padStart(8, "0").slice(-8)
}

const PAGE_SIZE = 8

export function AuditLogTable() {
  const { logs } = useDemoStore()
  const [query, setQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("ALL")
  const [page, setPage] = useState(1)

  const filtered = logs.filter((log) => {
    const level = severityToLevel[log.severity]
    const matchLevel = levelFilter === "ALL" || level === levelFilter
    const matchQuery =
      !query ||
      log.action.toLowerCase().includes(query.toLowerCase()) ||
      log.detail.toLowerCase().includes(query.toLowerCase())
    return matchLevel && matchQuery
  })

  const totalPages = Math.max(Math.ceil(filtered.length / PAGE_SIZE), 1)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-6 py-4 border-b border-border">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search events or details..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            className="pl-8 bg-secondary border-border text-foreground placeholder:text-muted-foreground text-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["ALL", "OK", "INFO", "WARN", "ALERT"] as const).map((l) => (
            <button
              key={l}
              onClick={() => {
                setLevelFilter(l)
                setPage(1)
              }}
              className={cn(
                "text-xs font-mono px-2.5 py-1.5 rounded transition-colors",
                levelFilter === l
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {l}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" className="shrink-0">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              {["Timestamp", "Level", "Event", "Detail", ""].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paged.map((log) => {
              const level = severityToLevel[log.severity]
              const { color, bg } = levelConfig[level]
              return (
                <tr key={log.id} className="hover:bg-secondary/20 transition-colors group">
                  <td className="px-4 py-3 font-mono text-muted-foreground whitespace-nowrap">
                    {formatTimestamp(log.time)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("font-mono px-1.5 py-0.5 rounded text-[10px]", bg, color)}>
                      {level}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-foreground font-semibold whitespace-nowrap max-w-[180px] truncate">
                    {log.action}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[260px] truncate">{log.detail}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{shortHash(log.id)}</td>
                </tr>
              )
            })}
            {paged.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No log entries match your filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-border">
        <span className="text-xs text-muted-foreground">
          {filtered.length} entries · Page {page} of {totalPages}
        </span>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
