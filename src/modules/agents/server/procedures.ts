import { db } from "@/db";
import { agents } from "@/db/schema";
import {createTRPCRouter, baseProcedure} from "@/trpc/init";
// import { TRPCError } from "@trpc/server";

export const agentRouter = createTRPCRouter({
    getMany: baseProcedure.query(async()=>{
        const data = await db
        .select()
        .from(agents)
 
        // throw new TRPCError({ code: "BAD_REQUEST"});
        return data;
    })
})