import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full pr-2">
        <div className="w-full mt-2 mr-2 mb-2">
            <SidebarTrigger />
        </div>
        {children}
      </main>
    </SidebarProvider>
  )
}
