"use client"

import { useState } from "react"
import { UserCheck, Mail, Trash2, RefreshCw, Shield, Clock, CheckCircle, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useDemoStore } from "@/lib/demo-store"

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function ContactList() {
  const { contacts, removeContact, verifyContact } = useDemoStore()
  const [selected, setSelected] = useState<string | null>(null)
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null)

  const handleRemove = (id: string) => {
    if (confirmRemove === id) {
      removeContact(id)
      setConfirmRemove(null)
      setSelected(null)
    } else {
      setConfirmRemove(id)
      setTimeout(() => setConfirmRemove(null), 3000)
    }
  }

  const verified = contacts.filter((c) => c.verified).length
  const pending = contacts.filter((c) => !c.verified).length

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">
          Contacts{" "}
          <span className="text-muted-foreground font-mono">({contacts.length})</span>
        </h2>
        <span className="text-xs text-muted-foreground">
          {verified} verified · {pending} pending
        </span>
      </div>

      {contacts.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <UserCheck className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No contacts added yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {contacts.map((contact) => {
            const initials = contact.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
            const isRemoving = confirmRemove === contact.id

            return (
              <div
                key={contact.id}
                onClick={() => setSelected(selected === contact.id ? null : contact.id)}
                className={cn(
                  "px-6 py-4 cursor-pointer transition-colors",
                  selected === contact.id ? "bg-secondary/50" : "hover:bg-secondary/20"
                )}
              >
                <div className="flex items-center gap-4">
                  {contact.photoUrl ? (
                    <div 
                      className="w-10 h-10 rounded-full bg-cover bg-center shrink-0 border-2 border-primary"
                      style={{ backgroundImage: `url(${contact.photoUrl})` }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0 font-bold text-sm text-foreground">
                      {initials}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-foreground">{contact.name}</span>
                      <span
                        className={cn(
                          "text-xs font-mono px-1.5 py-0.5 rounded",
                          contact.verified
                            ? "bg-vault-active/20 text-vault-active"
                            : "bg-vault-pending/20 text-vault-pending"
                        )}
                      >
                        {contact.verified ? "VERIFIED" : "PENDING"}
                      </span>
                      {contact.shards > 0 && (
                        <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                          KEY
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {contact.email}
                      </span>
                      {contact.phone && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Smartphone className="w-3 h-3" />
                          {contact.phone}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">{contact.role}</span>
                    </div>
                  </div>

                  <div className="hidden md:flex flex-col items-end shrink-0 gap-0.5">
                    <span className="text-xs text-muted-foreground">
                      {contact.shards} shard{contact.shards !== 1 ? "s" : ""}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {timeAgo(contact.addedAt)}
                    </span>
                  </div>
                </div>

                {selected === contact.id && (
                  <div
                    className="mt-4 flex items-center gap-2 flex-wrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {contact.shards > 0 && (
                      <div className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                        <Shield className="w-3 h-3" />
                        Holds {contact.shards} key shard
                      </div>
                    )}
                    {!contact.verified && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => verifyContact(contact.id)}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Mark Verified
                      </Button>
                    )}
                    {!contact.verified && (
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Resend Invite
                      </Button>
                    )}
                    {contact.verified && (
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        <UserCheck className="w-3 h-3 mr-1" />
                        View Access
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-7 text-xs transition-colors",
                        isRemoving
                          ? "bg-destructive/20 text-destructive hover:bg-destructive/30"
                          : "text-destructive hover:text-destructive hover:bg-destructive/10"
                      )}
                      onClick={() => handleRemove(contact.id)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      {isRemoving ? "Confirm Remove" : "Remove"}
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
