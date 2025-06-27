import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BanIcon, VideoIcon } from "lucide-react";

interface Props{
    meetingId: string;
    onCancelMeeting: () => void;
    isCancelling: boolean;
}
export const UpcomingState = ({
    meetingId,
    onCancelMeeting,
    isCancelling
}:Props) => {
    return (
            <div className="flex flex-col items-center bg-white rounded-lg px-4 py-5 gap-y-8">
                <EmptyState
                image="/upcoming.svg"
                title="Not started yet"
                description="Once you start this meeting, a summary will appear here"
                isActive={true}/>
                <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
                    <Button 
                    variant="secondary"
                    className="w-full lg:w-auto"
                    onClick={onCancelMeeting}
                    disabled={isCancelling}>
                        <BanIcon/>
                        Cancel meeting
                    </Button>
                    <Button disabled={isCancelling} asChild className="w-full lg:w-auto">
                        <Link href={`/call/${meetingId}`}>
                        <VideoIcon/>
                        Start meeting
                        </Link>
                    </Button>
                </div>
                </div>
    )
}