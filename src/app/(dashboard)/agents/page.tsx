import { LoadingState } from "@/components/ui/loading-state";
import { AgentsView, AgentsViewLoading } from "@/modules/agents/ui/views/agent-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
const Page = () => {
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());

 return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AgentsViewLoading/>}>
 <AgentsView/>
 </Suspense>
 </HydrationBoundary>
 )
}

export default Page;