"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronsUpDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function TeamSwitcher({
  team,
}: {
  team: {
    name: string;
    logo: string; // path to image
    plan?: string;
  };
}) {
  const { isMobile } = useSidebar();

  if (!team) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden">
                <Image
                  src={team.logo}
                  alt={team.name}
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{team.name}</span>
                {team.plan && (
                  <span className="truncate text-xs text-muted-foreground">
                    {team.plan}
                  </span>
                )}
              </div>
              <ChevronsUpDown className="ml-auto opacity-50" size={16} />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {/* Optional dropdown content */}
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <div className="p-4 text-sm text-muted-foreground">
              Logged in as <strong>{team.name}</strong>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
