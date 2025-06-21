import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
    // BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { ChevronRightIcon, MoreVerticalIcon, PencilIcon } from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuContext,
    DropdownMenuContent
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";


interface Props {
            agentId: string;
            agentName: string;
            onEdit: ()=> void ;
            onRemove: ()=> void ;
}

export const AgentIdViewHeader = ({
    agentId,
    agentName,
    onEdit,
    onRemove
}: Props) => {
    return(
        <div className="flex items-center justify-between">
            <Breadcrumb>
                 <BreadcrumbList>
                   <BreadcrumbItem>
                      <BreadcrumbLink asChild className="font-medium text-xl">
                         <Link href="/agents">
                                My Agents
                         </Link>
                       </BreadcrumbLink>
                    </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-foreground text-xl font-medium [&svg]">
                      <ChevronRightIcon/>
                  </BreadcrumbSeparator>
                 <BreadcrumbItem>
                      <BreadcrumbLink asChild className="font-medium text-xl text-foreground">
                       <Link href={`/agents/${agentId}`}>
                         {agentName} 
                        </Link>
                      </BreadcrumbLink>
                 </BreadcrumbItem>
             </BreadcrumbList>
         </Breadcrumb>
            {/*  Without modal={false}, the dialog that this dropdown opens cause the website to get unclickable */}
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                        <MoreVerticalIcon/>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={onEdit}>
                            <PencilIcon className="size-4 text-black"/>
                            Edit
                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={onRemove}>
                            <PencilIcon className="size-4 text-black"/>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}