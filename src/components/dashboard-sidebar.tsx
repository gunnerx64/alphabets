"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Calendar, GlobeLock, Search, Settings, User2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DashboardNavUser } from "./dashboard-nav-user";

const pathPrefix = "/dashboard";
const mainItems = [
  {
    title: "База алфавиток",
    url: pathPrefix,
    icon: Search,
  },
];
const statItems = [
  {
    title: "Новые алфавитки",
    url: pathPrefix + "/stats-creation",
    icon: Calendar,
  },
];
const adminItems = [
  {
    title: "Пользователи",
    url: pathPrefix + "/manage-users",
    icon: User2,
  },
  {
    title: "Регионы",
    url: pathPrefix + "/manage-regions",
    icon: GlobeLock,
  },
  {
    title: "Настройки системы",
    url: pathPrefix + "/manage-settings",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const { data: session } = useSession();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href={"/"}>
          <SidebarMenuButton className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-lg/8 font-semibold text-transparent dark:from-brand-500 dark:to-brand-600">
            <Image width={32} height={32} src={"/favicon.png"} alt="Logo" />
            Проект Алфавитки
          </SidebarMenuButton>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Главная</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroupLabel>Статистика</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {statItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          {session?.user.role === "admin" && (
            <>
              <SidebarGroupLabel>Администрирование</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </>
          )}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <DashboardNavUser
          name={session?.user.name as string}
          email={session?.user.email}
          avatar={/*session?.user.image ?? */ "/user-1.png"}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
