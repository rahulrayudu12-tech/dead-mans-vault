"use client"

import { useState } from "react"
import { CheckCircle, Fingerprint, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useDemoStore } from "@/lib/demo-store"

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function CheckInPrompt() {
  const { lastCheckIn, checkInCount, checkIn, switchPeriodDays, simulateTrigger } = useDemoStore()
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle")
  const [triggerStatus, setTriggerStatus] = useState<"idle" | "loading" | "done">("idle")

  const handleCheckIn = () => {
    setStatus("loading")
    setTimeout(() => {
      checkIn()
      setStatus("done")
      setTimeout(() => setStatus("idle"), 4000)
    }, 1600)
  }

  const handleSimulateTrigger = () => {
    setTriggerStatus("loading")
    setTimeout(() => {
      simulateTrigger()
      setTriggerStatus("done")
      setTimeout(() => setTriggerStatus("idle"), 5000)
    }, 2000)
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Fingerprint className="w-5 h-5 text-primary" />
        <span className="text-sm font-semibold text-foreground">Proof of Life</span>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed mb-6 flex-1">
        Confirm your presence to reset the switch timer. You&apos;ll be prompted by email
        every <span className="text-foreground font-medium">{switchPeriodDays} days</span>. Multiple
        missed check-ins trigger the staged release sequence.
      </p>

      <div className="flex flex-col gap-3">
        <Button
          onClick={handleCheckIn}
          disabled={status !== "idle"}
          className={cn(
            "w-full font-semibold",
            status === "done" &&
              "bg-vault-active/20 text-vault-active border border-vault-active hover:bg-vault-active/20 cursor-default"
          )}
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Verifying...
            </>
          ) : status === "done" ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirmed — Timer Reset
            </>
          ) : (
            <>
              <Fingerprint className="w-4 h-4 mr-2" />
              Check In Now
            </>
          )}
        </Button>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-secondary rounded p-2">
            <div className="text-xs font-mono font-bold text-foreground">{timeAgo(lastCheckIn)}</div>
            <div className="text-xs text-muted-foreground">Last</div>
          </div>
          <div className="bg-secondary rounded p-2">
            <div className="text-xs font-mono font-bold text-foreground">{switchPeriodDays}d</div>
            <div className="text-xs text-muted-foreground">Period</div>
          </div>
          <div className="bg-secondary rounded p-2">
            <div className="text-xs font-mono font-bold text-foreground">#{checkInCount}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>

        {/* Demo: Simulate Trigger */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">
            <span className="text-destructive font-semibold">Demo:</span> Simulate what happens when the switch triggers
          </p>
          <Button
            variant="outline"
            onClick={handleSimulateTrigger}
            disabled={triggerStatus !== "idle"}
            className={cn(
              "w-full text-xs border-destructive/50 text-destructive hover:bg-destructive/10",
              triggerStatus === "done" && "bg-destructive/20 border-destructive"
            )}
          >
            {triggerStatus === "loading" ? (
              <>
                <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                Triggering Release...
              </>
            ) : triggerStatus === "done" ? (
              <>
                <AlertTriangle className="w-3 h-3 mr-2" />
                Vaults Released!
              </>
            ) : (
              <>
                <AlertTriangle className="w-3 h-3 mr-2" />
                Simulate Trigger
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
