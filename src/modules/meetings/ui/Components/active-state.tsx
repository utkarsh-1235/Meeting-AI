import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {VideoIcon } from "lucide-react";

interface Props{
    meetingId: string;
}
export const ActiveState = ({
    meetingId,
}:Props) => {
    return (
            <div className="flex flex-col items-center bg-white rounded-lg px-4 py-5 gap-y-8">
                <EmptyState
                image="/upcoming.svg"
                title="Meeting is active"
                description="Meeting will end once all participants have left"
                isActive={true}/>
                <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
                    <Button asChild className="w-full lg:w-auto">
                        <Link href={`/call/${meetingId}`}>
                        <VideoIcon/>
                        Join meeting
                        </Link>
                    </Button>
                </div>
                </div>
    )
}