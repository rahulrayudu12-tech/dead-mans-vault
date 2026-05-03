"use client"

import { Sidebar } from "@/components/sidebar"
import { DemoProvider } from "@/lib/demo-store"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </DemoProvider>
  )
}
