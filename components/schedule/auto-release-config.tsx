"use client"

import { useState } from "react"
import { 
  Send, 
  Mail, 
  Smartphone, 
  Clock, 
  UserCheck, 
  Trash2,
  Plus,
  AlertTriangle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useDemoStore, type AutoReleaseConfig } from "@/lib/demo-store"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

export function AutoReleaseConfigurator() {
  const { 
    vaults, 
    contacts, 
    autoReleaseConfigs, 
    setAutoReleaseConfig, 
    removeAutoReleaseConfig 
  } = useDemoStore()

  const [configModal, setConfigModal] = useState<string | null>(null)
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [delayHours, setDelayHours] = useState(24)
  const [notifyMethod, setNotifyMethod] = useState<"email" | "sms" | "both">("both")
  const [requireConfirmation, setRequireConfirmation] = useState(false)

  const activeVaults = vaults.filter((v) => v.status === "active" || v.status === "staged")
  const verifiedContacts = contacts.filter((c) => c.verified)

  const openConfig = (vaultId: string) => {
    const existing = autoReleaseConfigs.find((c) => c.vaultId === vaultId)
    if (existing) {
      setSelectedContacts(existing.recipientContactIds)
      setDelayHours(existing.delayAfterTriggerHours)
      setNotifyMethod(existing.notifyMethod)
      setRequireConfirmation(existing.requireConfirmation)
    } else {
      setSelectedContacts([])
      setDelayHours(24)
      setNotifyMethod("both")
      setRequireConfirmation(false)
    }
    setConfigModal(vaultId)
  }

  const handleSave = () => {
    if (!configModal || selectedContacts.length === 0) return
    setAutoReleaseConfig({
      vaultId: configModal,
      recipientContactIds: selectedContacts,
      delayAfterTriggerHours: delayHours,
      notifyMethod,
      requireConfirmation,
    })
    setConfigModal(null)
  }

  const toggleContact = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    )
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-card">
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Auto-Release Configuration</h2>
            <span className="text-xs text-muted-foreground font-mono">
              {autoReleaseConfigs.length} vault(s) configured
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Configure which vaults automatically share with designated contacts when the dead man&apos;s switch triggers.
          </p>
        </div>

        <div className="divide-y divide-border">
          {activeVaults.map((vault) => {
            const config = autoReleaseConfigs.find((c) => c.vaultId === vault.id)
            const recipients = config
              ? config.recipientContactIds
                  .map((id) => contacts.find((c) => c.id === id))
                  .filter(Boolean)
              : []

            return (
              <div key={vault.id} className="px-6 py-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center shrink-0">
                  <Send className="w-4 h-4 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">{vault.name}</span>
                    <span className={cn(
                      "text-xs font-mono px-1.5 py-0.5 rounded",
                      config ? "bg-vault-active/20 text-vault-active" : "bg-secondary text-muted-foreground"
                    )}>
                      {config ? "CONFIGURED" : "NOT SET"}
                    </span>
                  </div>

                  {config ? (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                        <UserCheck className="w-3 h-3" />
                        <span>Recipients: {recipients.map((r) => r?.name).join(", ")}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Delay: {config.delayAfterTriggerHours}h
                        </span>
                        <span className="flex items-center gap-1">
                          {config.notifyMethod === "email" && <Mail className="w-3 h-3" />}
                          {config.notifyMethod === "sms" && <Smartphone className="w-3 h-3" />}
                          {config.notifyMethod === "both" && (
                            <>
                              <Mail className="w-3 h-3" />
                              <Smartphone className="w-3 h-3" />
                            </>
                          )}
                          {config.notifyMethod.charAt(0).toUpperCase() + config.notifyMethod.slice(1)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">
                      No auto-release configured. Vault will not be shared automatically.
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {config && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-destructive hover:text-destructive"
                      onClick={() => removeAutoReleaseConfig(vault.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => openConfig(vault.id)}
                  >
                    {config ? "Edit" : <><Plus className="w-3 h-3 mr-1" /> Configure</>}
                  </Button>
                </div>
              </div>
            )
          })}

          {activeVaults.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Send className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No active vaults to configure.</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border bg-destructive/5">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              <strong className="text-destructive">Warning:</strong> When triggered, share links and passcodes will be sent via the configured channels. 
              Ensure contact phone numbers are verified for SMS delivery.
            </p>
          </div>
        </div>
      </div>

      <Dialog open={!!configModal} onOpenChange={() => setConfigModal(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Configure Auto-Release</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            {/* Recipients */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Select Recipients</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Only verified contacts can receive auto-released vaults.
              </p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {verifiedContacts.map((contact) => (
                  <label
                    key={contact.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded border cursor-pointer transition-colors",
                      selectedContacts.includes(contact.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-secondary/50"
                    )}
                  >
                    <Checkbox
                      checked={selectedContacts.includes(contact.id)}
                      onCheckedChange={() => toggleContact(contact.id)}
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-foreground">{contact.name}</span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <Mail className="w-3 h-3" />
                        {contact.email}
                        {contact.phone && (
                          <>
                            <Smartphone className="w-3 h-3 ml-2" />
                            {contact.phone}
                          </>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
                {verifiedContacts.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No verified contacts available.
                  </p>
                )}
              </div>
            </div>

            {/* Delay */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Delay After Trigger</h4>
              <div className="flex items-center gap-2">
                {[0, 6, 12, 24, 48, 72].map((h) => (
                  <button
                    key={h}
                    onClick={() => setDelayHours(h)}
                    className={cn(
                      "text-xs font-mono px-3 py-1.5 rounded transition-colors",
                      delayHours === h
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {h === 0 ? "Immediate" : `${h}h`}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification Method */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Notification Method</h4>
              <div className="flex items-center gap-2">
                {(["email", "sms", "both"] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => setNotifyMethod(method)}
                    className={cn(
                      "flex items-center gap-1 text-xs font-mono px-3 py-1.5 rounded transition-colors",
                      notifyMethod === method
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {method === "email" && <Mail className="w-3 h-3" />}
                    {method === "sms" && <Smartphone className="w-3 h-3" />}
                    {method === "both" && (
                      <>
                        <Mail className="w-3 h-3" />
                        <Smartphone className="w-3 h-3" />
                      </>
                    )}
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setConfigModal(null)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={selectedContacts.length === 0}>
                Save Configuration
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
