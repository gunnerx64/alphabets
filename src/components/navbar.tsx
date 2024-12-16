import Link from "next/link";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { Button, buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { auth } from "@/server/auth";
import { SignOutButton } from "./sign-out-button";
import { ThemeToggleButton } from "./theme-toggle-button";

export const Navbar = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <nav className="sticky inset-x-0 top-0 z-[100] h-16 w-full border-b border-gray-200 backdrop-blur-lg transition-all dark:border-gray-700 dark:bg-slate-800">
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="z-40 flex font-semibold">
            <span className="text-xl/8 text-brand-700 dark:text-brand-500">
              Алфавитки
            </span>
          </Link>

          <div className="flex h-full items-center space-x-4">
            <ThemeToggleButton />
            {user ? (
              <>
                <SignOutButton />
                <div className="h-8 w-px bg-zinc-300 dark:bg-zinc-600" />
                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    size: "default",
                    className: "flex items-center gap-1",
                  })}
                >
                  Панель управления <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className={buttonVariants({
                    size: "default",
                    variant: "outline",
                  })}
                >
                  Войти
                </Link>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};
