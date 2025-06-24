import { CommandSelect } from "@/components/ui/command-select";
import { meetingStatus } from "../../type";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { CircleCheckIcon, CircleXIcon, ClockArrowUpIcon, LoaderIcon, VideoIcon } from "lucide-react";

const options = [
    {
        id: meetingStatus.Upcoming,
        value: meetingStatus.Upcoming,
        children: (
            <div className="flex item-center gap-x-2 capitalize">
                <ClockArrowUpIcon/>
                {meetingStatus.Upcoming}
            </div>
        )
    },
    {
        id: meetingStatus.Completed,
        value: meetingStatus.Completed,
        children: (
            <div className="flex item-center gap-x-2 capitalize">
                <CircleCheckIcon/>
                {meetingStatus.Completed}
            </div>
        )
    },
    {
        id: meetingStatus.Active,
        value: meetingStatus.Active,
        children: (
            <div className="flex item-center gap-x-2 capitalize">
                <VideoIcon/>
                {meetingStatus.Active}
            </div>
        )
    },
    {
        id: meetingStatus.Processing,
        value: meetingStatus.Processing,
        children: (
            <div className="flex item-center gap-x-2 capitalize">
                <LoaderIcon/>
                {meetingStatus.Processing}
            </div>
        )
    },
    {
        id: meetingStatus.Cancelled,
        value: meetingStatus.Cancelled,
        children: (
            <div className="flex item-center gap-x-2 capitalize">
                <CircleXIcon/>
                {meetingStatus.Cancelled}
            </div>
        )
    }
]

export const StatusFilter = () => {
    const [filters, setFilters] = useMeetingsFilters();
    return(
        <CommandSelect
            placeholder="Status"
            className="h-9"
            options={options}
            onSelect={(value) => setFilters({status: value as meetingStatus})}
            value={filters.status ?? ""}
        />
    )
}