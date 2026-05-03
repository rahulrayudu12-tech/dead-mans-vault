"use client"

import { useState, useRef } from "react"
import { UserPlus, Send, CheckCircle, ChevronDown, Smartphone, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDemoStore } from "@/lib/demo-store"

const roles = ["Primary Executor", "Key Holder", "Witness", "Attorney", "Backup Executor"]

export function ContactInvite() {
  const { contacts, addContact } = useDemoStore()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [role, setRole] = useState(roles[0])
  const [sent, setSent] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSend = () => {
    if (!name.trim() || !email.trim()) return
    addContact(name.trim(), email.trim(), role, phone.trim() || undefined, photoPreview || undefined)
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setName("")
      setEmail("")
      setPhone("")
      setPhotoPreview(null)
    }, 2500)
  }

  const canSend = name.trim().length > 0 && email.trim().length > 0 && !sent

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Invite Contact</h2>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Full Name</label>
            <Input
              placeholder="Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Email Address</label>
            <Input
              type="email"
              placeholder="jane@proton.me"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              <span className="flex items-center gap-1">
                <Smartphone className="w-3 h-3" />
                Phone Number <span className="text-muted-foreground font-normal">(optional)</span>
              </span>
            </label>
            <Input
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              <span className="flex items-center gap-1">
                <Camera className="w-3 h-3" />
                Identity Photo <span className="text-muted-foreground font-normal">(optional)</span>
              </span>
            </label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              className="hidden"
            />
            <div className="flex items-center gap-3">
              {photoPreview ? (
                <div 
                  className="w-12 h-12 rounded-full bg-cover bg-center border-2 border-primary"
                  style={{ backgroundImage: `url(${photoPreview})` }}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center">
                  <Camera className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs"
              >
                {photoPreview ? "Change Photo" : "Upload Photo"}
              </Button>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Role</label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-ring pr-8"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <Button onClick={handleSend} disabled={!canSend} className="w-full mt-1">
            {sent ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Invitation Sent!
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Invitation
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="text-xs font-semibold text-foreground mb-3">Contact Limits</h3>
        <div className="flex flex-col gap-2">
          {[
            { label: "Max contacts", value: "10" },
            { label: "Current count", value: `${contacts.length} / 10` },
            { label: "Required for trigger", value: "2-of-3" },
            { label: "Key holders", value: `${contacts.filter((c) => c.shards > 0).length} / 3` },
            { label: "Invite expiry", value: "7 days" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between">
              <span className="text-xs text-muted-foreground">{label}</span>
              <span className="text-xs font-mono text-foreground">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
