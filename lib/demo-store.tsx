"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"

export type VaultStatus = "active" | "staged" | "locked" | "triggered"
export type VaultType = "document" | "secret" | "message"

export interface VaultFile {
  id: string
  name: string
  size: number
  type: string
}

export interface ShareLink {
  id: string
  passcode: string
  authorizedEmails: string[]
  createdAt: Date
  expiresAt: Date | null
  accessCount: number
}

export interface Vault {
  id: string
  name: string
  type: VaultType
  status: VaultStatus
  recipients: number
  files: number
  trigger: string
  lastModified: string
  encryption: string
  size: string
  createdAt: Date
  message?: string
  uploadedFiles: VaultFile[]
  shareLinks: ShareLink[]
}

export interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  photoUrl?: string
  role: string
  verified: boolean
  shards: number
  addedAt: Date
  notifyVia: ("email" | "sms" | "both")[]
}

export interface LogEntry {
  id: string
  action: string
  detail: string
  time: Date
  severity: "info" | "warn" | "alert" | "ok"
}

export type IntegrationType = "notion" | "google" | "github" | "slack" | "calendar"

export interface ExternalIntegration {
  id: string
  type: IntegrationType
  name: string
  connected: boolean
  lastActivity?: Date
  accountEmail?: string
  checkForActivity: boolean
}

export interface AutoReleaseConfig {
  vaultId: string
  recipientContactIds: string[]
  delayAfterTriggerHours: number
  requireConfirmation: boolean
  notifyMethod: "email" | "sms" | "both"
}

interface DemoState {
  // Switch
  lastCheckIn: Date
  switchPeriodDays: number
  checkInCount: number

  // Vaults
  vaults: Vault[]

  // Contacts
  contacts: Contact[]

  // Logs
  logs: LogEntry[]

  // External integrations for activity verification
  integrations: ExternalIntegration[]

  // Auto-release configurations
  autoReleaseConfigs: AutoReleaseConfig[]

  // User profile photo
  userPhotoUrl?: string
}

interface DemoStore extends DemoState {
  checkIn: () => void
  createVault: (name: string, type: VaultType, trigger: string, message?: string, files?: VaultFile[]) => void
  deleteVault: (id: string) => void
  updateVaultStatus: (id: string, status: VaultStatus) => void
  addContact: (name: string, email: string, role: string, phone?: string, photoUrl?: string) => void
  removeContact: (id: string) => void
  shareVault: (vaultId: string, authorizedEmails: string[], expiresInDays: number | null) => ShareLink
  revokeShareLink: (vaultId: string, linkId: string) => void
  validateShareAccess: (vaultId: string, linkId: string, passcode: string, email: string) => { success: boolean; vault?: Vault }
  verifyContact: (id: string) => void
  updateContactPhone: (id: string, phone: string) => void
  updateContactPhoto: (id: string, photoUrl: string) => void
  updateContactNotifyVia: (id: string, notifyVia: ("email" | "sms" | "both")[]) => void
  connectIntegration: (type: IntegrationType, accountEmail: string) => void
  disconnectIntegration: (id: string) => void
  toggleIntegrationActivityCheck: (id: string) => void
  setAutoReleaseConfig: (config: AutoReleaseConfig) => void
  removeAutoReleaseConfig: (vaultId: string) => void
  setUserPhoto: (photoUrl: string) => void
  simulateTrigger: () => void
  addLog: (entry: Omit<LogEntry, "id" | "time">) => void
}

const defaultContacts: Contact[] = [
  {
    id: "c1",
    name: "Sarah Mitchell",
    email: "s.mitchell@proton.me",
    phone: "+1 (555) 234-5678",
    role: "Primary Executor",
    verified: true,
    shards: 1,
    addedAt: new Date(Date.now() - 5 * 86400000),
    notifyVia: ["email", "sms"],
  },
  {
    id: "c2",
    name: "James Doe",
    email: "j.doe@tutanota.com",
    phone: "+1 (555) 876-5432",
    role: "Secondary Executor",
    verified: true,
    shards: 1,
    addedAt: new Date(Date.now() - 10 * 86400000),
    notifyVia: ["email"],
  },
  {
    id: "c3",
    name: "Alex Rivera",
    email: "a.rivera@pm.me",
    role: "Witness",
    verified: false,
    shards: 0,
    addedAt: new Date(Date.now() - 2 * 86400000),
    notifyVia: ["email"],
  },
]

