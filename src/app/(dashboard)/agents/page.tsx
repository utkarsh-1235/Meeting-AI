import { auth } from "@/lib/auth";
import { loaderSearchParams } from "@/modules/agents/params";
import { AgentsListheader } from "@/modules/agents/ui/components/agents-list-header";
import { AgentsView, AgentsViewError, AgentsViewLoading } from "@/modules/agents/ui/views/agent-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs";
import { Suspense } from "react";

interface Props {
  searchParams: Promise<SearchParams>
}
const Page = async({searchParams}: Props) => {

  const filters = await loaderSearchParams(searchParams);
  const session = await auth.api.getSession({
        headers: await headers()
    })
  
    if(!session){
      redirect("/sign-in")
    }
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({
      ...filters
    }));

 return (
  <>
  <AgentsListheader/>
    <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AgentsViewLoading/>}>
 <ErrorBoundary errorComponent={AgentsViewError}>
 <AgentsView/>
 </ErrorBoundary>
   </Suspense>
  </HydrationBoundary>
  </>
 )
}

export default Page;