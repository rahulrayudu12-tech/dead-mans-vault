import { SwitchCountdown } from "@/components/dashboard/switch-countdown"
import { VaultSummaryCards } from "@/components/dashboard/vault-summary-cards"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { CheckInPrompt } from "@/components/dashboard/check-in-prompt"
import { ThreatLevel } from "@/components/dashboard/threat-level"

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
          Control Center
        </p>
        <h1 className="text-2xl font-bold text-balance text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor your dead man&apos;s switch status, vault health, and recent activity.
        </p>
      </div>

      {/* Top row: countdown + check-in */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <SwitchCountdown />
        </div>
        <div>
          <CheckInPrompt />
        </div>
      </div>

      {/* Summary cards */}
      <VaultSummaryCards />

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div>
          <ThreatLevel />
        </div>
      </div>
    </div>
  )
}
