"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { IconHamMenu } from "@/components/icons";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "About", href: "/about" },
  { label: "Find Consultant", href: "/find-consultant" },
  { label: "Lorem", href: "/lorem" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F3F5F9] lg:border-b lg:bg-background">
      <div className="container flex mx-auto px-4 lg:px-5 h-16 items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/">
            <Image src="/assets/logo.svg" alt="Logo" width={40} height={40} />
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href
                    ? "text-foreground font-medium"
                    : "text-foreground/60"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/sign-in">
            <Button variant="secondary" className="text-sm rounded-full">
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="text-white text-sm">Sign Up</Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button size={"icon"} className="rounded-full">
              <IconHamMenu className="h-6 w-6 stroke-white" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="top"
            className="h-full w-full border-b-0 space-y-6 px-4 bg-[#0B3D72]"
          >
            <div className="flex items-center justify-between  py-3">
              <Image src="/assets/logo.svg" alt="Logo" width={40} height={40} />
              <Button
                size="icon"
                className="rounded-xs h-7"
                onClick={() => setOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-x"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <div className="flex flex-col text-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-base transition-colors hover:text-white/80",
                    pathname === item.href
                      ? "text-white/60"
                      : "text-white"
                  )}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col  space-y-8">
                <Link href="/sign-up" onClick={() => setOpen(false)}>
                  <Button className="w-full inline-block text-white">
                    Sign Up
                  </Button>
                </Link>
                <Link href="/sign-in" onClick={() => setOpen(false)}>
                  <Button
                    variant={"secondary"}
                    className="w-full inline-block rounded-full"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
