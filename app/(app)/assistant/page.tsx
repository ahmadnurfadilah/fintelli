import { createClient } from "@/lib/supabase/server";
import Chat from "./chat";
import { Bot } from "lucide-react";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <div className="flex items-center justify-center mb-4 gap-2">
        <Bot className="w-7 h-7" />
        <h1 className="font-bold text-xl">AI Assistant</h1>
      </div>

      <div className="relative">
        <Chat user={user} />
      </div>
    </>
  );
}
