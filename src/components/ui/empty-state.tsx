import { AlertCircleIcon} from "lucide-react";
import Image from "next/image";

interface Props {
    title: string;
    description: string;
    image?: string;
    isActive: boolean
}

export const EmptyState = ({
    title,
    description,
    image="/empty.svg",
    isActive
}: Props) => {
    return (
        <div className="flex flex-col items-center justify-center">
               <Image src={image} alt="Empty" width={240} height={240} className="text-muted-foreground"/>
             {!isActive  &&  <AlertCircleIcon className="size-6 text-red-500"/>}
                <div className="flex flex-col gap-y-6 max-w-medium mx-auto text-center">
                    <h6 className="text-lg font-medium">{title}</h6>
                    <p className="text-sm">{description}</p>
                </div>
               
        </div>
    )
}