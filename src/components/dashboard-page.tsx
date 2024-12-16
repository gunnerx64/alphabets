"use client";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Heading } from "./heading";

interface DashboardPageProps {
  title: string;
  children?: ReactNode;
  hideBackButton?: boolean;
  cta?: ReactNode;
}

export const DashboardPage = ({
  title,
  children,
  cta,
  hideBackButton,
}: DashboardPageProps) => {
  const router = useRouter();

  return (
    <section className="flex h-full w-full flex-1 flex-col">
      <div className="flex w-full justify-between border-b border-gray-200 p-6 sm:p-8">
        <div className="flex w-full flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-8">
            {hideBackButton ? null : (
              <Button
                onClick={() => router.push("/dashboard")}
                className="w-fit"
                variant="outline"
              >
                <ArrowLeft className="size-4" />
              </Button>
            )}

            <Heading>{title}</Heading>
          </div>

          {cta ? <div className="w-full">{cta}</div> : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto p-6 sm:p-8">
        {children}
      </div>
    </section>
  );
};
