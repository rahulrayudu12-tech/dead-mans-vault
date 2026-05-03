"use client"

import { X, Lock, FileText, MessageSquare, Shield, Eye, EyeOff, File } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Vault, VaultStatus } from "@/lib/demo-store"
import { useDemoStore } from "@/lib/demo-store"

const typeIcon: Record<string, typeof Lock> = {
  document: FileText,
  secret: Lock,
  message: MessageSquare,
}

const statusConfig: Record<VaultStatus, { label: string; color: string }> = {
  active: { label: "ACTIVE", color: "bg-vault-active/20 text-vault-active" },
  staged: { label: "STAGED", color: "bg-vault-pending/20 text-vault-pending" },
  locked: { label: "LOCKED", color: "bg-vault-locked/20 text-muted-foreground" },
  triggered: { label: "TRIGGERED", color: "bg-destructive/20 text-destructive" },
}

function formatFileSize(bytes: number): string {
  if (bytes > 1048576) return `${(bytes / 1048576).toFixed(1)} MB`
  if (bytes > 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${bytes} B`
}

export function VaultDetailModal({ vault, onClose }: { vault: Vault; onClose: () => void }) {
  const { updateVaultStatus } = useDemoStore()
  const Icon = typeIcon[vault.type] ?? Lock
  const sc = statusConfig[vault.status]
  const [revealed, setRevealed] = useState(false)
  
  const files = vault.uploadedFiles ?? []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center">
              <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">{vault.name}</h2>
              <span className={cn("text-xs font-mono px-1.5 py-0.5 rounded", sc.color)}>{sc.label}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-5">
          {/* Message */}
          {vault.message && (
            <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
              <h3 className="text-xs font-semibold text-primary mb-2">Secure Message</h3>
              <p className={cn("text-sm text-foreground transition-all", !revealed && "blur-sm select-none")}>
                {vault.message}
              </p>
            </div>
          )}

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Encryption", value: vault.encryption },
              { label: "Trigger", value: vault.trigger },
              { label: "Recipients", value: `${vault.recipients} assigned` },
              { label: "Last Modified", value: vault.lastModified },
              { label: "Size", value: vault.size || "—" },
              { label: "Files", value: `${files.length} encrypted` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-secondary rounded p-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-xs font-mono font-semibold text-foreground mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {/* Files */}
          {files.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-foreground">Encrypted Contents</h3>
                <button
                  onClick={() => setRevealed((r) => !r)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {revealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {revealed ? "Hide" : "Reveal"}
                </button>
              </div>
              <div className="rounded border border-border divide-y divide-border overflow-hidden">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center gap-3 px-4 py-2.5 bg-background">
                    <File className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className={cn("text-xs font-mono flex-1 truncate transition-all", !revealed && "blur-sm select-none")}>
                      {file.name}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono shrink-0">{formatFileSize(file.size)}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Contents are encrypted at rest. Decryption requires your key + recipient threshold.
              </p>
            </div>
          )}

          {files.length === 0 && (
            <div className="rounded border border-dashed border-border p-6 text-center">
              <File className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">No files uploaded to this vault yet.</p>
            </div>
          )}

          {/* Status controls */}
          {vault.status !== "triggered" && (
            <div>
              <h3 className="text-xs font-semibold text-foreground mb-3">Change Status</h3>
              <div className="flex gap-2 flex-wrap">
                {(["active", "staged", "locked"] as VaultStatus[])
                  .filter((s) => s !== vault.status)
                  .map((s) => (
                    <Button
                      key={s}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        updateVaultStatus(vault.id, s)
                        onClose()
                      }}
                    >
                      Set {s.charAt(0).toUpperCase() + s.slice(1)}
                    </Button>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border shrink-0">
          <Button variant="outline" size="sm" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
