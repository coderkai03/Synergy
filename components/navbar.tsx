"use client";

import * as React from "react";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Menu, User } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import SynergyLogo from "./synergy-logo";

export default function Navbar() {
    const { signOut } = useClerk();

    return (
        <header className="sticky top-0 z-10 bg-[#111119] px-4 shadow-sm">
            <div className="container mx-auto px-4 py-4 backdrop-blur-md flex justify-between items-center rounded-full">
                <SynergyLogo/>

                <div className="flex items-center gap-4">
                    <div className="hidden md:block mx-10 space-x-4">
                        <Link 
                            href="/account-setup"
                            className="text-white hover:text-amber-100"
                        >
                            Profile
                        </Link>
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
                            <DropdownMenu.Content className="w-32 space-y-2 bg-zinc-800 text-white border border-amber-500 rounded-md shadow-lg p-2" align="end" sideOffset={20}>
                                <DropdownMenu.Item asChild>
                                    <Link
                                        href="/account-setup"
                                        className="flex items-center gap-2 rounded hover:bg-amber-100 hover:text-black justify-end"
                                    >
                                        <User className="h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item asChild>
                                    <Link
                                        href="/hackathons"
                                        className="flex items-center gap-2 rounded hover:bg-amber-100 hover:text-black justify-end"
                                    >
                                        <span>Hackathons</span>
                                    </Link>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item asChild>
                                    <button
                                        onClick={() => signOut()}
                                        className="flex items-center gap-2 rounded hover:bg-amber-100 hover:text-black justify-end w-full"
                                    >
                                        <span>Sign Out</span>
                                    </button>
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    </div>
                </div>
            </div>
        </header>
    );
}
