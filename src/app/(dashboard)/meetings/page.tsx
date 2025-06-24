import { auth } from "@/lib/auth";
import { MeetingListheader } from "@/modules/meetings/ui/Components/meeting-list-header";
import { MeetingsView, MeetingsViewError, MeetingsViewLoading } from "@/modules/meetings/ui/views/MeetingsView";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { loaderSearchParams } from "@/modules/meetings/params";
import { SearchParams } from "nuqs/server";

interface Props {
    searchParams: Promise<SearchParams>;
}

const Page = async({ searchParams}: Props) => {
    const filters = await loaderSearchParams(searchParams);
    const session = await auth.api.getSession({
            headers: await headers()
        })
      
        if(!session){
          redirect("/sign-in")
        }
    
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.meetings.getMany.queryOptions({
           ...filters
        })
    )
    return(
        <>
        <MeetingListheader/>
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<MeetingsViewLoading/>}>
                <ErrorBoundary fallback={<MeetingsViewError/>}>
            <MeetingsView/>
            </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
        </>
    )
}

export default Page;