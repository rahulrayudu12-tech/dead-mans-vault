import { ContactList } from "@/components/contacts/contact-list"
import { ContactInvite } from "@/components/contacts/contact-invite"
import { ConfirmationProtocol } from "@/components/contacts/confirmation-protocol"

export default function ContactsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
          Verification Network
        </p>
        <h1 className="text-2xl font-bold text-balance text-foreground">Emergency Contacts</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Trusted individuals who can confirm trigger conditions and receive vault keys.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ContactList />
          <ConfirmationProtocol />
        </div>
        <div>
          <ContactInvite />
        </div>
      </div>
    </div>
  )
}