const defaultIntegrations: ExternalIntegration[] = [
  {
    id: "int1",
    type: "notion",
    name: "Notion",
    connected: true,
    lastActivity: new Date(Date.now() - 4 * 3600000),
    accountEmail: "user@example.com",
    checkForActivity: true,
  },
  {
    id: "int2",
    type: "google",
    name: "Google",
    connected: true,
    lastActivity: new Date(Date.now() - 1 * 3600000),
    accountEmail: "user@gmail.com",
    checkForActivity: true,
  },
  {
    id: "int3",
    type: "github",
    name: "GitHub",
    connected: false,
    checkForActivity: false,
  },
  {
    id: "int4",
    type: "slack",
    name: "Slack",
    connected: false,
    checkForActivity: false,
  },
  {
    id: "int5",
    type: "calendar",
    name: "Calendar",
    connected: true,
    lastActivity: new Date(Date.now() - 2 * 3600000),
    accountEmail: "user@gmail.com",
    checkForActivity: true,
  },
]

const defaultAutoReleaseConfigs: AutoReleaseConfig[] = [
  {
    vaultId: "v1",
    recipientContactIds: ["c1", "c2"],
    delayAfterTriggerHours: 24,
    requireConfirmation: false,
    notifyMethod: "both",
  },
]

const defaultVaults: Vault[] = [
  {
    id: "v1",
    name: "Will & Testament",
    type: "document",
    status: "active",
    recipients: 2,
    files: 3,
    trigger: "Inactivity > 30d",
    lastModified: "2d ago",
    encryption: "AES-256-GCM",
    size: "842 KB",
    createdAt: new Date(Date.now() - 2 * 86400000),
    message: "To my family: everything you need is in this vault.",
    uploadedFiles: [
      { id: "f1", name: "last_will.pdf", size: 524288, type: "application/pdf" },
      { id: "f2", name: "property_deed.pdf", size: 262144, type: "application/pdf" },
      { id: "f3", name: "insurance_policy.pdf", size: 56320, type: "application/pdf" },
    ],
    shareLinks: [
      {
        id: "sl1",
        passcode: "VAULT-X7K9",
        authorizedEmails: ["s.mitchell@proton.me", "j.doe@tutanota.com"],
        createdAt: new Date(Date.now() - 1 * 86400000),
        expiresAt: new Date(Date.now() + 29 * 86400000),
        accessCount: 0,
      },
    ],
  },
  {
    id: "v2",
    name: "Financial Accounts & Passwords",
    type: "secret",
    status: "active",
    recipients: 1,
    files: 1,
    trigger: "Inactivity > 30d + Confirmation",
    lastModified: "5d ago",
    encryption: "AES-256-GCM + RSA-4096",
    size: "14 KB",
    createdAt: new Date(Date.now() - 5 * 86400000),
    message: "Bank accounts, crypto wallets, and all passwords are enclosed.",
    uploadedFiles: [
      { id: "f4", name: "passwords.kdbx", size: 14336, type: "application/octet-stream" },
    ],
    shareLinks: [],
  },
  {
    id: "v3",
    name: "Personal Letters",
    type: "message",
    status: "staged",
    recipients: 3,
    files: 5,
    trigger: "Inactivity > 60d",
    lastModified: "12d ago",
    encryption: "AES-256-GCM",
    size: "2.1 MB",
    createdAt: new Date(Date.now() - 12 * 86400000),
    message: "Letters to each of you. Read them when you're ready.",
    uploadedFiles: [
      { id: "f5", name: "letter_to_mom.txt", size: 4096, type: "text/plain" },
      { id: "f6", name: "letter_to_dad.txt", size: 3584, type: "text/plain" },
      { id: "f7", name: "letter_to_sarah.txt", size: 5120, type: "text/plain" },
      { id: "f8", name: "family_video.mp4", size: 2097152, type: "video/mp4" },
      { id: "f9", name: "voice_message.mp3", size: 102400, type: "audio/mpeg" },
    ],
    shareLinks: [],
  },
  {
    id: "v4",
    name: "Business Continuity Plan",
    type: "document",
    status: "locked",
    recipients: 4,
    files: 12,
    trigger: "Arrest / Missing",
    lastModified: "23d ago",
    encryption: "AES-256-GCM",
    size: "18.4 MB",
    createdAt: new Date(Date.now() - 23 * 86400000),
    uploadedFiles: [],
    shareLinks: [],
  },
  {
    id: "v5",
    name: "Crypto Wallet Keys",
    type: "secret",
    status: "active",
    recipients: 1,
    files: 2,
    trigger: "Death Confirmed",
    lastModified: "30d ago",
    encryption: "AES-256-GCM + Shamir SSS",
    size: "2 KB",
    createdAt: new Date(Date.now() - 30 * 86400000),
    message: "BTC and ETH seed phrases. Guard them carefully.",
    uploadedFiles: [
      { id: "f10", name: "btc_seed.txt", size: 512, type: "text/plain" },
      { id: "f11", name: "eth_seed.txt", size: 512, type: "text/plain" },
    ],
    shareLinks: [],
  },
]

