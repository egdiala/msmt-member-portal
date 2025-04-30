import { Button } from "@/components/ui";
import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="flex justify-between items-center px-5 md:px-12 py-2 bg-blue-400 md:py-5 w-full sticky z-50 top-0 left-0 right-0">
      <Image src="/assets/logo.svg" alt="Logo" width={40} height={40} />

      <div className="flex items-center gap-x-6">
        <Button asChild variant="secondary" className="shadow-none">
          <Link href="/sign-in">Sign in</Link>
        </Button>

        <Button>
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </div>
    </header>
  );
};
