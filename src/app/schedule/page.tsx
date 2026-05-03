import { Clock, BellRing, Settings2 } from "lucide-react";

export default function Schedule() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Scheduling & Triggers</h1>
        <p className="text-gray-400 mt-2">Configure heartbeats and release timelines.</p>
      </div>

      <div className="rounded-xl border border-[#27272a] bg-[#09090b] overflow-hidden">
        <div className="p-6 border-b border-[#27272a]">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            Inactivity Timer (Dead Man Switch)
          </h3>
          <p className="text-sm text-gray-400 mt-1">If no heartbeat is detected within this timeframe, the escalation protocol begins.</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-medium">Require Check-in Every</label>
            <div className="flex gap-4">
              {['7 Days', '14 Days', '30 Days', '90 Days'].map((d) => (
                <button key={d} className={`px-4 py-2 text-sm rounded-md border ${d === '30 Days' ? 'border-purple-500 bg-purple-500/10 text-purple-400' : 'border-[#27272a] bg-[#18181b] hover:bg-[#27272a]'}`}>
                  {d}
                </button>
              ))}
              <input type="number" placeholder="Custom Days" className="w-32 bg-[#18181b] border border-[#27272a] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-purple-500" />
            </div>
          </div>

          <div className="border-t border-[#27272a] pt-6 space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <BellRing className="w-4 h-4" />
              Escalation Warnings
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-[#18181b] p-3 rounded-md border border-[#27272a]">
                <div className="text-sm">T minus 7 days</div>
                <div className="text-sm text-gray-400">Email Warning 1</div>
              </div>
              <div className="flex items-center justify-between bg-[#18181b] p-3 rounded-md border border-[#27272a]">
                <div className="text-sm">T minus 3 days</div>
                <div className="text-sm text-gray-400">SMS + Email Warning 2</div>
              </div>
              <div className="flex items-center justify-between bg-[#18181b] p-3 rounded-md border border-[#27272a]">
                <div className="text-sm">T minus 24 hours</div>
                <div className="text-sm text-gray-400 text-red-400">Automated Phone Call</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#27272a] bg-[#18181b] flex justify-end">
          <button className="bg-white text-black px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
