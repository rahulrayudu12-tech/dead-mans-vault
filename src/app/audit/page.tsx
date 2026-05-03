import { Activity, ShieldCheck, Mail, LogIn } from "lucide-react";

export default function AuditLogs() {
  const logs = [
    { id: 1, action: "Heartbeat Registered", type: "system", detail: "Manual button click from IP 192.168.1.1", time: "2 hours ago", icon: Activity, color: "text-blue-400" },
    { id: 2, action: "Vault Created", type: "security", detail: "Vault 'Financials' encrypted and stored", time: "3 days ago", icon: ShieldCheck, color: "text-green-400" },
    { id: 3, action: "Contact Invited", type: "system", detail: "Invitation sent to alice.w@example.com", time: "4 days ago", icon: Mail, color: "text-gray-400" },
    { id: 4, action: "Successful Login", type: "auth", detail: "Login from Chrome on macOS", time: "5 days ago", icon: LogIn, color: "text-gray-400" },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-gray-400 mt-2">Immutable record of all account activity.</p>
      </div>

      <div className="rounded-xl border border-[#27272a] bg-[#09090b] overflow-hidden">
        <div className="p-0">
          <div className="divide-y divide-[#27272a]">
            {logs.map((log) => {
              const Icon = log.icon;
              return (
                <div key={log.id} className="p-6 flex items-start gap-4">
                  <div className="mt-1">
                    <Icon className={`w-5 h-5 ${log.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm text-white">{log.action}</h4>
                      <span className="text-xs text-gray-500">{log.time}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{log.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
