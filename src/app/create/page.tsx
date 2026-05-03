import { ShieldPlus, Lock, FileText } from "lucide-react";

export default function CreateVault() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Vault</h1>
        <p className="text-gray-400 mt-2">Securely encrypt and store sensitive information.</p>
      </div>

      <div className="rounded-xl border border-[#27272a] bg-[#09090b] overflow-hidden">
        <div className="p-6 border-b border-[#27272a]">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-400" />
            Client-Side Encryption
          </h3>
          <p className="text-sm text-gray-400 mt-1">Data is encrypted on your device. We never see your plaintext or keys.</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Vault Name</label>
            <input 
              type="text" 
              placeholder="e.g., Financial Passwords & Wills" 
              className="w-full bg-[#18181b] border border-[#27272a] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Secret Payload</label>
            <textarea 
              rows={8}
              placeholder="Enter your confidential data here. This will be encrypted via XChaCha20-Poly1305 before leaving your browser." 
              className="w-full bg-[#18181b] border border-[#27272a] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Master Password (Required for Release)</label>
            <input 
              type="password" 
              placeholder="••••••••••••••••" 
              className="w-full bg-[#18181b] border border-[#27272a] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            <p className="text-xs text-gray-400">Do not lose this. It must be shared with your emergency contacts out-of-band.</p>
          </div>
        </div>

        <div className="p-6 border-t border-[#27272a] bg-[#18181b] flex justify-end gap-3">
          <button className="px-4 py-2 text-sm font-medium rounded-md hover:bg-[#27272a] transition-colors">
            Cancel
          </button>
          <button className="bg-white text-black px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2">
            <ShieldPlus className="w-4 h-4" />
            Encrypt & Save to Vault
          </button>
        </div>
      </div>
    </div>
  );
}
