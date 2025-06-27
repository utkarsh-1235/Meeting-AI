import { EmptyState } from "@/components/ui/empty-state";

export const ProcessingState = () => {
    return (
            <div className="flex flex-col items-center bg-white rounded-lg px-4 py-5 gap-y-8">
                <EmptyState
                image="/processing.svg"
                title="Meeting completed"
                description="This meeting was completed summary will appear soon"
                isActive={true}/>

                </div>
    )
}