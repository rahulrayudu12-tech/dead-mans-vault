import { VaultList } from "@/components/vault/vault-list"
import { CreateVaultButton } from "@/components/vault/create-vault-button"

export default function VaultPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
            Encrypted Storage
          </p>
          <h1 className="text-2xl font-bold text-balance text-foreground">Vault Creation</h1>
          <p className="text-sm text-muted-foreground mt-1">
            All content is encrypted client-side before storage. Zero-knowledge architecture.
          </p>
        </div>
        <CreateVaultButton />
      </div>

      {/* Encryption info banner */}
      <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 mb-8 flex items-start gap-3">
        <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-primary text-sm font-bold">E2E</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">End-to-End Encrypted</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Content is encrypted with AES-256-GCM in your browser using a derived key (PBKDF2 / scrypt).
            The server never sees plaintext. Key shards are distributed across recipients using Shamir&apos;s Secret Sharing.
          </p>
        </div>
      </div>

      <VaultList />
    </div>
  )
}
