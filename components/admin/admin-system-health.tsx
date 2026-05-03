import { Server, Database, Globe, Mail, Cpu, HardDrive } from "lucide-react"

const services = [
  { icon: Server, label: "Vercel Edge", status: "operational", latency: "12ms", uptime: "99.98%" },
  { icon: Database, label: "Supabase DB", status: "operational", latency: "28ms", uptime: "99.95%" },
  { icon: Globe, label: "Cron Scheduler", status: "operational", latency: "—", uptime: "100%" },
  { icon: Mail, label: "Resend (Email)", status: "operational", latency: "145ms", uptime: "99.90%" },
  { icon: HardDrive, label: "Vercel Blob", status: "operational", latency: "55ms", uptime: "99.99%" },
  { icon: Cpu, label: "Switch Daemon", status: "operational", latency: "—", uptime: "100%" },
]

const globalMetrics = [
  { label: "Total Users", value: "1,204" },
  { label: "Active Vaults", value: "3,891" },
  { label: "Pending Triggers", value: "7" },
  { label: "Triggered (30d)", value: "2" },
  { label: "Keys in Escrow", value: "11,673" },
  { label: "Storage Used", value: "94.2 GB" },
]

export function AdminSystemHealth() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Service status */}
      <div className="lg:col-span-2 rounded-lg border border-border bg-card">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Service Status</h2>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-vault-active/20 text-vault-active">
            ALL SYSTEMS OPERATIONAL
          </span>
        </div>
        <div className="divide-y divide-border">
          {services.map(({ icon: Icon, label, status, latency, uptime }) => (
            <div key={label} className="flex items-center gap-4 px-6 py-3">
              <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-sm text-foreground flex-1">{label}</span>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-muted-foreground">{latency}</span>
                <span className="text-muted-foreground">{uptime}</span>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-vault-active" />
                  <span className="text-vault-active">{status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global metrics */}
      <div className="rounded-lg border border-border bg-card">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Platform Metrics</h2>
        </div>
        <div className="divide-y divide-border">
          {globalMetrics.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-6 py-3">
              <span className="text-xs text-muted-foreground">{label}</span>
              <span className="text-sm font-bold font-mono text-foreground">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
