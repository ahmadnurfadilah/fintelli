import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/server";
import Account from "./account";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full py-2 pr-2">
        <div className="w-full rounded-lg bg-white border shadow-sm p-4 mb-4 relative flex items-center justify-between">
          <SidebarTrigger />
          <Account user={user} />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
