"use client"

import { useState } from "react"
import { 
  Link2, 
  Unlink, 
  CheckCircle, 
  Clock, 
  ToggleLeft, 
  ToggleRight,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useDemoStore, type IntegrationType } from "@/lib/demo-store"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const integrationMeta: Record<IntegrationType, { icon: string; color: string; description: string }> = {
  notion: {
    icon: "N",
    color: "bg-[#000]/90 text-white",
    description: "Track page edits, comments, and database updates",
  },
  google: {
    icon: "G",
    color: "bg-[#4285F4] text-white",
    description: "Monitor Gmail, Drive, and Calendar activity",
  },
  github: {
    icon: "GH",
    color: "bg-[#24292e] text-white",
    description: "Track commits, PRs, and repository activity",
  },
  slack: {
    icon: "S",
    color: "bg-[#4A154B] text-white",
    description: "Monitor messages, reactions, and workspace activity",
  },
  calendar: {
    icon: "C",
    color: "bg-[#F4511E] text-white",
    description: "Track event attendance and calendar updates",
  },
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function ExternalIntegrations() {
  const { 
    integrations, 
    connectIntegration, 
    disconnectIntegration, 
    toggleIntegrationActivityCheck 
  } = useDemoStore()
  
  const [connectModal, setConnectModal] = useState<IntegrationType | null>(null)
  const [email, setEmail] = useState("")
  const [connecting, setConnecting] = useState(false)

  const handleConnect = async () => {
    if (!connectModal || !email) return
    setConnecting(true)
    // Simulate OAuth delay
    await new Promise((r) => setTimeout(r, 1500))
    connectIntegration(connectModal, email)
    setConnecting(false)
    setConnectModal(null)
    setEmail("")
  }

  const connectedCount = integrations.filter((i) => i.connected).length
  const activeChecks = integrations.filter((i) => i.checkForActivity).length

  return (
    <>
      <div className="rounded-lg border border-border bg-card">
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Activity Verification</h2>
            <span className="text-xs text-muted-foreground font-mono">
              {connectedCount} connected / {activeChecks} monitoring
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Connect external apps to verify your activity. If no activity is detected across all connected services, the dead man&apos;s switch will trigger.
          </p>
        </div>

        <div className="divide-y divide-border">
          {integrations.map((integration) => {
            const meta = integrationMeta[integration.type]
            return (
              <div key={integration.id} className="px-6 py-4 flex items-center gap-4">
                <div className={cn("w-10 h-10 rounded flex items-center justify-center font-bold text-sm shrink-0", meta.color)}>
                  {meta.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{integration.name}</span>
                    {integration.connected ? (
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-vault-active/20 text-vault-active">
                        CONNECTED
                      </span>
                    ) : (
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                        NOT CONNECTED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{meta.description}</p>
                  {integration.connected && integration.lastActivity && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      Last activity: {timeAgo(integration.lastActivity)}
                      {integration.accountEmail && (
                        <span className="ml-2 text-foreground/70">{integration.accountEmail}</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {integration.connected && (
                    <button
                      onClick={() => toggleIntegrationActivityCheck(integration.id)}
                      className="flex items-center gap-1 text-xs"
                      title={integration.checkForActivity ? "Disable activity check" : "Enable activity check"}
                    >
                      {integration.checkForActivity ? (
                        <ToggleRight className="w-5 h-5 text-primary" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                  )}
                  
                  {integration.connected ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-destructive hover:text-destructive"
                      onClick={() => disconnectIntegration(integration.id)}
                    >
                      <Unlink className="w-3 h-3 mr-1" />
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => setConnectModal(integration.type)}
                    >
                      <Link2 className="w-3 h-3 mr-1" />
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="px-6 py-4 border-t border-border bg-secondary/30">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-vault-active shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">How it works:</strong> We check for recent activity (edits, commits, messages, events) across your connected apps. 
              If you&apos;re active on ANY connected service, the switch resets. This provides redundant proof-of-life beyond manual check-ins.
            </p>
          </div>
        </div>
      </div>

      <Dialog open={!!connectModal} onOpenChange={() => setConnectModal(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect {connectModal && integrationMeta[connectModal]?.icon}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">
              Enter your account email to connect. In production, this would redirect to OAuth.
            </p>
            <Input
              placeholder="your-email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConnectModal(null)}>
                Cancel
              </Button>
              <Button onClick={handleConnect} disabled={!email || connecting}>
                {connecting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Connect
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
