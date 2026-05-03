import { AdminUserTable } from "@/components/admin/admin-user-table"
import { AdminSystemHealth } from "@/components/admin/admin-system-health"
import { AdminCronJobs } from "@/components/admin/admin-cron-jobs"
import { AdminRateLimits } from "@/components/admin/admin-rate-limits"

export default function AdminPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
            Operator View
          </p>
          <h1 className="text-2xl font-bold text-balance text-foreground">Admin Monitoring Panel</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Platform-level oversight, system health, rate limiting, and cron job status.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono px-3 py-2 rounded bg-destructive/10 border border-destructive/30 text-destructive">
          ADMIN ACCESS
        </div>
      </div>

      <AdminSystemHealth />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <AdminCronJobs />
        <AdminRateLimits />
      </div>

      <div className="mt-6">
        <AdminUserTable />
      </div>
    </div>
  )
}
