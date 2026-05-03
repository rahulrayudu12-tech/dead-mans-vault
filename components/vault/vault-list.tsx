"use client"

import { useState } from "react"
import { Lock, FileText, MessageSquare, Users, Clock, Eye, Trash2, ChevronDown, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDemoStore, type Vault, type VaultStatus } from "@/lib/demo-store"
import { cn } from "@/lib/utils"
import { VaultDetailModal } from "./vault-detail-modal"
import { VaultShareModal } from "./vault-share-modal"

type FilterTab = "All" | "Active" | "Staged" | "Locked"

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

export function VaultList() {
  const { vaults, deleteVault, updateVaultStatus } = useDemoStore()
  const [filter, setFilter] = useState<FilterTab>("All")
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null)
  const [shareVault, setShareVault] = useState<Vault | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const filtered = vaults.filter((v) => {
    if (filter === "All") return true
    return v.status === filter.toLowerCase()
  })

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      deleteVault(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-wrap gap-3">
          <h2 className="text-sm font-semibold text-foreground">
            Your Vaults{" "}
            <span className="text-muted-foreground font-mono">({filtered.length})</span>
          </h2>
          <div className="flex gap-1.5">
            {(["All", "Active", "Staged", "Locked"] as FilterTab[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded font-mono transition-colors",
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Lock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No vaults in this category.</p>
            <p className="text-xs text-muted-foreground mt-1">Create a new vault using the button above.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((vault) => {
              const Icon = typeIcon[vault.type] ?? Lock
              const sc = statusConfig[vault.status]
              const isDeleting = confirmDelete === vault.id

              return (
                <div
                  key={vault.id}
                  className="px-6 py-4 flex items-center gap-4 hover:bg-secondary/30 transition-colors group"
                >
                  <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-foreground">{vault.name}</span>
                      <span className={cn("text-xs font-mono px-2 py-0.5 rounded", sc.color)}>
                        {sc.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3" /> {vault.recipients} recipients
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <FileText className="w-3 h-3" /> {vault.files} files
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {vault.trigger}
                      </span>
                    </div>
                  </div>

                  <div className="hidden md:flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs font-mono text-muted-foreground">{vault.encryption}</span>
                    <span className="text-xs text-muted-foreground">
                      {vault.size} · {vault.lastModified}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-muted-foreground hover:text-foreground"
                      onClick={() => setSelectedVault(vault)}
                      title="View vault"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-muted-foreground hover:text-primary"
                      onClick={() => setShareVault(vault)}
                      title="Share vault"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>

                    {/* Status toggle */}
                    <div className="relative group/status">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-muted-foreground hover:text-foreground"
                        title="Change status"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <div className="absolute right-0 top-full mt-1 w-36 bg-card border border-border rounded shadow-xl z-10 hidden group-hover/status:block">
                        {(["active", "staged", "locked"] as VaultStatus[])
                          .filter((s) => s !== vault.status)
                          .map((s) => (
                            <button
                              key={s}
                              onClick={() => updateVaultStatus(vault.id, s)}
                              className="w-full px-3 py-2 text-xs text-left hover:bg-secondary transition-colors font-mono"
                            >
                              Set {s.toUpperCase()}
                            </button>
                          ))}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "w-8 h-8 transition-colors",
                        isDeleting
                          ? "bg-destructive/20 text-destructive hover:bg-destructive/30"
                          : "text-muted-foreground hover:text-destructive"
                      )}
                      onClick={() => handleDelete(vault.id)}
                      title={isDeleting ? "Click again to confirm delete" : "Delete vault"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {selectedVault && (
        <VaultDetailModal vault={selectedVault} onClose={() => setSelectedVault(null)} />
      )}

      {shareVault && (
        <VaultShareModal vault={shareVault} onClose={() => setShareVault(null)} />
      )}
    </>
  )
}
