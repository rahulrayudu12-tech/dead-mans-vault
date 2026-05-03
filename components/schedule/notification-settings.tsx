"use client"

import { useState } from "react"
import { Mail, MessageSquare, Bell, ToggleLeft, ToggleRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const channels = [
  { id: "email", icon: Mail, label: "Email", value: "j.doe@proton.me", enabled: true, editable: true },
  { id: "sms", icon: MessageSquare, label: "SMS", value: "+1 (555) 000-0000", enabled: true, editable: true },
  { id: "push", icon: Bell, label: "Push (PWA)", value: "Enabled on this device", enabled: false, editable: false },
]

const reminders = [
  { label: "7 days before deadline", enabled: true },
  { label: "3 days before deadline", enabled: true },
  { label: "24 hours before deadline", enabled: true },
  { label: "Grace period start", enabled: true },
  { label: "Contact confirmation", enabled: false },
]

export function NotificationSettings() {
  const [channelStates, setChannelStates] = useState<Record<string, boolean>>(
    Object.fromEntries(channels.map((c) => [c.id, c.enabled]))
  )
  const [reminderStates, setReminderStates] = useState<Record<string, boolean>>(
    Object.fromEntries(reminders.map((r) => [r.label, r.enabled]))
  )

  return (
    <div className="flex flex-col gap-4">
      {/* Notification channels */}
      <div className="rounded-lg border border-border bg-card">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Notification Channels</h2>
        </div>
        <div className="divide-y divide-border">
          {channels.map(({ id, icon: Icon, label, value, editable }) => {
            const enabled = channelStates[id]
            return (
              <div key={id} className="px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-semibold text-foreground">{label}</span>
                  </div>
                  <button onClick={() => setChannelStates((s) => ({ ...s, [id]: !s[id] }))}>
                    {enabled
                      ? <ToggleRight className="w-5 h-5 text-primary" />
                      : <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                    }
                  </button>
                </div>
                {editable && (
                  <Input
                    defaultValue={value}
                    disabled={!enabled}
                    className="text-xs h-8 bg-secondary border-border text-foreground disabled:opacity-40"
                  />
                )}
                {!editable && (
                  <p className="text-xs text-muted-foreground">{value}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Reminder schedule */}
      <div className="rounded-lg border border-border bg-card">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Reminder Schedule</h2>
        </div>
        <div className="divide-y divide-border">
          {reminders.map(({ label }) => {
            const enabled = reminderStates[label]
            return (
              <div key={label} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-xs text-muted-foreground">{label}</span>
                <button onClick={() => setReminderStates((s) => ({ ...s, [label]: !s[label] }))}>
                  {enabled
                    ? <ToggleRight className="w-5 h-5 text-primary" />
                    : <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                  }
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <Button size="sm" className="w-full">Save Notification Settings</Button>
    </div>
  )
}
