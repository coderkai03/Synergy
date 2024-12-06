"use client";

import * as React from "react";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Menu, Users } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/nextjs";
import SynergyLogo from "./synergy-logo";

export default function Navbar() {
    const { signOut } = useClerk();

    return (
        <header className="sticky top-0 z-10 bg-[#111119] px-4 shadow-sm">
            <div className="container mx-auto px-4 py-4 backdrop-blur-md flex justify-between items-center rounded-full">
                <SynergyLogo/>

                <div className="flex items-center gap-4">
                    <div className="hidden md:block mx-10">
                        <Link 
                            href="/hackathons"
                            className="text-white hover:text-amber-100"
                        >
                            Hackathons
                        </Link>
                    </div>
                    <div className="md:hidden mt-2">
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                                <button className="text-white hover:text-amber-100">
                                    <Menu />
                                </button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content className="w-48 bg-zinc-800 text-white border border-amber-500 rounded-md shadow-lg p-2">
                                <DropdownMenu.Item asChild>
                                    <Link
                                        href="/hackathons"
                                        className="flex items-center gap-2 p-2 rounded hover:bg-amber-100 hover:text-black"
                                    >
                                        <span>Hackathons</span>
                                    </Link>
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    </div>
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <UserButton />
                        </div>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Content className="w-48 bg-zinc-800 text-white border border-amber-500 rounded-md shadow-lg p-2">
                            <DropdownMenu.Item asChild>
                                <Link
                                href="/account-setup"
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