const defaultLogs: LogEntry[] = [
  {
    id: "l1",
    action: "Check-in confirmed",
    detail: "Manual check-in via web app. Switch reset to 30 days.",
    time: new Date(Date.now() - 2 * 3600000),
    severity: "ok",
  },
  {
    id: "l2",
    action: "Vault created — Will & Testament",
    detail: "Encrypted with AES-256-GCM. 3 recipients assigned.",
    time: new Date(Date.now() - 86400000),
    severity: "info",
  },
  {
    id: "l3",
    action: "Warning email dispatched",
    detail: "72h inactivity warning sent to j.doe@proton.me",
    time: new Date(Date.now() - 3 * 86400000),
    severity: "warn",
  },
  {
    id: "l4",
    action: "Emergency contact verified",
    detail: "Sarah Mitchell confirmed contact link via email. 2FA enabled.",
    time: new Date(Date.now() - 5 * 86400000),
    severity: "ok",
  },
  {
    id: "l5",
    action: "Failed login attempt blocked",
    detail: "Unrecognized device login blocked. IP: 185.220.101.47",
    time: new Date(Date.now() - 8 * 86400000),
    severity: "alert",
  },
]

const DemoContext = createContext<DemoStore | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
const [state, setState] = useState<DemoState>({
  lastCheckIn: new Date(Date.now() - 2 * 3600000),
  switchPeriodDays: 30,
  checkInCount: 47,
  vaults: defaultVaults,
  contacts: defaultContacts,
  logs: defaultLogs,
  integrations: defaultIntegrations,
  autoReleaseConfigs: defaultAutoReleaseConfigs,
  userPhotoUrl: undefined,
  })

  const addLog = useCallback((entry: Omit<LogEntry, "id" | "time">) => {
    setState((s) => ({
      ...s,
      logs: [
        { ...entry, id: `l${Date.now()}`, time: new Date() },
        ...s.logs,
      ],
    }))
  }, [])

  const checkIn = useCallback(() => {
    setState((s) => ({
      ...s,
      lastCheckIn: new Date(),
      checkInCount: s.checkInCount + 1,
    }))
    addLog({ action: "Check-in confirmed", detail: "Manual check-in via web app. Switch reset to 30 days.", severity: "ok" })
  }, [addLog])

  const createVault = useCallback(
  (name: string, type: VaultType, trigger: string, message?: string, files?: VaultFile[]) => {
  const uploadedFiles = files ?? []
  const totalSize = uploadedFiles.reduce((sum, f) => sum + f.size, 0)
  const sizeStr = totalSize > 1048576 
    ? `${(totalSize / 1048576).toFixed(1)} MB`
    : totalSize > 1024
    ? `${(totalSize / 1024).toFixed(0)} KB`
    : totalSize > 0
    ? `${totalSize} B`
    : "—"
  const newVault: Vault = {
  id: `v${Date.now()}`,
  name,
  type,
  status: "active",
  recipients: 0,
  files: uploadedFiles.length,
  trigger,
  lastModified: "just now",
  encryption: type === "secret" ? "AES-256-GCM + Shamir SSS" : "AES-256-GCM",
  size: sizeStr,
  createdAt: new Date(),
  message,
  uploadedFiles,
  shareLinks: [],
  }
  setState((s) => ({ ...s, vaults: [newVault, ...s.vaults] }))
      addLog({ action: `Vault created — ${name}`, detail: `Type: ${type}. Trigger: ${trigger}. Encryption initialized.`, severity: "info" })
    },
    [addLog]
  )

  const deleteVault = useCallback(
    (id: string) => {
      setState((s) => {
        const vault = s.vaults.find((v) => v.id === id)
        return { ...s, vaults: s.vaults.filter((v) => v.id !== id) }
      })
      addLog({ action: "Vault deleted", detail: `Vault ID ${id} permanently destroyed. Keys zeroed.`, severity: "warn" })
    },
    [addLog]
  )

  const updateVaultStatus = useCallback(
    (id: string, status: VaultStatus) => {
      setState((s) => ({
        ...s,
        vaults: s.vaults.map((v) => (v.id === id ? { ...v, status, lastModified: "just now" } : v)),
      }))
      addLog({ action: `Vault status changed to ${status.toUpperCase()}`, detail: `Vault ID ${id} status updated.`, severity: "info" })
    },
    [addLog]
  )

