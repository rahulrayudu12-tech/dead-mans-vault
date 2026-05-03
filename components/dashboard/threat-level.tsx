import { Activity, Wifi, Globe, Server } from "lucide-react"

const indicators = [
  { label: "Inactivity Risk", value: 35, color: "bg-vault-active", textColor: "text-vault-active", status: "LOW" },
  { label: "Failed Logins", value: 20, color: "bg-vault-active", textColor: "text-vault-active", status: "1 this week" },
  { label: "Recipient Health", value: 80, color: "bg-vault-pending", textColor: "text-vault-pending", status: "2 unverified" },
  { label: "Key Age", value: 55, color: "bg-primary", textColor: "text-primary", status: "78 days old" },
]

const systemStatus = [
  { icon: Wifi, label: "Switch Daemon", ok: true },
  { icon: Server, label: "Supabase DB", ok: true },
  { icon: Globe, label: "Email Service", ok: true },
  { icon: Activity, label: "Cron Jobs", ok: true },
]

export function ThreatLevel() {
  return (
    <div className="rounded-lg border border-border bg-card p-6 flex flex-col gap-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">Risk Indicators</h2>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-vault-active/20 text-vault-active">LOW RISK</span>
        </div>
        <div className="flex flex-col gap-3">
          {indicators.map(({ label, value, color, textColor, status }) => (
            <div key={label}>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className={`text-xs font-mono ${textColor}`}>{status}</span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">System Health</h2>
        <div className="flex flex-col gap-2">
          {systemStatus.map(({ icon: Icon, label, ok }) => (
            <div key={label} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded flex items-center justify-center ${ok ? "bg-vault-active/10" : "bg-destructive/10"}`}>
                <Icon className={`w-3 h-3 ${ok ? "text-vault-active" : "text-destructive"}`} />
              </div>
              <span className="text-xs text-muted-foreground flex-1">{label}</span>
              <span className={`w-2 h-2 rounded-full ${ok ? "bg-vault-active" : "bg-destructive"}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
