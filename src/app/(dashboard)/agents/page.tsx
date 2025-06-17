import { AgentsView, AgentsViewError, AgentsViewLoading } from "@/modules/agents/ui/views/agent-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
const Page = () => {
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());

 return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AgentsViewLoading/>}>
        <ErrorBoundary errorComponent={AgentsViewError}>
 <AgentsView/>
 </ErrorBoundary>
 </Suspense>
 </HydrationBoundary>
 )
}

export default Page;