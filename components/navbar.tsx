"use client";

import * as React from "react";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogIn, LogOut, Menu, User } from "lucide-react";
import { useClerk, useUser, SignInButton } from "@clerk/nextjs";
import SynergyLogo from "./synergy-logo";

export default function Navbar() {
    const { signOut } = useClerk();
    const { user, isSignedIn } = useUser();
    const { getLogoSize } = SynergyLogo();

    // const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    // const isTest = publishableKey?.includes('pk_test');

    const navItems = () => {
        return (
            <div className="flex items-center gap-4 space-x-4">
                <Link 
                    href="/home"
                    className="text-white hover:text-amber-100"
                >
                    Home
                </Link>
                <Link 
                    href="/teams"
                    className="text-white hover:text-amber-100"
                >
                    Teams
                </Link>
                <Link 
                    href="/explore"
                    className="text-white hover:text-amber-100"
                >
                    Explore
                </Link>
                <Link 
                    href="/hackathons"
                    className="text-white hover:text-amber-100"
                >
                    Hackathons
                </Link>
                <Link 
                    href="/teams/create"
                    className="text-white hover:text-amber-100"
                >
                    Create
                </Link>
                {user ? (
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-700 hover:bg-zinc-600 text-white hover:text-amber-100 transition-colors">
                                <User className="h-5 w-5" />
                            </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content className="mt-2 w-32 space-y-2 bg-zinc-800 text-white border border-amber-500 rounded-md shadow-lg p-2" align="end">
                            <DropdownMenu.Item asChild>
                                <Link 
                                    href="/account-setup"
                                    className="flex items-center gap-2 rounded hover:bg-amber-100 hover:text-black px-2 py-1"
                                >
                                    <User className="h-4 w-4" />
                                    <span>Profile</span>
                                </Link>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item asChild>
                                <button 
                                    onClick={() => signOut()}
                                    className="flex w-full items-center gap-2 rounded hover:bg-amber-100 hover:text-black px-2 py-1"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Sign out</span>
                                </button>
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                ) : (
                    <button className="inline-flex items-center gap-2 text-white hover:text-amber-100">
                        <SignInButton
                            mode="modal"
                            fallbackRedirectUrl={'/hackathons'}
                            signUpForceRedirectUrl={'/account-setup'}
                        >
                            <span className="inline-flex items-center gap-2">
                                <span>Sign in</span>
                                <LogIn className="h-4 w-4" />
                            </span>
                        </SignInButton>
                    </button>
                )}
            </div>
        )
    }

    const signIn = () => {
        return (
            <button className="inline-flex items-center gap-2 border border-white text-white hover:text-amber-100 hover:border-amber-100 font-medium px-4 py-2 rounded-md transition-colors mt-2">
                <SignInButton mode="modal" fallbackRedirectUrl={'/hackathons'} signUpForceRedirectUrl={'/account-setup'}>
                    <span>Sign in</span>
                </SignInButton>
            </button>
        )
    }
    
    return (
        <header className="sticky top-0 z-10 bg-[#111119] px-4 shadow-sm">
            <div className="container mx-auto px-4 py-4 backdrop-blur-md flex justify-between items-center rounded-full">
                {getLogoSize('md')}

                <div className="flex items-center gap-4">
                    <div className="hidden md:block mx-10 space-x-10">
                        {isSignedIn ? navItems() : signIn()}
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
                                        href="/teams"
                                        className="flex items-center gap-2 rounded hover:bg-amber-100 hover:text-black justify-end"
                                    >
                                        <span>Teams</span>
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
