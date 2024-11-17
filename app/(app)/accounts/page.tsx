import { createClient } from "@/lib/supabase/server";
import { AddAccount } from "./add-account";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error, data } = await supabase.from("accounts").select("*").eq("user_id", user?.id);

  return (
    <div className="px-5">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-bold text-xl">Accounts</h1>
          <p className="text-sm">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Amet ea quod</p>
        </div>
        <AddAccount />
      </div>

      <div className="grid grid-cols-3 gap-5">
        {data?.map((i) => (
          <div key={i.id} className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 p-5 text-white shadow-sm hover:shadow-lg transition-all flex flex-col gap-2 border border-blue-700">
            <div>{i.name}</div>
            <div className="font-mono font-bold text-xl">{i.balance}</div>
            {/* <div>Footer</div> */}
          </div>
        ))}
      </div>
    </div>
  );
}
