"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Video } from "lucide-react"
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Alert, AlertTitle} from "@/components/ui/alert";
import { OctagonAlertIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    name: z.string().min(1, {message: "name is required"}),
    email: z.string().email(),
    password: z.string().min(1, { message: "Password is required" }),
    confirmPassword: z.string().min(1, {message: "Password is required"})
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
})


export const SignUpView = () => {
      const router = useRouter();
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const[pending, setPending] = useState(false);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    })

    const onsubmit = (data: z.infer<typeof formSchema>)=>{
        setError(null);
        setPending(true);
   authClient.signUp.email({
        name: data.name,
        email: data.email, // user email address
        password: data.password, 
    }, {
       
        onSuccess: () => {
            router.push("/");
            setPending(false);
        },
        onError: ({error}) => {
            setError(error.message);
            setPending(false);
        },
});
  }
  return(
    <div className="flex flex-col gap-6">
    <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
            <Form {...form}>
            <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onsubmit)}>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center text-center">
                        <h1 className="text-2xl font-bold">Let&apos;s get started</h1>
                        <p className="text-muted-foreground text-balance"> Create your account</p>
                    </div>
                     <div className="grid gap-3">
                        <FormField
                         control={form.control}
                         name="name"
                         render={({ field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                     type = "name"
                                     placeholder="John Doe"
                                     {...field}
                                     />
                                </FormControl>
                            </FormItem>
                         )}
                        />
                    </div>
                    <div className="grid gap-3">
                        <FormField
                         control={form.control}
                         name="email"
                         render={({ field}) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                     type = "email"
                                     placeholder="test@example.com"
                                     {...field}
                                     />
                                </FormControl>
                            </FormItem>
                         )}
                        />
                    </div>
                    <div className="grid gap-3">
                        <FormField
                         control={form.control}
                         name="password"
                         render={({ field}) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                     type = "password"
                                     placeholder="********"
                                     {...field}
                                     />
                                </FormControl>
                            </FormItem>
                         )}
                        />
                    </div>
                    <div className="grid gap-3">
                        <FormField
                         control={form.control}
                         name="confirmPassword"
                         render={({ field}) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input
                                     type = "confirmPassword"
                                     placeholder="********"
                                     {...field}
                                     />
                                </FormControl>
                            </FormItem>
                         )}
                        />
                    </div>
                    {
                        !!error && (
                            <Alert className="bg-destructive/10 border-none">
                                <OctagonAlertIcon className="h-4 w-4 !text-destuctive"/>
                                <AlertTitle>{error}</AlertTitle>
                            </Alert>
                        )
                    }
                    <Button
                     className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900"
                     type="submit"
                     disabled={pending}>
                        Sign up
                    </Button>
                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:flex after:items-center after:border-t">

                        <span className="bg-card text-muted-foreground relative z-10 px-2">Or continue with </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                         variant="outline"
                         type="button"
                        className="w-full"></Button>
                        <Button
                         variant="outline"
                         type="button"
                        className="w-full"></Button>
                    </div>
                    <div className="text-center text-sm">
                        Already have an account?{""}
                        <Link href="/sign-in" className="underline underline-offset-4">Sign in</Link>
                    </div>
                </div>
            </form>
             </Form>
            <div className="bg-radial from-green-700 to-green-900 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
                <Video className="h-[92px] w-[92px] text-white"/>
                <p className="text-2xl font-semibold text-white">Meet.AI</p>
            </div>
        </CardContent>
    </Card>
    <div className="text-muted-foregound *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
    </div>
    </div>
  )        
}

