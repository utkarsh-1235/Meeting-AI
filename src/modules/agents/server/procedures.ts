import { db } from "@/db";
import { agents } from "@/db/schema";
import {createTRPCRouter, baseProcedure, protectedProcedure} from "@/trpc/init";
import { agenstsInsertSchema } from "../schemas";
// import { TRPCError } from "@trpc/server";


export const agentRouter = createTRPCRouter({
    getMany: baseProcedure.query(async()=>{
        const data = await db
        .select()
        .from(agents)
    
 
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    // throw new TRPCError({code: "BAD_REQUEST"});
        
        return data;
    }),
    create: protectedProcedure
             .input(agenstsInsertSchema)
             .mutation(async({input, ctx}) => {
                const [ createdAgent] = await db
                                        .insert(agents)
                                        .values({
                                            ...input,
                                            userId: ctx.auth.user.id
                                        })
                                        .returning();
             return createdAgent;
             })
})