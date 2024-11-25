import { createClient } from "@/lib/supabase/server";
import { AddTransaction } from "./add-transaction";
import ListTransaction from "./list-transaction";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="px-5">
      <div className="flex md:items-center justify-between gap-2 mb-8">
        <div>
          <h1 className="font-bold text-xl">Transactions</h1>
          <p className="text-sm text-gray-500">Create and manage your income & expenses</p>
        </div>
        <div className="shrink-0">
          <AddTransaction user={user} />
        </div>
      </div>

      <ListTransaction user={user} />
    </div>
  );
}
