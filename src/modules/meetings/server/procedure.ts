import { db } from "@/db";
import {agents, meetings, user} from "@/db/schema";
import {createTRPCRouter, protectedProcedure} from "@/trpc/init";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike, inArray, sql} from "drizzle-orm"; // Add this import
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { TRPCError } from "@trpc/server";
import { meetingsInsertSchema, meetingsUpdateSchema } from "../schma";
import { meetingStatus, StreamTranscriptItem } from "../type";
import { streamVideo } from "@/lib/stream-video";
import { generatedAvatarUri } from "@/lib/avatar";
import JSONL from "jsonl-parse-stringify";
import { streamChat } from "@/lib/stream-chat";
// import { botttsNeutral } from "@dicebear/collection";

// import { TRPCError } from "@trpc/server";
// const streamChat = new StreamChat("gk2r2ur6r8g3", "k7jtu2xtj5swyh3pcwk2mmz4zhmgwt7jrwn3g254uq8k46aw8yhj8syq8qzqy93u");

export const meetingsRouter = createTRPCRouter({
    generateChatToken: protectedProcedure.mutation(async ({ ctx }) => {
        try{
            const token = streamChat.createToken(ctx.auth.user.id);

        await streamChat.upsertUser({
            id: ctx.auth.user.id,
            role: "admin",
        })

        if(!token){
           throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Token generation failed.",
        }); 
        }
        return {token} ;
        }
        catch(err){
            console.log(err);
        }
        
    }),
    getTranscript: protectedProcedure
                   .input(z.object({id: z.string()}))
                   .query(async({input, ctx})=>{

                    const [existingMeeting] = await db
                                            .select()
                                            .from(meetings)
                                            .where(
                                                and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
                                            );

                                            if(!existingMeeting){
                                               throw new TRPCError({
                                                code: "NOT_FOUND",
                                                message: "Meeting not found",
                                               })
                                            }
                                         if(!existingMeeting.transcriptUrl){
                                            return [];
                                         }

                        const transcript = await fetch(existingMeeting.transcriptUrl)
                        .then((res) => res.text())
                        .then((text) => JSONL.parse<StreamTranscriptItem>(text))
                        .catch(() => {
                            return [];
                        })

                        const speakerIds = [
                            ...new Set(transcript.map((item) => item.speaker_id)),
                        ]
                const userSpeakers = await db
                                     .select()
                                     .from(user)                     
                                     .where(inArray(user.id, speakerIds))
                                     .then((users) => 
                                        users.map((user) =>({
                                      ...user, 
                                      image:
                                        user.image ??
                                        generatedAvatarUri({seed: user.name, variant: "initials"})
                                     })))

                const agentSpeakers = await db
                                     .select()
                                     .from(agents)                     
                                     .where(inArray(agents.id, speakerIds))
                                     .then((agents) => 
                                        agents.map((agent) =>({
                                      ...agent, 
                                      image: generatedAvatarUri({seed: agent.name, variant: "initials"})
                                     })));                                      
                const speakers = [...userSpeakers, ...agentSpeakers];

                const transcriptWithSpeakers = transcript.map((item) => {
                     const speaker = speakers.find(
                        (speaker) => speaker.id === item.speaker_id
                     );
                     if(!speaker){
                    return {
                        ...item,
                        user: {
                           name: "Unknown",
                           image: generatedAvatarUri({
                              seed: "Unknown",
                              variant: "initials"
                           })
                        }
                    }
                }

                return {
                    ...item,
                    user: {
                        name: speaker.name,
                        image: speaker.image,
                    },
                }
                })
                return transcriptWithSpeakers;
                
                   }),
    generateToken: protectedProcedure.mutation(async({ctx}) => {
        await streamVideo.upsertUsers([
            {
                id: ctx.auth.user.id,
                name: ctx.auth.user.name,
                role: "admin",
                image:
                ctx.auth.user.image ??
                generatedAvatarUri({seed: ctx.auth.user.name, variant: "initials"}),
            }
        ])
        const expirationTime = Math.floor(Date.now() / 1000) + 3600; //1 hour
        const issuedAt = Math.floor(Date.now() / 1000) - 60;
        const token = streamVideo.generateUserToken({
            user_id: ctx.auth.user.id,
            exp: expirationTime,
            validity_in_seconds: issuedAt
        })
         if (!token) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Token generation failed.",
        });
    }

    return { token };
    }),
    remove: protectedProcedure.input(z.object({id: z.string()})).mutation(async({ input, ctx })=>{
            const [removeMeeting] = await db
            .delete(meetings)
            .where(
                and(
                    eq(meetings.id, input.id),
                    eq(meetings.userId, ctx.auth.user.id),))
            .returning();   
    
            if(!removeMeeting){
                throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found"});
            }
     
        // await new Promise((resolve) => setTimeout(resolve, 5000));
        // throw new TRPCError({code: "BAD_REQUEST"});
            
            return removeMeeting;
        }),
    update: protectedProcedure.input(meetingsUpdateSchema).mutation(async({ input, ctx })=>{
            const [updateMeeting] = await db
            .update(meetings)
            .set(input)
            .where(
                and(
                    eq(meetings.id, input.id),
                    eq(meetings.userId, ctx.auth.user.id)))
            .returning();   
    
            if(!updateMeeting){
                throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found"});
            }
     
        // await new Promise((resolve) => setTimeout(resolve, 5000));
        // throw new TRPCError({code: "BAD_REQUEST"});
            
            return updateMeeting;
        }),

    create: protectedProcedure
                 .input(meetingsInsertSchema)
                 .mutation(async({input, ctx}) => {
                    const [createdMeeting] = await db
                                            .insert(meetings)
                                            .values({
                                                ...input,
                                                userId: ctx.auth.user.id,
                                            })
                                            .returning();

                                            // TODO: Create Stream Call, Upsert Stream Users
                const call = streamVideo.video.call("default", createdMeeting.id);
                await call.create({
                    data: {
                        created_by_id: ctx.auth.user.id,
                        custom: {
                            meetingId: createdMeeting.id,
                            meetingname: createdMeeting.name,
                        },
                        settings_override: {
                            transcription: {
                                language: 'en',
                                mode: 'auto-on',
                                closed_caption_mode: "auto-on"
                            },
                            recording: {
                                mode: "auto-on",
                                quality: "1080p"
                            }
                        },
                    }
                })

                const [existingAgent] = await db 
                                        .select()
                                        .from(agents)
                                        .where(eq(agents.id, createdMeeting.agentId))

                if(!existingAgent){
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Agent not found"
                    });

                await streamVideo.upsertUsers([
                    {
                        id: existingAgent.id,
                        name: existingAgent.name,
                        role: "user",
                        image: generatedAvatarUri({
                            seed: existingAgent.name,
                            variant: "botttsNeutral",
                        })
                    }
                ])
                }
                 return createdMeeting;
                 }),
    getOne: protectedProcedure.input(z.object({id: z.string()})).query(async({ input, ctx })=>{
        const [existingMeeting] = await db
        .select({
            ...getTableColumns(meetings),
            agent: agents,
            duration: sql<number>`Extract(EPOCH FROM (ended_at - started_at))`.as("duration"),
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
            and(
                eq(meetings.id, input.id),
                eq(meetings.userId, ctx.auth.user.id)));

        if(!existingMeeting){
            throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found"});
        }
    
 
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    // throw new TRPCError({code: "BAD_REQUEST"});
        
        return existingMeeting;
    }),
    getMany: protectedProcedure
             .input(z.object({
                page: z.number().default(DEFAULT_PAGE),
                pageSize: z
                          .number()
                          .min(MIN_PAGE_SIZE)
                          .max(MAX_PAGE_SIZE)
                          .default(DEFAULT_PAGE_SIZE),
                search: z.string().nullish(),
                agentId: z.string().nullish(),
                status: z.enum([
                    meetingStatus.Upcoming,
                    meetingStatus.Active,
                    meetingStatus.Completed,
                    meetingStatus.Processing,
                    meetingStatus.Cancelled
                ]).nullish(),
             }))
             .query(async({ctx, input})=>{
            const {search, page, pageSize, status, agentId} = input;

        const data = await db
        .select({
             ...getTableColumns(meetings),
             agent: agents,
             duration: sql<number>`Extract(EPOCH FROM (ended_at - started_at))`.as("duration"),
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
            and(
                eq(meetings.userId, ctx.auth.user.id),
                search ? ilike(meetings.name, `%${search}%`) : undefined,
                status ? eq(meetings.status, status) : undefined,
                agentId ? eq(meetings.agentId, agentId) : undefined
            )
        )
        .orderBy(desc(meetings.createdAt), desc(meetings.id))   
        .limit(pageSize)
        .offset((page - 1) * pageSize)
 
        const [total] = await db
                     .select({count: count()})
                     .from(meetings)
                     .where(
                        and(
                             eq(meetings.userId, ctx.auth.user.id),
                             search ? ilike(meetings.name, `%${search}%`) : undefined,
                             status ? eq(meetings.status, status) : undefined,
                             agentId ? eq(meetings.agentId, agentId) : undefined
                        )
                     );

         const totalPages = Math.ceil(total.count / pageSize) ;
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    // throw new TRPCError({code: "BAD_REQUEST"});
        
        return {
            items: data,
            total: total.count,
            totalPages,
        };
    }),
})