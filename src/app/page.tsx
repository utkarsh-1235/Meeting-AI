"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";


export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

    const { 
        data: session, 
    } = authClient.useSession() 

  const onsubmit = async()=>{
   await authClient.signUp.email({
        email, // user email address
        password, // user password -> min 8 characters by default
        name, // user display name
    }, {
       
        onSuccess: () => {
            window.alert("Success")
        },
        onError: () => {
            // display the error message
            window.alert("Something went wrong")
        },
});

  }

  if(session){
  return (
    <div className="flex flex-col p-4 gap-y-4">
      <p>Logged in as {session.user.name}</p>
      <Button onClick={() => authClient.signOut()}>
        Sign out
      </Button>
    </div>
  )
}

  const onLogin = async()=>{
   await authClient.signIn.email({
        email, // user email address
        password, // user password -> min 8 characters by default
    }, {
       
        onSuccess: () => {
            window.alert("Success")
        },
        onError: () => {
            // display the error message
            window.alert("Something went wrong")
        },
});
  }
  return (
    <div className="flex flex-col p-4 gap-y-4">
    <div className="flex flex-col gap-4">
      <Input placeholder="name" value={name} onChange={(e)=>setName(e.target.value)}/>
      <Input placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
      <Input placeholder="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
      <Button onClick={onsubmit}>SignUp</Button>
    </div>
     <div className="flex flex-col gap-4">
      <Input placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
      <Input placeholder="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
      <Button onClick={onLogin}>Login</Button>
    </div>
    {/* <SignUp/> */}
    </div>
  );
}
