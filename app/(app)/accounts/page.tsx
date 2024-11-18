import { createClient } from "@/lib/supabase/server";
import { AddAccount } from "./add-account";
import numeral from "numeral";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data } = await supabase.from("accounts").select("*").eq("user_id", user?.id);

  return (
    <div className="px-5">
      <div className="flex md:items-center justify-between gap-2 mb-8">
        <div>
          <h1 className="font-bold text-xl">Accounts</h1>
          <p className="text-sm">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Amet ea quod</p>
        </div>
        <div className="shrink-0">
          <AddAccount />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data?.map((i) => (
          <div
            key={i.id}
            className="w-full rounded-xl bg-white p-5 text-black shadow-sm hover:shadow-lg transition-all flex flex-col gap-1 border border-gray-200"
          >
            <div>{i.name}</div>
            <div className="font-mono font-bold text-lg">{numeral(i.balance).format()}</div>
            {/* <div>Footer</div> */}
          </div>
        ))}
      </div>
    </div>
  );
}
