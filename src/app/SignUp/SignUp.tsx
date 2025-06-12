import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";

export default function SignUp(){
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div><Button>Sign Up</Button></div>
            <div><Video className="mx-auto h-12 w-12 text-indigo-600 mb-4" /></div>
        </div>
    )
}