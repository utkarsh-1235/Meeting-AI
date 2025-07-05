"use client";

import { Separator } from "@/components/ui/separator";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton

} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { BotIcon, VideoIcon, StarIcon, Video } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardUserButton } from "./dashboard-user-button";
import { useRouter } from "next/navigation";
import { DashboardTrial } from "./dashboard-trial";

const firstSection = [
    {
        icon: VideoIcon,
        label: "Meetings",
        href: "/meetings"
    },
    {
        icon: BotIcon,
        label: "Agents",
        href: "/agents"
    }
]

const secondSection = [
    {
        icon: StarIcon,
        label: "Upgrade",
        href: "/upgrade"
    }
]

export const DashboardSidebar = () =>{
    const pathname = usePathname();
    const router = useRouter();
    return (
        <Sidebar>
            <SidebarHeader className="text-sidebar-accent-foreground">
                <Link href="/" className="flex items-center gap-2 px-2 pt-2">
                <Video className="bg-gradient-to-r from-green-600 to-green-800 text-white border-xl rounded px-2 py-1" height={36} width={36}/>
                <p className="text-2xl font-semibold">Meet.AI</p>
                </Link>
            </SidebarHeader>
            <div className="px-4 py-2">
                <Separator className="opacity-10 text-[#5D6B68]"/>
            </div>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                firstSection.map((item) => (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton 
                                        className={cn(
                                            "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                                            pathname === item.href && "bg-linear-to-r/oklch border-[#5D6B68]/10"
                                        )}
                                        isActive={pathname === item.href}
                                        onClick={()=>router.push(item.href)}>
                                            {/* <Link href={item.href}></Link> */}
                                            <item.icon className="size-5"/>
                                            <span className="text-sm font-medium tracking-tight">{item.label}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <div className="px-4 py-2">
                <Separator className="opacity-10 text-[#5D6B68]"/>
            </div>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                secondSection.map((item) => (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton 
                                        className={cn(
                                            "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                                            pathname === item.href && "bg-linear-to-r/oklch border-[#5D6B68]/10"
                                        )}
                                        isActive={pathname === item.href}
                                        onClick={() => router.push(item.href)}>
                                            {/* <Link href={item.href}></Link> */}
                                            <item.icon className="size-5"/>
                                            <span className="text-sm font-medium tracking-tight">{item.label}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="text-white">
                <div className="p-2">
                <DashboardTrial/>
               <DashboardUserButton/> 
               </div>
            </SidebarFooter>
        </Sidebar>
    )
}