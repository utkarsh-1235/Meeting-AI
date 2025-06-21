"use client";
import {useSuspenseQuery} from "@tanstack/react-query";
import {useTRPC} from "@/trpc/client";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { DataTable } from "../components/data-table";
import { columns} from "../components/columns";
import { EmptyState } from "@/components/ui/empty-state";
import { useAgentsFilters } from "@/modules/hooks/use-agents-filters";
import { DataPagination } from "../components/data-pagination";
import { useRouter } from "next/navigation";

export const AgentsView = () => {
    const router = useRouter();
    const [filters, setFilters] = useAgentsFilters();
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.agents.getMany.queryOptions({
        ...filters
    }));


    return(
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
                {/* {JSON.stringify(data, null, 2)} */}
                <DataTable data={data.items} columns={columns} onRowClick={(row)=>router.push(`/agents/${row.id}`)}/>
                <DataPagination
                 page={filters.page}
                 totalPages={data.totalPages}
                 onPageChange={(page) => setFilters({ page })}
                 />
                {data.items.length === 0 && (
                    <EmptyState
                     title="Create your first agent"
                     description="Create an agent to join your meetings"/>
                )}
        </div>
    )
}

export const AgentsViewLoading = () => {
    return (
        <LoadingState
         title="Loading Agents"
         description="This may take a few seconds"/>
    )
}

export const AgentsViewError = () => {
  return(
    <ErrorState
            title="Error Loading Agents"
            description="Something went wrong"/>
  )
}