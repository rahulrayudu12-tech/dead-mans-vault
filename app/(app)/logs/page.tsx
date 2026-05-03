import { AuditLogTable } from "@/components/logs/audit-log-table"
import { LogStats } from "@/components/logs/log-stats"

export default function LogsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
          Immutable Record
        </p>
        <h1 className="text-2xl font-bold text-balance text-foreground">Audit Logs</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tamper-evident, append-only event log. All entries are HMAC-chained and hash-anchored.
        </p>
      </div>

      <LogStats />
      <div className="mt-6">
        <AuditLogTable />
      </div>
    </div>
  )
}
