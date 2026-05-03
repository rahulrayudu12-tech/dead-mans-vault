import { Users, UserPlus, ShieldAlert } from "lucide-react";

export default function Contacts() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Emergency Contacts</h1>
          <p className="text-gray-400 mt-2">Manage who receives your vault data.</p>
        </div>
        <button className="bg-white text-black px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Add Contact
        </button>
      </div>

      <div className="rounded-xl border border-[#27272a] bg-[#09090b] overflow-hidden">
        <div className="p-6 border-b border-[#27272a]">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-orange-400" />
            Multi-Signature Confirmation Required
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            2 out of 3 verified contacts must confirm your status before data is released.
          </p>
        </div>
        
        <div className="p-0">
          <div className="divide-y divide-[#27272a]">
            {/* Contact 1 */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400">
                  <span className="font-bold">JD</span>
                </div>
                <div>
                  <div className="font-medium">John Doe</div>
                  <div className="text-sm text-gray-400">john.doe@example.com • +1 555-0101</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full border border-green-800">Verified</span>
                <button className="text-sm text-gray-400 hover:text-white">Edit</button>
              </div>
            </div>

            {/* Contact 2 */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-400">
                  <span className="font-bold">JS</span>
                </div>
                <div>
                  <div className="font-medium">Jane Smith (Lawyer)</div>
                  <div className="text-sm text-gray-400">jane.smith@lawfirm.com • +1 555-0202</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full border border-green-800">Verified</span>
                <button className="text-sm text-gray-400 hover:text-white">Edit</button>
              </div>
            </div>

            {/* Contact 3 */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
                  <span className="font-bold">AW</span>
                </div>
                <div>
                  <div className="font-medium">Alice Walker</div>
                  <div className="text-sm text-gray-400">alice.w@example.com</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-orange-900/30 text-orange-400 text-xs rounded-full border border-orange-800">Pending Invite</span>
                <button className="text-sm text-gray-400 hover:text-white">Resend</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
