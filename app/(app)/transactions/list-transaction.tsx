/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQueryState } from "nuqs";
import { createClient } from "@/lib/supabase/client";
import { addMonths, format, parseISO, startOfMonth, subMonths } from "date-fns";
import { ArrowLeft, ArrowRight, Bot } from "lucide-react";
import numeral from "numeral";
import { useEffect, useState } from "react";
import Avatar from "boring-avatars";

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

export default function ListTransaction({ user }: { user: any }) {
  const [currDate, setCurrDate] = useQueryState("currDate");
  const supabase = createClient();
  const [groupedByDate, setGroupedByDate] = useState<GroupedTransactions>({});

  useEffect(() => {
    const getData = async () => {
      const startMonth = format(startOfMonth(parseISO(currDate!)), "yyyy-MM-dd");
      const endMonth = format(addMonths(startMonth, 1), "yyyy-MM-dd");

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
        .gte("transaction_date", startMonth)
        .lt("transaction_date", endMonth)
        .order("transaction_date", { ascending: false });

      if (!error && data && data?.length > 0) {
        setGroupedByDate(
          data.reduce((acc, transaction) => {
            const date = transaction.transaction_date;
            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push(transaction);
            return acc;
          }, {} as GroupedTransactions)
        );
      } else {
        setGroupedByDate({});
      }
    };

    if (currDate) {
      getData();
    } else {
      setCurrDate(new Date().toISOString().split("T")[0]);
    }
  }, [supabase, user?.id, currDate, setCurrDate]);

  const toPrevDate = () => {
    const subDate = subMonths(currDate!, 1);
    setCurrDate(format(subDate, "yyyy-MM-dd"));
  };

  const toNextDate = () => {
    const addDate = addMonths(currDate!, 1);
    setCurrDate(format(addDate, "yyyy-MM-dd"));
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border">
      <div className="flex items-center justify-between p-4 border-b">
        <button onClick={() => toPrevDate()}>
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-bold">{format(currDate ?? new Date(), "MMM, yyyy")}</h2>
        <button onClick={() => toNextDate()}>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {Object.keys(groupedByDate).length > 0 ? (
        <>
          {Object.entries(groupedByDate).map(([date, transactions]: [string, Transaction[]]) => (
            <div key={date}>
              <h3 className="bg-gray-50 px-2 py-1 text-xs">{format(date, "MMM dd, yyyy")}</h3>
              <ul className="px-2 mb-2">
                {transactions.map((transaction) => (
                  <li key={transaction.id} className="w-full flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                    <Avatar className="size-10" variant="marble" name={transaction?.accounts?.name} colors={["#ef4444", "#f59e0b", "#84cc16", "#f43f5e", "#06b6d4"]} />
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
        </>
      ) : (
        <div className="w-full flex items-center justify-center p-5">
          <div>
            <Bot className="w-8 h-8 mx-auto" />
            <p className="text-gray-500">Data not found</p>
          </div>
        </div>
      )}
    </div>
  );
}
