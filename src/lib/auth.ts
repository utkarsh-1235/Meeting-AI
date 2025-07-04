import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";  
import {polar, checkout, portal} from "@polar-sh/better-auth";
import * as schema from "@/db/schema";
 import { polarClient } from "./polar";


export const auth = betterAuth({
    plugins: [
       polar({
          client: polarClient,
          createCustomerOnSignUp: true,
          use: [
            checkout({
                authenticatedUsersOnly: true,
                successUrl: "/upgrade",
            }),
            portal(),
          ]
       })
    ],
    socialProviders: {
        google: { 
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
        github: { 
            clientId: process.env.GITHUB_CLIENT_ID as string, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
        }
    },
    emailAndPassword: {  
        enabled: true
    },
     database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema: {
            ...schema,
        }
    })
})