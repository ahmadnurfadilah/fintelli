/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import { AddTransaction } from "./add-transaction";
import { ArrowLeft, ArrowRight } from "lucide-react";
import numeral from "numeral";
import { format } from "date-fns";

interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  accounts: any;
  categories: any;
  description: string;
  type: string;
  transaction_date: string;
  created_at: string;
}

interface GroupedTransactions {
  [date: string]: Transaction[];
}

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("transactions")
    .select(
      `
      id,
      user_id,
      amount,
      description,
      type,
      transaction_date,
      created_at,
      accounts (
        name
      ),
      categories (
        name
      )
    `
    )
    .eq("user_id", user?.id)
    .order("transaction_date", { ascending: false });

  let groupedByDate: GroupedTransactions;
  if (!error && data && data?.length > 0) {
    groupedByDate = data.reduce((acc, transaction) => {
      const date = transaction.transaction_date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      return acc;
    }, {} as GroupedTransactions);
  } else {
    groupedByDate = {};
  }

  return (
    <div className="px-5">
      <div className="flex md:items-center justify-between gap-2 mb-8">
        <div>
          <h1 className="font-bold text-xl">Transactions</h1>
          <p className="text-sm">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Amet ea quod</p>
        </div>
        <div className="shrink-0">
          <AddTransaction user={user} />
        </div>
      </div>

      <div className="w-full bg-white rounded-lg shadow-sm border">
        <div className="flex items-center justify-between p-4 border-b">
          <button>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-bold">Nov 2024</h2>
          <button>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {Object.entries(groupedByDate).map(([date, transactions]: [string, Transaction[]]) => (
          <div key={date}>
            <h3 className="bg-gray-50 px-2 py-1 text-xs">{format(date, "MMM dd, yyyy")}</h3>
            <ul className="px-2 mb-2">
              {transactions.map((transaction) => (
                <li key={transaction.id} className="w-full flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <div className="size-10 bg-blue-100 rounded-full"></div>
                    <div>
                      <h6 className="text-sm font-medium">{transaction?.categories?.name}</h6>
                      <p className="text-xs">{transaction.description}</p>
                    </div>
                  </div>
                  {transaction.type == "income" ? (
                    <div className="font-mono font-bold text-sm text-green-600">+{numeral(Math.abs(transaction.amount)).format()}</div>
                  ) : (
                    <div className="font-mono font-bold text-sm text-red-600">-{numeral(Math.abs(transaction.amount)).format()}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