const addContact = useCallback(
  (name: string, email: string, role: string, phone?: string, photoUrl?: string) => {
  const newContact: Contact = {
  id: `c${Date.now()}`,
        name,
        email,
        phone,
        photoUrl,
        role,
        verified: false,
        shards: 0,
        addedAt: new Date(),
        notifyVia: phone ? ["email", "sms"] : ["email"],
      }
      setState((s) => ({ ...s, contacts: [...s.contacts, newContact] }))
      addLog({ action: `Contact added — ${name}`, detail: `Invite sent to ${email}${phone ? ` and ${phone}` : ""}. Awaiting verification.`, severity: "info" })
    },
    [addLog]
  )

  const removeContact = useCallback(
    (id: string) => {
      setState((s) => ({ ...s, contacts: s.contacts.filter((c) => c.id !== id) }))
      addLog({ action: "Contact removed", detail: `Contact ID ${id} removed. Key shards revoked.`, severity: "warn" })
    },
    [addLog]
  )

  const verifyContact = useCallback(
    (id: string) => {
      setState((s) => ({
        ...s,
        contacts: s.contacts.map((c) => (c.id === id ? { ...c, verified: true, shards: 1 } : c)),
      }))
  addLog({ action: "Contact verified", detail: `Contact ID ${id} completed verification. Shard assigned.`, severity: "ok" })
  },
  [addLog]
  )

  const updateContactPhone = useCallback(
    (id: string, phone: string) => {
      setState((s) => ({
        ...s,
        contacts: s.contacts.map((c) => (c.id === id ? { ...c, phone } : c)),
      }))
      addLog({ action: "Contact phone updated", detail: `Phone number added for contact ${id}.`, severity: "info" })
    },
    [addLog]
  )

  const updateContactPhoto = useCallback(
    (id: string, photoUrl: string) => {
      setState((s) => ({
        ...s,
        contacts: s.contacts.map((c) => (c.id === id ? { ...c, photoUrl } : c)),
      }))
      addLog({ action: "Contact photo uploaded", detail: `Identity photo added for contact ${id}.`, severity: "info" })
    },
    [addLog]
  )

  const updateContactNotifyVia = useCallback(
    (id: string, notifyVia: ("email" | "sms" | "both")[]) => {
      setState((s) => ({
        ...s,
        contacts: s.contacts.map((c) => (c.id === id ? { ...c, notifyVia } : c)),
      }))
    },
    []
  )

  const connectIntegration = useCallback(
    (type: IntegrationType, accountEmail: string) => {
      setState((s) => ({
        ...s,
        integrations: s.integrations.map((i) =>
          i.type === type
            ? { ...i, connected: true, accountEmail, lastActivity: new Date(), checkForActivity: true }
            : i
        ),
      }))
      addLog({ action: `${type} connected`, detail: `Integration linked to ${accountEmail}. Activity monitoring enabled.`, severity: "ok" })
    },
    [addLog]
  )

  const disconnectIntegration = useCallback(
    (id: string) => {
      setState((s) => ({
        ...s,
        integrations: s.integrations.map((i) =>
          i.id === id ? { ...i, connected: false, accountEmail: undefined, checkForActivity: false } : i
        ),
      }))
      addLog({ action: "Integration disconnected", detail: `Integration ${id} unlinked. Activity check disabled.`, severity: "warn" })
    },
    [addLog]
  )

  const toggleIntegrationActivityCheck = useCallback(
    (id: string) => {
      setState((s) => ({
        ...s,
        integrations: s.integrations.map((i) =>
          i.id === id ? { ...i, checkForActivity: !i.checkForActivity } : i
        ),
      }))
    },
    []
  )

  const setAutoReleaseConfig = useCallback(
    (config: AutoReleaseConfig) => {
      setState((s) => {
        const existing = s.autoReleaseConfigs.find((c) => c.vaultId === config.vaultId)
        if (existing) {
          return {
            ...s,
            autoReleaseConfigs: s.autoReleaseConfigs.map((c) =>
              c.vaultId === config.vaultId ? config : c
            ),
          }
        }
        return { ...s, autoReleaseConfigs: [...s.autoReleaseConfigs, config] }
      })
      addLog({
        action: "Auto-release configured",
        detail: `Vault ${config.vaultId} will auto-share to ${config.recipientContactIds.length} contact(s) after trigger.`,
        severity: "info",
      })
    },
    [addLog]
  )

  const removeAutoReleaseConfig = useCallback(
    (vaultId: string) => {
      setState((s) => ({
        ...s,
        autoReleaseConfigs: s.autoReleaseConfigs.filter((c) => c.vaultId !== vaultId),
      }))
      addLog({ action: "Auto-release removed", detail: `Auto-release disabled for vault ${vaultId}.`, severity: "warn" })
    },
    [addLog]
  )

  const setUserPhoto = useCallback(
    (photoUrl: string) => {
      setState((s) => ({ ...s, userPhotoUrl: photoUrl }))
      addLog({ action: "Profile photo updated", detail: "Identity photo uploaded for verification purposes.", severity: "info" })
    },
    [addLog]
  )

  const simulateTrigger = useCallback(() => {
    // Simulate triggering all active vaults with auto-release
    state.autoReleaseConfigs.forEach((config) => {
      const vault = state.vaults.find((v) => v.id === config.vaultId)
      if (!vault || vault.status !== "active") return

      const recipients = config.recipientContactIds
        .map((cid) => state.contacts.find((c) => c.id === cid))
        .filter(Boolean)

      recipients.forEach((contact) => {
        if (!contact) return
        const methods: string[] = []
        if (config.notifyMethod === "email" || config.notifyMethod === "both") {
          methods.push(`email to ${contact.email}`)
        }
        if ((config.notifyMethod === "sms" || config.notifyMethod === "both") && contact.phone) {
          methods.push(`SMS to ${contact.phone}`)
        }
        addLog({
          action: "AUTO-RELEASE TRIGGERED",
          detail: `Vault "${vault.name}" shared with ${contact.name} via ${methods.join(" and ")}.`,
          severity: "alert",
        })
      })

      // Update vault status to triggered
      setState((s) => ({
        ...s,
        vaults: s.vaults.map((v) =>
          v.id === config.vaultId ? { ...v, status: "triggered" as const } : v
        ),
      }))
    })

    addLog({
      action: "DEAD MAN'S SWITCH ACTIVATED",
      detail: "Inactivity threshold exceeded. All configured vaults have been released to designated recipients.",
      severity: "alert",
    })
  }, [state.autoReleaseConfigs, state.vaults, state.contacts, addLog])
  
  const generatePasscode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    const prefix = "VAULT-"
    let code = ""
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)]
    }
    return prefix + code
  }

  const shareVault = useCallback(
    (vaultId: string, authorizedEmails: string[], expiresInDays: number | null): ShareLink => {
      const newLink: ShareLink = {
        id: `sl${Date.now()}`,
        passcode: generatePasscode(),
        authorizedEmails,
        createdAt: new Date(),
        expiresAt: expiresInDays ? new Date(Date.now() + expiresInDays * 86400000) : null,
        accessCount: 0,
      }
      setState((s) => ({
        ...s,
        vaults: s.vaults.map((v) =>
          v.id === vaultId
            ? { ...v, shareLinks: [...v.shareLinks, newLink], recipients: v.recipients + authorizedEmails.length }
            : v
        ),
      }))
      addLog({
        action: "Share link created",
        detail: `Vault ${vaultId} shared with ${authorizedEmails.length} recipient(s). Passcode: ${newLink.passcode}`,
        severity: "info",
      })
      return newLink
    },
    [addLog]
  )

  const revokeShareLink = useCallback(
    (vaultId: string, linkId: string) => {
      setState((s) => ({
        ...s,
        vaults: s.vaults.map((v) =>
          v.id === vaultId
            ? { ...v, shareLinks: v.shareLinks.filter((sl) => sl.id !== linkId) }
            : v
        ),
      }))
      addLog({ action: "Share link revoked", detail: `Link ${linkId} for vault ${vaultId} has been revoked.`, severity: "warn" })
    },
    [addLog]
  )

  const validateShareAccess = useCallback(
    (vaultId: string, linkId: string, passcode: string, email: string): { success: boolean; vault?: Vault } => {
      const vault = state.vaults.find((v) => v.id === vaultId)
      if (!vault) return { success: false }

      const link = vault.shareLinks.find((sl) => sl.id === linkId)
      if (!link) return { success: false }

      // Check passcode
      if (link.passcode !== passcode.toUpperCase().trim()) return { success: false }

      // Check email
      const normalizedEmail = email.toLowerCase().trim()
      if (!link.authorizedEmails.some((e) => e.toLowerCase() === normalizedEmail)) return { success: false }

      // Check expiration
      if (link.expiresAt && new Date() > link.expiresAt) return { success: false }

      // Increment access count
      setState((s) => ({
        ...s,
        vaults: s.vaults.map((v) =>
          v.id === vaultId
            ? {
                ...v,
                shareLinks: v.shareLinks.map((sl) =>
                  sl.id === linkId ? { ...sl, accessCount: sl.accessCount + 1 } : sl
                ),
              }
            : v
        ),
      }))

      addLog({
        action: "Vault accessed via share link",
        detail: `${email} accessed vault "${vault.name}" using passcode authentication.`,
        severity: "info",
      })

      return { success: true, vault }
    },
    [state.vaults, addLog]
  )

  return (
    <DemoContext.Provider
      value={{
        ...state,
        checkIn,
        createVault,
        deleteVault,
        updateVaultStatus,
  addContact,
  removeContact,
  verifyContact,
  updateContactPhone,
  updateContactPhoto,
  updateContactNotifyVia,
  connectIntegration,
  disconnectIntegration,
  toggleIntegrationActivityCheck,
  setAutoReleaseConfig,
  removeAutoReleaseConfig,
  setUserPhoto,
  simulateTrigger,
  shareVault,
  revokeShareLink,
  validateShareAccess,
  addLog,
  }}
    >
      {children}
    </DemoContext.Provider>
  )
}

export function useDemoStore() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error("useDemoStore must be used inside DemoProvider")
  return ctx
}
