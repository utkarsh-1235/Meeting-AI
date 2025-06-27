import { EmptyState } from "@/components/ui/empty-state";

export const CancelledState = () => {
    return (
            <div className="flex flex-col items-center bg-white rounded-lg px-4 py-5 gap-y-8">
                <EmptyState
                image="/cancelled.svg"
                title="Meeting cancelled"
                description="This meeting was cancelled"
                isActive={true}/>

                </div>
    )
}