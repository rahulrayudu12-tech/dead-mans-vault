import { Server, Database, Key, ShieldAlert } from "lucide-react";

export default function AdminPanel() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-red-500">Admin Monitoring</h1>
        <p className="text-gray-400 mt-2">System-wide health and metric monitoring.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-red-900/50 bg-[#09090b] text-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-red-400">Total Users</h3>
            <Server className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold">1,245</div>
        </div>
        <div className="rounded-xl border border-red-900/50 bg-[#09090b] text-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-red-400">Encrypted Vaults</h3>
            <Database className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold">3,892</div>
        </div>
        <div className="rounded-xl border border-red-900/50 bg-[#09090b] text-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-red-400">Keys Released</h3>
            <Key className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold">14</div>
        </div>
        <div className="rounded-xl border border-red-900/50 bg-[#09090b] text-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-red-400">Active Triggers</h3>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold">42</div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-[#27272a] bg-[#09090b]">
        <div className="p-6 border-b border-[#27272a]">
          <h3 className="text-lg font-semibold">Recent System Alerts</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between bg-[#18181b] p-4 rounded-md border border-[#27272a]">
            <div>
              <div className="font-medium text-sm text-yellow-500">Cron Job Delay Detected</div>
              <div className="text-xs text-gray-400 mt-1">Heartbeat checker cron job took 2.4s to execute (threshold: 1s).</div>
            </div>
            <div className="text-xs text-gray-500">10 mins ago</div>
          </div>
          <div className="flex items-center justify-between bg-[#18181b] p-4 rounded-md border border-[#27272a]">
            <div>
              <div className="font-medium text-sm text-red-500">Failed Webhook Delivery</div>
              <div className="text-xs text-gray-400 mt-1">Clerk user.updated webhook returned 502 from endpoint.</div>
            </div>
            <div className="text-xs text-gray-500">2 hours ago</div>
          </div>
        </div>
      </div>
    </div>
  );
}
