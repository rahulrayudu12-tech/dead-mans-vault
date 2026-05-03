import Link from "next/link";
import { Home, ShieldPlus, Clock, Users, Activity, Settings } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/create", label: "Create Vault", icon: ShieldPlus },
  { href: "/schedule", label: "Scheduling", icon: Clock },
  { href: "/contacts", label: "Emergency Contacts", icon: Users },
  { href: "/audit", label: "Audit Logs", icon: Activity },
  { href: "/admin", label: "Admin Panel", icon: Settings },
];

export function Sidebar() {
  return (
    <div className="flex h-screen w-64 flex-col border-r border-[#27272a] bg-[#09090b] text-[#fafafa]">
      <div className="flex h-16 items-center border-b border-[#27272a] px-6">
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <ShieldPlus className="w-6 h-6 text-red-500" />
          Dead Man's Vault
        </h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-[#27272a] hover:text-white transition-colors"
            >
              <Icon className="h-5 w-5 text-gray-400" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[#27272a]">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
            <span className="text-xs font-bold text-white">U</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Test User</span>
            <span className="text-xs text-gray-400">Pro Plan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
