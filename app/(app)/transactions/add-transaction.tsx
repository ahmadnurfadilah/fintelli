/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMediaQuery } from "usehooks-ts";
import { z } from "zod";

export function AddTransaction({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const closeModal = () => {
    setOpen(false);
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="icon" className="rounded-full">
            <Plus />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>New Transaction</DialogTitle>
          </DialogHeader>
          <AddTransactionForm user={user} onClose={() => closeModal()} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="icon" className="rounded-full">
          <Plus />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>New Transaction</DrawerTitle>
        </DrawerHeader>
        <AddTransactionForm user={user} className="px-4" onClose={() => closeModal()} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const formSchema = z.object({
  account: z.string(),
  incomeCategory: z.string(),
  expenseCategory: z.string(),
  amount: z.string(),
  date: z.date(),
  description: z.string(),
});

const typeOptions = [
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
];

function AddTransactionForm({ user, className, onClose }: React.ComponentProps<"form"> & { onClose: () => void; user: any }) {
  const router = useRouter();
  const supabase = createClient();
  const [type, setType] = useState<string>("expense");
  const [accounts, setAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getAccounts = async () => {
      const { error, data } = await supabase.from("accounts").select("*").eq("user_id", user.id);
      if (!error && data.length > 0) {
        setAccounts(data);
      }
    };

    const getCategories = async () => {
      const { error, data } = await supabase.from("categories").select("*").eq("user_id", user.id);
      if (!error && data.length > 0) {
        setCategories(data);
      }
    };

    getAccounts();
    getCategories();
  }, [user, supabase]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      incomeCategory: "",
      expenseCategory: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    setIsSubmitting(true);
    toast.loading("Creating...");

    let categoryId = null;
    if (type == "income") {
      categoryId = values.incomeCategory;
    } else if (type == "expense") {
      categoryId = values.expenseCategory;
    }

    await fetch("/api/transaction/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
        user_id: user.id,
        account_id: values.account,
        category_id: categoryId,
        amount: values.amount,
        transaction_date: values.date,
        description: values.description,
        account: accounts.find((o) => o.id == values.account).name,
        category: categories.find((o) => o.id == categoryId).name,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        toast.dismiss();
        if (res.success) {
          onClose();
          toast.success(res.message);
          router.refresh();
        } else {
          toast.error(res.message);
        }
      })
      .catch((err) => {
        toast.dismiss();
        toast.error(err.message);
      });

    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("grid items-start gap-3", className)}>
        <div className="grid grid-cols-2 gap-3">
          {typeOptions.map((i) => (
            <button
              type="button"
              key={i.value}
              onClick={() => setType(i.value)}
              className={`flex items-center justify-center w-full px-2 py-1.5 rounded-md border text-sm ${
                type === i.value ? "bg-gray-800 text-white" : "bg-white text-gray-800"
              }`}
            >
              {i.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="account"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {accounts.map((i) => (
                      <SelectItem key={i.id} value={i.id}>
                        {i.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {type === "income" && (
            <FormField
              control={form.control}
              name="incomeCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories
                        .filter((o) => o.type === "income")
                        .map((i) => (
                          <SelectItem key={i.id} value={i.id}>
                            {i.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {type === "expense" && (
            <FormField
              control={form.control}
              name="expenseCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories
                        .filter((o) => o.type === "expense")
                        .map((i) => (
                          <SelectItem key={i.id} value={i.id}>
                            {i.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Notes..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
