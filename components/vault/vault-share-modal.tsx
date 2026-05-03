"use client"

import { useState } from "react"
import { X, Mail, Clock, Shield, Copy, Check, Link2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDemoStore, type Vault, type ShareLink } from "@/lib/demo-store"
import { cn } from "@/lib/utils"

interface VaultShareModalProps {
  vault: Vault
  onClose: () => void
}

export function VaultShareModal({ vault, onClose }: VaultShareModalProps) {
  const { shareVault, revokeShareLink } = useDemoStore()
  const [emails, setEmails] = useState("")
  const [expiresInDays, setExpiresInDays] = useState<number | null>(30)
  const [newLink, setNewLink] = useState<ShareLink | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [confirmRevoke, setConfirmRevoke] = useState<string | null>(null)

  const handleCreateLink = () => {
    const emailList = emails
      .split(/[,;\n]+/)
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.includes("@"))

    if (emailList.length === 0) return

    const link = shareVault(vault.id, emailList, expiresInDays)
    setNewLink(link)
    setEmails("")
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleRevoke = (linkId: string) => {
    if (confirmRevoke === linkId) {
      revokeShareLink(vault.id, linkId)
      setConfirmRevoke(null)
    } else {
      setConfirmRevoke(linkId)
      setTimeout(() => setConfirmRevoke(null), 3000)
    }
  }

  const getShareUrl = (link: ShareLink) => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/share/${vault.id}/${link.id}`
    }
    return `/share/${vault.id}/${link.id}`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
              <Link2 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Share Vault</h2>
              <p className="text-xs text-muted-foreground">{vault.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-5">
          {/* Create new share link */}
          <div className="rounded-lg border border-border p-4 bg-secondary/30">
            <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-primary" />
              Create Encrypted Share Link
            </h3>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">
                  Authorized Email Addresses
                </label>
                <textarea
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                  placeholder="recipient@example.com&#10;another@example.com"
                  className="w-full h-20 px-3 py-2 text-sm bg-background border border-border rounded resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Only these emails can access the vault. Separate with commas or newlines.
                </p>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Link Expiration
                </label>
                <div className="flex gap-2">
                  {[7, 30, 90, null].map((days) => (
                    <button
                      key={days ?? "never"}
                      onClick={() => setExpiresInDays(days)}
                      className={cn(
                        "px-3 py-1.5 text-xs rounded font-mono transition-colors",
                        expiresInDays === days
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {days ? `${days}d` : "Never"}
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={handleCreateLink} className="w-full mt-2" disabled={!emails.trim()}>
                <Mail className="w-4 h-4 mr-2" />
                Generate Secure Link
              </Button>
            </div>
          </div>

          {/* Newly created link */}
          {newLink && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 animate-in fade-in slide-in-from-top-2">
              <h3 className="text-xs font-semibold text-primary mb-3">Share Link Created</h3>
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Share URL</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs font-mono bg-background px-3 py-2 rounded border border-border truncate">
                      {getShareUrl(newLink)}
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      onClick={() => handleCopy(getShareUrl(newLink), `url-${newLink.id}`)}
                    >
                      {copied === `url-${newLink.id}` ? (
                        <Check className="w-4 h-4 text-vault-active" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Passcode (Required to Decrypt)</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm font-mono font-bold bg-background px-3 py-2 rounded border border-border text-primary tracking-wider">
                      {newLink.passcode}
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      onClick={() => handleCopy(newLink.passcode, `pass-${newLink.id}`)}
                    >
                      {copied === `pass-${newLink.id}` ? (
                        <Check className="w-4 h-4 text-vault-active" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Send the passcode separately for security. Never include it in the same message as the link.
                </p>
              </div>
            </div>
          )}

          {/* Existing share links */}
          {vault.shareLinks.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-foreground mb-3">Active Share Links</h3>
              <div className="rounded border border-border divide-y divide-border overflow-hidden">
                {vault.shareLinks.map((link) => {
                  const isExpired = link.expiresAt && new Date() > link.expiresAt
                  const isRevoking = confirmRevoke === link.id

                  return (
                    <div
                      key={link.id}
                      className={cn("px-4 py-3 bg-background", isExpired && "opacity-50")}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <code className="text-xs font-mono font-semibold text-primary">
                              {link.passcode}
                            </code>
                            {isExpired && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-destructive/20 text-destructive font-mono">
                                EXPIRED
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {link.authorizedEmails.join(", ")}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {link.accessCount} access{link.accessCount !== 1 ? "es" : ""} ·{" "}
                            {link.expiresAt
                              ? `Expires ${link.expiresAt.toLocaleDateString()}`
                              : "Never expires"}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-7 h-7"
                            onClick={() => handleCopy(getShareUrl(link), `url-${link.id}`)}
                          >
                            {copied === `url-${link.id}` ? (
                              <Check className="w-3.5 h-3.5 text-vault-active" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "w-7 h-7",
                              isRevoking && "bg-destructive/20 text-destructive"
                            )}
                            onClick={() => handleRevoke(link.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border shrink-0">
          <Button variant="outline" size="sm" onClick={onClose} className="w-full">
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}
