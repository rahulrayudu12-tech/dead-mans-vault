"use client"

import { useState, useEffect, use } from "react"
import { Shield, Lock, Mail, Key, FileText, File, AlertTriangle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDemoStore, type Vault } from "@/lib/demo-store"
import { cn } from "@/lib/utils"

function formatFileSize(bytes: number): string {
  if (bytes > 1048576) return `${(bytes / 1048576).toFixed(1)} MB`
  if (bytes > 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${bytes} B`
}

export default function ShareAccessPage({
  params,
}: {
  params: Promise<{ vaultId: string; linkId: string }>
}) {
  const { vaultId, linkId } = use(params)
  const { validateShareAccess, vaults } = useDemoStore()

  const [email, setEmail] = useState("")
  const [passcode, setPasscode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [unlockedVault, setUnlockedVault] = useState<Vault | null>(null)
  const [revealed, setRevealed] = useState(false)

  // Check if vault exists
  const vaultExists = vaults.some((v) => v.id === vaultId)

  const handleUnlock = () => {
    setError("")
    setLoading(true)

    // Simulate network delay
    setTimeout(() => {
      const result = validateShareAccess(vaultId, linkId, passcode, email)

      if (result.success && result.vault) {
        setUnlockedVault(result.vault)
      } else {
        setError("Invalid passcode or email. Access denied.")
      }
      setLoading(false)
    }, 1500)
  }

  if (!vaultExists) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">Vault Not Found</h1>
          <p className="text-sm text-muted-foreground">
            This vault does not exist or has been deleted by the owner.
          </p>
        </div>
      </div>
    )
  }

  if (unlockedVault) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="rounded-lg border border-primary/30 bg-card shadow-2xl overflow-hidden">
            {/* Success header */}
            <div className="bg-primary/10 px-6 py-4 border-b border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-vault-active/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-vault-active" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-foreground">Access Granted</h1>
                  <p className="text-xs text-muted-foreground">Vault decrypted successfully</p>
                </div>
              </div>
            </div>

            {/* Vault contents */}
            <div className="p-6 flex flex-col gap-5">
              <div>
                <h2 className="text-lg font-bold text-foreground">{unlockedVault.name}</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Encrypted with {unlockedVault.encryption}
                </p>
              </div>

              {/* Message */}
              {unlockedVault.message && (
                <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                  <h3 className="text-xs font-semibold text-primary mb-2">Secure Message</h3>
                  <p
                    className={cn(
                      "text-sm text-foreground transition-all",
                      !revealed && "blur-sm select-none"
                    )}
                  >
                    {unlockedVault.message}
                  </p>
                </div>
              )}

              {/* Files */}
              {unlockedVault.uploadedFiles.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-foreground">Encrypted Files</h3>
                    <button
                      onClick={() => setRevealed((r) => !r)}
                      className="text-xs text-primary hover:underline"
                    >
                      {revealed ? "Hide contents" : "Reveal contents"}
                    </button>
                  </div>
                  <div className="rounded border border-border divide-y divide-border overflow-hidden">
                    {unlockedVault.uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 px-4 py-3 bg-background hover:bg-secondary/30 transition-colors"
                      >
                        <File className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span
                          className={cn(
                            "text-sm font-mono flex-1 truncate transition-all",
                            !revealed && "blur-sm select-none"
                          )}
                        >
                          {file.name}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono shrink-0">
                          {formatFileSize(file.size)}
                        </span>
                        <Button variant="outline" size="sm" className="shrink-0" disabled={!revealed}>
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {unlockedVault.uploadedFiles.length === 0 && !unlockedVault.message && (
                <div className="rounded border border-dashed border-border p-6 text-center">
                  <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">This vault has no contents yet.</p>
                </div>
              )}

              <div className="rounded bg-secondary/50 px-4 py-3 flex items-start gap-3">
                <Shield className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground">
                  This vault was shared with you by the owner. Contents are end-to-end encrypted and
                  only accessible to authorized recipients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-border bg-card shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-secondary/50 px-6 py-5 border-b border-border text-center">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-lg font-bold text-foreground">Encrypted Vault Access</h1>
            <p className="text-xs text-muted-foreground mt-1">
              Enter your credentials to decrypt
            </p>
          </div>

          {/* Form */}
          <div className="p-6 flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                Authorized Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Must match the email authorized by the vault owner.
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-muted-foreground" />
                Decryption Passcode
              </label>
              <Input
                type="text"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value.toUpperCase())}
                placeholder="VAULT-XXXXXX"
                className="font-mono tracking-wider text-center text-lg"
                maxLength={12}
              />
              <p className="text-xs text-muted-foreground mt-1">
                The passcode was provided separately by the sender.
              </p>
            </div>

            {error && (
              <div className="rounded bg-destructive/10 border border-destructive/30 px-4 py-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                <p className="text-xs text-destructive">{error}</p>
              </div>
            )}

            <Button
              onClick={handleUnlock}
              disabled={!email || !passcode || loading}
              className="w-full mt-2"
            >
              {loading ? (
                <>
                  <span className="animate-pulse">Decrypting...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Unlock Vault
                </>
              )}
            </Button>

            <div className="rounded bg-secondary/50 px-4 py-3 mt-2">
              <p className="text-xs text-muted-foreground text-center">
                Protected by AES-256-GCM encryption. Your access attempt will be logged and
                reported to the vault owner.
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Dead Man&apos;s Vault — Secure Digital Legacy
        </p>
      </div>
    </div>
  )
}
