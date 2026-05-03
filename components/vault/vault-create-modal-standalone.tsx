"use client"

import { useState, useRef } from "react"
import { Lock, FileText, MessageSquare, ChevronRight, Upload, X, CheckCircle, Loader2, File, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useDemoStore, type VaultType, type VaultFile } from "@/lib/demo-store"

const vaultTypes: { id: VaultType; icon: typeof Lock; label: string; desc: string }[] = [
  { id: "document", icon: FileText, label: "Document", desc: "PDFs, contracts, wills, legal docs" },
  { id: "secret", icon: Lock, label: "Secrets", desc: "Passwords, keys, seeds, credentials" },
  { id: "message", icon: MessageSquare, label: "Message", desc: "Personal letters, video, voice" },
]

const triggerOptions = [
  "Inactivity > 30d",
  "Inactivity > 60d",
  "Inactivity > 90d",
  "Death Confirmed",
  "Inactivity > 30d + Confirmation",
  "Arrest / Missing",
]

const encryptionByType: Record<VaultType, string> = {
  document: "AES-256-GCM",
  secret: "AES-256-GCM + Shamir SSS",
  message: "AES-256-GCM",
}

function formatFileSize(bytes: number): string {
  if (bytes > 1048576) return `${(bytes / 1048576).toFixed(1)} MB`
  if (bytes > 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${bytes} B`
}

export function VaultCreateModal({ onClose }: { onClose: () => void }) {
  const { createVault } = useDemoStore()
  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState<VaultType | null>(null)
  const [name, setName] = useState("")
  const [trigger, setTrigger] = useState(triggerOptions[0])
  const [message, setMessage] = useState("")
  const [files, setFiles] = useState<VaultFile[]>([])
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCreate = () => {
    if (!selectedType || !name) return
    setSaving(true)
    setTimeout(() => {
      createVault(name, selectedType, trigger, message || undefined, files.length > 0 ? files : undefined)
      setSaving(false)
      setDone(true)
      setTimeout(() => onClose(), 1200)
    }, 1400)
  }

  const handleFileSelect = (fileList: FileList | null) => {
    if (!fileList) return
    const newFiles: VaultFile[] = Array.from(fileList).map((f) => ({
      id: `f${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name: f.name,
      size: f.size,
      type: f.type || "application/octet-stream",
    }))
    setFiles((prev) => [...prev, ...newFiles])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const canAdvanceStep1 = name.trim().length > 0 && selectedType !== null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-lg shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-sm font-bold text-foreground">Create New Vault</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Step {step} of 3</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step indicators */}
        <div className="px-6 py-3 border-b border-border flex gap-2 shrink-0">
          {["Type", "Content", "Security"].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={cn(
                  "w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold transition-colors",
                  step > i + 1
                    ? "bg-vault-active text-background"
                    : step === i + 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span className={cn("text-xs", step === i + 1 ? "text-foreground font-semibold" : "text-muted-foreground")}>
                {label}
              </span>
              {i < 2 && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">Vault Name</label>
                <Input
                  placeholder="e.g., Will & Testament"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground block mb-2">Vault Type</label>
                <div className="flex flex-col gap-2">
                  {vaultTypes.map(({ id, icon: Icon, label, desc }) => (
                    <button
                      key={id}
                      onClick={() => setSelectedType(id)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-colors",
                        selectedType === id
                          ? "border-primary bg-primary/10"
                          : "border-border bg-secondary hover:border-muted-foreground"
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded flex items-center justify-center shrink-0",
                          selectedType === id ? "bg-primary/20" : "bg-card"
                        )}
                      >
                        <Icon className={cn("w-4 h-4", selectedType === id ? "text-primary" : "text-muted-foreground")} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">{label}</div>
                        <div className="text-xs text-muted-foreground">{desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-2">Release Trigger</label>
                <div className="flex flex-col gap-1.5">
                  {triggerOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setTrigger(opt)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded border text-left text-xs font-mono transition-colors",
                        trigger === opt
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-secondary text-muted-foreground hover:border-muted-foreground"
                      )}
                    >
                      <span
                        className={cn(
                          "w-3 h-3 rounded-full border-2 shrink-0 transition-colors",
                          trigger === opt ? "border-primary bg-primary" : "border-muted-foreground"
                        )}
                      />
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Secure Message <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <textarea
                  className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a message to be decrypted upon release..."
                />
              </div>
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-5 text-center transition-colors cursor-pointer",
                  dragOver ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                )}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
                <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-foreground font-medium">Drop files to encrypt</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Encrypted in-browser before upload. Max 500MB.
                </p>
                <Button variant="outline" size="sm" className="mt-3" onClick={(e) => e.stopPropagation()}>
                  Browse Files
                </Button>
              </div>

              {files.length > 0 && (
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="px-3 py-2 bg-secondary/50 border-b border-border">
                    <span className="text-xs font-semibold text-foreground">
                      Staged Files ({files.length})
                    </span>
                  </div>
                  <div className="divide-y divide-border max-h-40 overflow-y-auto">
                    {files.map((f) => (
                      <div key={f.id} className="flex items-center gap-3 px-3 py-2 group hover:bg-secondary/30">
                        <File className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-foreground truncate">{f.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(f.size)}</p>
                        </div>
                        <button
                          onClick={() => removeFile(f.id)}
                          className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              {[
                { label: "Vault Name", value: name },
                { label: "Type", value: selectedType ?? "—" },
                { label: "Trigger", value: trigger },
                { label: "Files", value: files.length > 0 ? `${files.length} file(s)` : "None" },
                { label: "Encryption Algorithm", value: selectedType ? encryptionByType[selectedType] : "—" },
                { label: "Key Derivation", value: "PBKDF2 / scrypt (600k iterations)" },
                { label: "Key Splitting", value: "Shamir SSS (2-of-3 threshold)" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="text-xs text-foreground font-mono">{value}</span>
                </div>
              ))}
              <div className="rounded-lg bg-vault-active/10 border border-vault-active/30 p-3">
                <p className="text-xs text-vault-active font-semibold">Zero-Knowledge Confirmed</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  The server processes only ciphertext. Your encryption key never leaves this device.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between px-6 py-4 border-t border-border shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
            disabled={saving || done}
          >
            {step === 1 ? "Cancel" : "Back"}
          </Button>
          <Button
            size="sm"
            onClick={() => (step < 3 ? setStep(step + 1) : handleCreate())}
            disabled={(step === 1 && !canAdvanceStep1) || saving || done}
          >
            {done ? (
              <>
                <CheckCircle className="w-4 h-4 mr-1" />
                Vault Created
              </>
            ) : saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                Encrypting...
              </>
            ) : step === 3 ? (
              "Create Vault"
            ) : (
              <>
                Continue
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
