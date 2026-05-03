import { Shield, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <button className="bg-red-900/50 text-red-200 border border-red-800 px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-red-900 transition-colors">
          <AlertTriangle className="w-4 h-4" />
          I am alive (Heartbeat)
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[#27272a] bg-[#09090b] text-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2 space-y-0">
            <h3 className="tracking-tight text-sm font-medium">Active Vaults</h3>
            <Shield className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-gray-400 mt-1">2 fully encrypted, 1 pending</p>
        </div>
        <div className="rounded-xl border border-[#27272a] bg-[#09090b] text-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2 space-y-0">
            <h3 className="tracking-tight text-sm font-medium">Next Check-in</h3>
            <Clock className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">14 Days</div>
          <p className="text-xs text-gray-400 mt-1">May 17, 2026</p>
        </div>
        <div className="rounded-xl border border-[#27272a] bg-[#09090b] text-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2 space-y-0">
            <h3 className="tracking-tight text-sm font-medium">Contacts</h3>
            <CheckCircle2 className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">2/3 Verified</div>
          <p className="text-xs text-gray-400 mt-1">1 pending verification</p>
        </div>
        <div className="rounded-xl border border-[#27272a] bg-[#09090b] text-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2 space-y-0">
            <h3 className="tracking-tight text-sm font-medium">System Status</h3>
            <ActivityIcon className="h-4 w-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400">Secure</div>
          <p className="text-xs text-gray-400 mt-1">All systems operational</p>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-[#27272a] bg-[#09090b]">
        <div className="p-6">
          <h3 className="text-lg font-semibold">Recent Vault Activity</h3>
          <p className="text-sm text-gray-400 mt-1">Your latest encryption and access logs.</p>
        </div>
        <div className="px-6 pb-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between border-b border-[#27272a] pb-4 last:border-0 last:pb-0">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Heartbeat Registered</span>
                  <span className="text-xs text-gray-400">System recorded manual check-in</span>
                </div>
                <div className="text-sm text-gray-400">2 days ago</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
