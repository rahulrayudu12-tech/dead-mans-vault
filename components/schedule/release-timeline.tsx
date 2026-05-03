import { Bell, Mail, Lock, Users, ExternalLink } from "lucide-react"

const stages = [
  {
    phase: "T+0",
    label: "Trigger Detected",
    icon: Bell,
    color: "bg-vault-pending/20 text-vault-pending border-vault-pending/30",
    dot: "bg-vault-pending",
    desc: "Switch condition met. System logs the trigger event with timestamp and source IP.",
    actions: ["Event logged to immutable audit log", "Hash written to optional blockchain anchor"],
  },
  {
    phase: "T+24h",
    label: "First Warning",
    icon: Mail,
    color: "bg-primary/20 text-primary border-primary/30",
    dot: "bg-primary",
    desc: "Email + optional SMS alert sent to owner using the registered recovery address.",
    actions: ["Resend link generated (72h TTL)", "Emergency contacts notified of pending trigger"],
  },
  {
    phase: "T+72h",
    label: "Grace Period Ends",
    icon: Bell,
    color: "bg-vault-pending/20 text-vault-pending border-vault-pending/30",
    dot: "bg-vault-pending",
    desc: "No response from owner. System escalates to emergency contact verification stage.",
    actions: ["Contacts must confirm via signed email link", "2-of-3 confirmation threshold active"],
  },
  {
    phase: "T+96h",
    label: "Stage 1 Release",
    icon: Lock,
    color: "bg-destructive/20 text-destructive border-destructive/30",
    dot: "bg-destructive",
    desc: "Low-sensitivity vaults released to verified recipients. Key shards delivered via encrypted email.",
    actions: ["AES key shard decrypted server-side from escrow", "Notification sent with decrypt instructions"],
  },
  {
    phase: "T+7d",
    label: "Stage 2 Release",
    icon: Users,
    color: "bg-destructive/20 text-destructive border-destructive/30",
    dot: "bg-destructive",
    desc: "High-sensitivity vaults released. Shamir SSS key assembly required from 2 recipients.",
    actions: ["Recipients assemble key shards client-side", "Decryption happens entirely in-browser"],
  },
  {
    phase: "T+30d",
    label: "Full Disclosure",
    icon: ExternalLink,
    color: "bg-vault-locked/10 text-muted-foreground border-border",
    dot: "bg-vault-locked",
    desc: "Any unreleased vaults with delayed timers are disclosed. Audit trail archived permanently.",
    actions: ["All vault states locked to read-only", "Audit hash finalized and exported"],
  },
]

export function ReleaseTimeline() {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Staged Release Timeline</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Default schedule — customizable per vault</p>
      </div>
      <div className="p-6">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-3.5 top-3 bottom-3 w-px bg-border" />
          <div className="flex flex-col gap-6">
            {stages.map(({ phase, label, icon: Icon, color, dot, desc, actions }) => (
              <div key={phase} className="flex gap-4 relative">
                <div className={`w-7 h-7 rounded-full border shrink-0 flex items-center justify-center relative z-10 ${color}`}>
                  <Icon className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0 pb-1">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-xs font-mono text-muted-foreground">{phase}</span>
                    <span className="text-sm font-semibold text-foreground">{label}</span>
                    <span className={`w-2 h-2 rounded-full ${dot}`} />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">{desc}</p>
                  <div className="flex flex-col gap-1">
                    {actions.map((a) => (
                      <div key={a} className="flex items-start gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-muted-foreground mt-1.5 shrink-0" />
                        <span className="text-xs text-muted-foreground">{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
