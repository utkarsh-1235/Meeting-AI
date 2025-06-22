"use client";

import { DataTable } from "@/components/ui/data-table";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { columns } from "../Components/columns";
import { EmptyState } from "@/components/ui/empty-state";

export const MeetingsView = () => {
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));

    const router = useRouter();

    return(
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
          <DataTable data={data.items} columns={columns} onRowClick={(row)=>router.push(`/agents/${row.id}`)}/> 
            {data.items.length === 0 && (
                                <EmptyState
                                 title="Create your first meeting"
                                 description="Schedule a meeting to connect with others"/>
                            )} 
        </div>
    );
};

export const MeetingsViewLoading = () => {
    return (
        <LoadingState
         title="Loading Meetings"
         description="This may take a few seconds"/>
    )
}

export const MeetingsViewError = () => {
  return(
    <ErrorState
            title="Error Loading Meetings"
            description="Something went wrong"/>
  )
}