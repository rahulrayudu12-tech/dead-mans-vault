import { TriggerConditions } from "@/components/schedule/trigger-conditions"
import { ReleaseTimeline } from "@/components/schedule/release-timeline"
import { NotificationSettings } from "@/components/schedule/notification-settings"
import { ExternalIntegrations } from "@/components/schedule/external-integrations"
import { AutoReleaseConfigurator } from "@/components/schedule/auto-release-config"

export default function SchedulePage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
          Automation
        </p>
        <h1 className="text-2xl font-bold text-balance text-foreground">Release Scheduling</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure the conditions, integrations, and timeline for automated vault disclosure.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <TriggerConditions />
          <ExternalIntegrations />
          <AutoReleaseConfigurator />
          <ReleaseTimeline />
        </div>
        <div>
          <NotificationSettings />
        </div>
      </div>
    </div>
  )
}
