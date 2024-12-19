"use client";
import { ReactNode } from "react";
import {
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { cn } from "@/lib/utils";

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
  const { isMobile, state } = useSidebar();
  return (
    <SidebarInset className="overflow-auto">
      <header
        className={cn(
          "fixed z-20 flex shrink-0 items-center justify-between gap-2 border-b bg-opacity-30 p-4 pb-2 backdrop-blur-lg backdrop-filter transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 sm:px-8",
          {
            "w-full": isMobile,
            "w-[calc(100%-var(--sidebar-width))]":
              !isMobile && state === "expanded",
            "w-[calc(100%-var(--sidebar-width-icon))]":
              !isMobile && state === "collapsed",
          },
        )}
      >
        <div className="flex w-full items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList className="text-xl">
              {hideBackButton ? null : (
                <>
                  <BreadcrumbItem className="hidden sm:block">
                    <BreadcrumbLink href="/dashboard" className="">
                      Главная
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden sm:block" />
                </>
              )}

              <BreadcrumbItem>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {/* <Separator orientation="vertical" className="h-8" /> */}
        <ThemeToggleButton />
      </header>

      <div className="mt-12 flex w-full items-center justify-center pt-6">
        {cta && cta}
      </div>

      <div className="mx-auto flex w-full flex-1 flex-col overflow-y-auto p-4 sm:p-8 sm:pt-4">
        {children}
      </div>
    </SidebarInset>
  );
};
