"use client"

import { useState, useEffect } from "react"
import { Shield, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDemoStore } from "@/lib/demo-store"

export function SwitchCountdown() {
  const { lastCheckIn, switchPeriodDays } = useDemoStore()
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const totalSeconds = switchPeriodDays * 24 * 60 * 60
  
  // Show loading skeleton until mounted
  if (now === null) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Dead Man&apos;s Switch</span>
          </div>
          <div className="h-6 w-16 bg-secondary rounded" />
        </div>
        <div className="flex items-end gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center">
              <div className="h-10 w-12 bg-secondary rounded" />
              <div className="h-3 w-8 bg-secondary rounded mt-1 mx-auto" />
            </div>
          ))}
        </div>
        <div className="h-2 bg-secondary rounded-full" />
      </div>
    )
  }

  const elapsedSeconds = Math.floor((now - lastCheckIn.getTime()) / 1000)
  const remaining = Math.max(totalSeconds - elapsedSeconds, 0)
  const percent = Math.min((elapsedSeconds / totalSeconds) * 100, 100)

  const days = Math.floor(remaining / 86400)
  const hours = Math.floor((remaining % 86400) / 3600)
  const minutes = Math.floor((remaining % 3600) / 60)
  const seconds = remaining % 60

  const isWarning = percent > 70
  const isCritical = percent > 90

  const triggerDate = new Date(lastCheckIn.getTime() + totalSeconds * 1000)
  const triggerStr = triggerDate.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  })

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-6",
        isCritical ? "border-destructive" : isWarning ? "border-vault-pending" : "border-border"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isCritical ? (
            <AlertTriangle className="w-5 h-5 text-destructive animate-pulse" />
          ) : (
            <Shield className="w-5 h-5 text-primary" />
          )}
          <span className="text-sm font-semibold text-foreground">Dead Man&apos;s Switch</span>
        </div>
        <span
          className={cn(
            "text-xs font-mono px-2 py-1 rounded",
            isCritical
              ? "bg-destructive/20 text-destructive"
              : isWarning
              ? "bg-vault-pending/20 text-vault-pending"
              : "bg-vault-active/20 text-vault-active"
          )}
        >
          {isCritical ? "CRITICAL" : isWarning ? "WARNING" : "ACTIVE"}
        </span>
      </div>

      <div className="flex items-end gap-4 mb-6 flex-wrap">
        {[
          { value: days, label: "DAYS" },
          { value: hours, label: "HRS" },
          { value: minutes, label: "MIN" },
          { value: seconds, label: "SEC" },
        ].map(({ value, label }) => (
          <div key={label} className="text-center">
            <div
              className={cn(
                "text-4xl font-bold font-mono tabular-nums leading-none",
                isCritical ? "text-destructive" : isWarning ? "text-vault-pending" : "text-foreground"
              )}
            >
              {String(value).padStart(2, "0")}
            </div>
            <div className="text-xs text-muted-foreground font-mono mt-1">{label}</div>
          </div>
        ))}
        <div className="text-muted-foreground text-lg font-mono mb-1 leading-none">until trigger</div>
      </div>

      <div className="relative">
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000",
              isCritical ? "bg-destructive" : isWarning ? "bg-vault-pending" : "bg-vault-active"
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-foreground font-mono">0d</span>
          <span className="text-xs text-muted-foreground font-mono">{Math.round(percent)}% elapsed</span>
          <span className="text-xs text-muted-foreground font-mono">{switchPeriodDays}d</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
        You must check in before{" "}
        <span className="text-foreground font-semibold">{triggerStr}</span>.
        Failure to respond will trigger the multi-stage release sequence.
      </p>
    </div>
  )
}
