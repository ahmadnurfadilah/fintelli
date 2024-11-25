import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { ArrowUpIcon } from "lucide-react";
import numeral from "numeral";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: accounts } = await supabase.from("accounts").select("*").eq("user_id", user?.id);
  const { data: categories } = await supabase
        .from('categories_with_transaction_totals') // Use the name of your view
        .select('*');
  const { data: transactions } = await supabase
    .from("transactions")
    .select("id, transaction_date, amount, description, category_id, account_id, type")
    .eq("user_id", user?.id)
    .gte("transaction_date", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0])
    .lt("transaction_date", new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString().split("T")[0]);

  // Calculate the total income
  const totalIncome = transactions!.reduce((total, transaction) => {
    if (transaction.type === "income") {
      return total + transaction.amount;
    }
    return total;
  }, 0);

  // Calculate the total expense
  const totalExpense = transactions!.reduce((total, transaction) => {
    if (transaction.type === "expense") {
      return total + transaction.amount;
    }
    return total;
  }, 0);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pt-4 pb-0">
            <CardTitle className="text-sm font-medium text-gray-500">Net Worth</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <div className="text-2xl font-bold font-mono">{numeral(accounts!.reduce((sum, account) => sum + account.balance, 0)).format()}</div>
            <p className={`text-xs text-green-500 flex items-center`}>
              <ArrowUpIcon className="mr-1 h-4 w-4" />
              <span>0%</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pt-4 pb-0">
            <CardTitle className="text-sm font-medium text-gray-500">Income</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <div className="text-2xl font-bold font-mono text-green-600">+{numeral(totalIncome).format()}</div>
            <p className={`text-xs text-green-500 flex items-center`}>
              <ArrowUpIcon className="mr-1 h-4 w-4" />
              <span>0%</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pt-4 pb-0">
            <CardTitle className="text-sm font-medium text-gray-500">Expense</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <div className="text-2xl font-bold font-mono text-red-600">{numeral(totalExpense).format()}</div>
            <p className={`text-xs text-green-500 flex items-center`}>
              <ArrowUpIcon className="mr-1 h-4 w-4" />
              <span>0%</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="bg-white rounded-lg border shadow-sm p-4">
            <h3 className="font-medium mb-2">Accounts</h3>
            <div className="rounded-lg bg-gray-100 p-0.5">
              <div className="p-2 flex items-center justify-between text-xs uppercase font-semibold text-gray-500">
                <h6>Name</h6>
                <h6>Amount</h6>
              </div>
              <div className="w-full rounded-lg bg-white p-2">
                {accounts?.map((i) => (
                  <div key={i.id} className="py-2 flex items-center justify-between text-xs font-medium text-gray-600">
                    <h6>{i.name}</h6>
                    <h6 className="font-mono font-bold">{numeral(Math.abs(i.balance)).format()}</h6>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-lg border shadow-sm p-4">
            <h3 className="font-medium mb-2">Expenses</h3>
            <div className="rounded-lg bg-gray-100 p-0.5">
              <div className="p-2 flex items-center justify-between text-xs uppercase font-semibold text-gray-500">
                <h6>Category</h6>
                <h6>Amount</h6>
              </div>
              <div className="w-full rounded-lg bg-white p-2">
                {categories?.filter((o) => o.type == 'expense')?.map((i) => (
                  <div key={i.id} className="py-2 flex items-center justify-between text-xs font-medium text-gray-600">
                    <h6>{i.category_name}</h6>
                    <h6 className="font-mono font-bold text-red-600">{numeral(i.total_amount).format()}</h6>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
