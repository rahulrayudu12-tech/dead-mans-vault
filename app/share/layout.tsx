import { DemoProvider } from "@/lib/demo-store"

export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return <DemoProvider>{children}</DemoProvider>
}
