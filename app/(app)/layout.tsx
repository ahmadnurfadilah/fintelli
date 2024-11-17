import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full py-2 pr-2">
        <div className="w-full rounded-lg bg-white border shadow-sm p-4 mb-4">
            <SidebarTrigger />
        </div>
        {children}
      </main>
    </SidebarProvider>
  )
}
