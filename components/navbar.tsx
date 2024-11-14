"use client";

import * as React from "react";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Zap, Users } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/nextjs";

export default function Navbar() {
    const { user } = useUser();
    const { signOut } = useClerk();

    return (
        <header className="sticky top-0 z-10 bg-[#111119] px-4 shadow-sm">
            <div className="container mx-auto px-4 py-4 backdrop-blur-md flex justify-between items-center rounded-full">
                <div className="flex items-center">
                <Zap className="w-8 h-8 text-white" />
                <Link href="/" className="text-2xl font-bold text-white">
                    ynergy
                </Link>
                </div>

                <div className="flex items-center gap-2">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer">
                        <span className="text-white">{user?.fullName || "Username"}</span>
                        <UserButton />
                    </div>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Content className="w-48 bg-zinc-800 text-white border border-amber-500 rounded-md shadow-lg p-2">
                    <DropdownMenu.Item asChild>
                        <Link
                        href="/alpha/account-setup"
                        className="flex items-center gap-2 p-2 rounded hover:bg-amber-100 hover:text-black"
                        >
                        <Users className="h-4 w-4" />
                        <span>Edit Profile</span>
                        </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                        <button
                        onClick={() => signOut()}
                        className="flex items-center gap-2 p-2 w-full text-left rounded hover:bg-amber-100 hover:text-black"
                        >
                        <span>Sign Out</span>
                        </button>
                    </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
                </div>
            </div>
        </header>
    );
}
