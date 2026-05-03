"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VaultCreateModal } from "./vault-create-modal-standalone"

export function CreateVaultButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
        <Plus className="w-4 h-4" />
        New Vault
      </Button>
      {open && <VaultCreateModal onClose={() => setOpen(false)} />}
    </>
  )
}
