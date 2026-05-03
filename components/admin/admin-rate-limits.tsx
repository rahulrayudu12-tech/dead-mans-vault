import { Shield, Ban } from "lucide-react"
import { Button } from "@/components/ui/button"

const limits = [
  { route: "/api/auth/login", limit: "10/min", current: 2, max: 10, blocked: 3 },
  { route: "/api/check-in", limit: "5/min", current: 1, max: 5, blocked: 0 },
  { route: "/api/vault/create", limit: "20/hr", current: 4, max: 20, blocked: 0 },
  { route: "/api/contact/confirm", limit: "3/min", current: 0, max: 3, blocked: 0 },
  { route: "/api/trigger/evaluate", limit: "100/hr", current: 28, max: 100, blocked: 0 },
]

const blockedIPs = [
  { ip: "185.220.101.47", reason: "Brute-force login", blocked: "2026-04-28", expires: "Permanent" },
  { ip: "45.142.212.100", reason: "Rate limit exceeded", blocked: "2026-05-01", expires: "2026-05-08" },
  { ip: "94.102.49.190", reason: "Suspicious pattern", blocked: "2026-05-02", expires: "2026-05-09" },
]

export function AdminRateLimits() {
  return (
    <div className="flex flex-col gap-4">
      {/* Rate limits */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
          <Shield className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Rate Limits</h2>
        </div>
        <div className="divide-y divide-border">
          {limits.map(({ route, limit, current, max, blocked }) => (
            <div key={route} className="px-5 py-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono text-foreground">{route}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">{current}/{max}</span>
                  <span className="text-xs text-muted-foreground">{limit}</span>
                  {blocked > 0 && (
                    <span className="text-xs font-mono text-destructive bg-destructive/20 px-1.5 py-0.5 rounded">
                      {blocked} blocked
                    </span>
                  )}
                </div>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    current / max > 0.8 ? "bg-destructive" : current / max > 0.5 ? "bg-vault-pending" : "bg-vault-active"
                  }`}
                  style={{ width: `${(current / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blocked IPs */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
          <Ban className="w-4 h-4 text-destructive" />
          <h2 className="text-sm font-semibold text-foreground">Blocked IPs ({blockedIPs.length})</h2>
        </div>
        <div className="divide-y divide-border">
          {blockedIPs.map(({ ip, reason, blocked, expires }) => (
            <div key={ip} className="flex items-center gap-3 px-5 py-3">
              <div className="flex-1 min-w-0">
                <span className="text-xs font-mono text-foreground">{ip}</span>
                <p className="text-xs text-muted-foreground mt-0.5">{reason} · blocked {blocked}</p>
              </div>
              <span className={`text-xs font-mono ${expires === "Permanent" ? "text-destructive" : "text-muted-foreground"}`}>
                {expires}
              </span>
              <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground hover:text-foreground">
                Unblock
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
