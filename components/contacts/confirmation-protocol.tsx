import { Shield, CheckCircle, XCircle, Clock } from "lucide-react"

const steps = [
  {
    step: 1,
    label: "Trigger Detected",
    desc: "System detects inactivity or receives an external confirmation request.",
    status: "info",
  },
  {
    step: 2,
    label: "Email Sent to All Contacts",
    desc: "Each contact receives a signed, tamper-proof confirmation link (HMAC-SHA256, 72h TTL).",
    status: "info",
  },
  {
    step: 3,
    label: "Independent Verification",
    desc: "Each contact submits a digitally signed confirmation. No contact can see others' responses.",
    status: "info",
  },
  {
    step: 4,
    label: "Threshold Reached",
    desc: "2-of-3 minimum confirmations triggers the release sequence. Minority responses are logged.",
    status: "info",
  },
  {
    step: 5,
    label: "Key Shard Delivery",
    desc: "Each contact receives their unique key shard encrypted to their public key (RSA-4096).",
    status: "info",
  },
]

const protocolStats = [
  { label: "Threshold Model", value: "Shamir 2-of-3", ok: true },
  { label: "Link Expiry", value: "72 hours", ok: true },
  { label: "Replay Protection", value: "Nonce + timestamp", ok: true },
  { label: "Anti-Coercion", value: "Duress code support", ok: true },
  { label: "False Positive Guard", value: "Owner override window", ok: true },
]

export function ConfirmationProtocol() {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
        <Shield className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Confirmation Protocol</h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Steps */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">Release Flow</h3>
            <div className="flex flex-col gap-3">
              {steps.map(({ step, label, desc }) => (
                <div key={step} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0 text-xs font-bold font-mono text-muted-foreground">
                    {step}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Protocol security */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">Security Properties</h3>
            <div className="flex flex-col gap-2">
              {protocolStats.map(({ label, value, ok }) => (
                <div key={label} className="flex items-center gap-3 py-1.5 border-b border-border last:border-0">
                  {ok
                    ? <CheckCircle className="w-4 h-4 text-vault-active shrink-0" />
                    : <XCircle className="w-4 h-4 text-destructive shrink-0" />
                  }
                  <span className="text-xs text-muted-foreground flex-1">{label}</span>
                  <span className="text-xs font-mono text-foreground">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded bg-primary/10 border border-primary/20 p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-3 h-3 text-primary" />
                <span className="text-xs font-semibold text-primary">Anti-Coercion Duress Code</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Set a secondary passphrase that triggers a silent abort. Releases decoy data instead of real vault contents.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
