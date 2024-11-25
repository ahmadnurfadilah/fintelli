"use client";

import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2),
  balance: z.string(),
});

export function AddAccount() {
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Account</DialogTitle>
            <DialogDescription>Create new account.</DialogDescription>
          </DialogHeader>
          <AddAccountForm onClose={() => closeModal()} />
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
          <DrawerTitle>New Account</DrawerTitle>
          <DrawerDescription>Create new account.</DrawerDescription>
        </DrawerHeader>
        <AddAccountForm className="px-4" onClose={() => closeModal()} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function AddAccountForm({ className, onClose }: React.ComponentProps<"form"> & { onClose: () => void }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      balance: "0",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const name = values.name;
    const balance = parseFloat(values.balance);

    setIsSubmitting(true);
    toast.loading("Creating...");

    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from("accounts").insert([{ user_id: user.id, name, balance }]).select();

      toast.dismiss();
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Success creating new account!");
        onClose();
        router.refresh();
      }
      setIsSubmitting(false);
    }

  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("grid items-start gap-4", className)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Account name" disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="balance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Balance</FormLabel>
              <FormControl>
                <Input type="number" {...field} placeholder="Account balance" disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>Save changes</Button>
      </form>
    </Form>
  );
}
