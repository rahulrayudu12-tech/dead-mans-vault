import { Clock, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const cronJobs = [
  {
    name: "check-in-reminder",
    schedule: "0 8 * * *",
    desc: "Daily 8 AM — remind near-deadline users",
    lastRun: "2026-05-03 08:00:01",
    nextRun: "2026-05-04 08:00:00",
    status: "success",
    duration: "342ms",
  },
  {
    name: "trigger-evaluator",
    schedule: "*/15 * * * *",
    desc: "Every 15 min — evaluate active switch states",
    lastRun: "2026-05-03 08:30:00",
    nextRun: "2026-05-03 08:45:00",
    status: "success",
    duration: "88ms",
  },
  {
    name: "key-rotation",
    schedule: "0 0 1 */3 *",
    desc: "Quarterly — rotate RSA key pairs",
    lastRun: "2026-04-01 00:00:00",
    nextRun: "2026-07-01 00:00:00",
    status: "success",
    duration: "1.2s",
  },
  {
    name: "backup-upload",
    schedule: "0 2 * * 0",
    desc: "Weekly Sunday 2 AM — encrypted backup to Blob",
    lastRun: "2026-04-27 02:00:01",
    nextRun: "2026-05-04 02:00:00",
    status: "success",
    duration: "4.8s",
  },
  {
    name: "contact-reverify",
    schedule: "0 9 1 * *",
    desc: "Monthly — resend contact verification prompts",
    lastRun: "2026-05-01 09:00:02",
    nextRun: "2026-06-01 09:00:00",
    status: "failed",
    duration: "—",
  },
]

const statusIcon = {
  success: <CheckCircle className="w-4 h-4 text-vault-active" />,
  failed: <XCircle className="w-4 h-4 text-destructive" />,
  running: <Loader2 className="w-4 h-4 text-primary animate-spin" />,
}

export function AdminCronJobs() {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
        <Clock className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Cron Jobs</h2>
        <span className="ml-auto text-xs text-muted-foreground font-mono">
          {cronJobs.filter((j) => j.status === "success").length}/{cronJobs.length} healthy
        </span>
      </div>
      <div className="divide-y divide-border">
        {cronJobs.map((job) => (
          <div key={job.name} className="px-5 py-3 flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              {statusIcon[job.status as keyof typeof statusIcon]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold text-foreground">{job.name}</span>
                <span className="text-xs font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{job.schedule}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{job.desc}</p>
              <div className="flex items-center gap-3 mt-1 text-xs font-mono text-muted-foreground">
                <span>Last: {job.lastRun.split(" ")[1]}</span>
                <span>Next: {job.nextRun.split(" ")[1]}</span>
                <span className={job.status === "failed" ? "text-destructive" : "text-vault-active"}>
                  {job.duration}
                </span>
              </div>
            </div>
            {job.status === "failed" && (
              <Button variant="outline" size="sm" className="h-6 text-xs shrink-0">Retry</Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
