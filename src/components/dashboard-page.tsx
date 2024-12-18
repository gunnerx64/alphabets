"use client";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "./ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ThemeToggleButton } from "@/components/theme-toggle-button";

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
  // const router = useRouter();

  return (
    <SidebarInset>
      <header className="ml-4 mr-8 mt-4 flex shrink-0 flex-col items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 md:flex-row md:justify-between">
        <div className="flex w-full items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {hideBackButton ? null : (
                <>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/dashboard" className="text-2xl">
                      Главная
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                </>
              )}

              <BreadcrumbItem>
                <BreadcrumbPage className="text-2xl">{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex w-fit items-center justify-end gap-4">
          {cta && (
            <>
              <div>{cta}</div>
              <Separator
                orientation="vertical"
                className="hidden h-8 md:inline-block"
              />
            </>
          )}
          <div className="hidden md:inline-block">
            <ThemeToggleButton />
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col overflow-y-auto p-6 sm:p-8">
        {children}
      </div>
    </SidebarInset>
  );
};
