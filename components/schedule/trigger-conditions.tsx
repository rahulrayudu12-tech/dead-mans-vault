"use client"

import { useState } from "react"
import { Clock, AlertTriangle, UserX, Gavel, ToggleLeft, ToggleRight, Info } from "lucide-react"
import { cn } from "@/lib/utils"

const triggers = [
  {
    id: "inactivity",
    icon: Clock,
    label: "Inactivity Timeout",
    desc: "Trigger if no check-in is received within the configured window.",
    enabled: true,
    config: "30 days",
    configType: "days",
    severity: "medium",
  },
  {
    id: "death",
    icon: AlertTriangle,
    label: "Death Confirmation",
    desc: "Triggered when 2 of 3 emergency contacts confirm via signed response.",
    enabled: true,
    config: "2-of-3 majority",
    configType: "none",
    severity: "high",
  },
  {
    id: "missing",
    icon: UserX,
    label: "Missing Person",
    desc: "Triggered after extended inactivity + emergency contact escalation.",
    enabled: true,
    config: "60 days",
    configType: "days",
    severity: "high",
  },
  {
    id: "arrest",
    icon: Gavel,
    label: "Arrest / Detention",
    desc: "Manual trigger by a designated contact after providing a signed declaration.",
    enabled: false,
    config: "Manual only",
    configType: "none",
    severity: "low",
  },
]

const severityColors: Record<string, string> = {
  high: "text-destructive bg-destructive/20",
  medium: "text-vault-pending bg-vault-pending/20",
  low: "text-muted-foreground bg-secondary",
}

export function TriggerConditions() {
  const [states, setStates] = useState<Record<string, boolean>>(
    Object.fromEntries(triggers.map((t) => [t.id, t.enabled]))
  )
  const [days, setDays] = useState<Record<string, number>>({ inactivity: 30, missing: 60 })

  const toggle = (id: string) => setStates((s) => ({ ...s, [id]: !s[id] }))

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Trigger Conditions</h2>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Info className="w-3 h-3" />
          <span>Multiple conditions use OR logic</span>
        </div>
      </div>
      <div className="divide-y divide-border">
        {triggers.map((trigger) => {
          const Icon = trigger.icon
          const enabled = states[trigger.id]
          return (
            <div key={trigger.id} className={cn(
              "px-6 py-5 flex items-start gap-4 transition-opacity",
              !enabled && "opacity-50"
            )}>
              <div className={cn("w-8 h-8 rounded shrink-0 flex items-center justify-center mt-0.5", enabled ? "bg-primary/10" : "bg-secondary")}>
                <Icon className={cn("w-4 h-4", enabled ? "text-primary" : "text-muted-foreground")} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-foreground">{trigger.label}</span>
                  <span className={cn("text-xs font-mono px-1.5 py-0.5 rounded", severityColors[trigger.severity])}>
                    {trigger.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{trigger.desc}</p>

                {trigger.configType === "days" && enabled && (
                  <div className="flex items-center gap-3 mt-3">
                    <label className="text-xs text-muted-foreground">Timeout:</label>
                    <div className="flex items-center gap-2">
                      {[7, 14, 30, 60, 90].map((d) => (
                        <button
                          key={d}
                          onClick={() => setDays((prev) => ({ ...prev, [trigger.id]: d }))}
                          className={cn(
                            "text-xs font-mono px-2 py-1 rounded transition-colors",
                            days[trigger.id] === d
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {d}d
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => toggle(trigger.id)}
                className="shrink-0 mt-0.5"
                aria-label={`Toggle ${trigger.label}`}
              >
                {enabled ? (
                  <ToggleRight className="w-6 h-6 text-primary" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-muted-foreground" />
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
