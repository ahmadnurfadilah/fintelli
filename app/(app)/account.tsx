/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Avatar from "boring-avatars";
import { signOutAction } from "../action";
import { LogOut } from "lucide-react";

export default function Account({ user }: { user: any }) {
  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center space-x-2 hover:scale-[.98] active:scale-95 transition-all">
          <Avatar name={user?.user_metadata?.name} variant="beam" size={28} />
          <span className="font-medium hidden md:block text-sm text-black/70">{user?.user_metadata?.name}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 256 256">
            <path
              fill="currentColor"
              d="M128 188a12.2 12.2 0 0 1-8.5-3.5l-80-80a12 12 0 0 1 17-17L128 159l71.5-71.5a12 12 0 0 1 17 17l-80 80a12.2 12.2 0 0 1-8.5 3.5Z"
            />
          </svg>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52">
          <DropdownMenuLabel>
            <h6>{user?.user_metadata?.name}</h6>
            <p className="text-xs text-gray-500">{user?.user_metadata?.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOutAction()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
