import { PropsWithChildren } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { auth } from "@/server/auth";

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    redirect("/signin");
  }
  // if user is not active or not promoted (to user or admin), redirect to /welcome
  if (!["user", "admin"].includes(session.user.role) || !session.user.active) {
    redirect("/welcome");
  }
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  return (
    <>
      <SidebarProvider defaultOpen={defaultOpen}>
        <DashboardSidebar />
        <section>{children}</section>
      </SidebarProvider>
    </>
  );
}
