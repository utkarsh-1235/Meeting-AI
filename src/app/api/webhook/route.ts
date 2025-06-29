import {and, eq} from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";
import {
    CallEndedEvent,
    // CallTranscriptionReadyEvent,
    // CallRecordingStartedEvent,
    CallSessionParticipantLeftEvent,
    CallSessionStartedEvent
} from "@stream-io/node-sdk";

import {db} from "@/db";
import {agents, meetings} from "@/db/schema";
import { streamVideo} from "@/lib/stream-video";

function verifySignatureWithSDK(body: string, signature: string): boolean {
    return streamVideo.verifyWebhook(body, signature);
}


export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-signature");
  const apiKey = req.headers.get("x-api-key");

  if (!signature || !apiKey) {
    return NextResponse.json({ error: "Missing signature or API key" }, { status: 400 });
  }

  const rawBody = await req.text();

  if (!verifySignatureWithSDK(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = payload?.type;

  if (eventType === "call.session_started") {
    const event = payload as unknown as CallSessionStartedEvent;
    const meetingId = event.call.custom?.meetingId;

    if (!meetingId) {
      return NextResponse.json({ error: "missing meetingId" }, { status: 400 });
    }

    const [existingMeeting] = await db
      .select()
      .from(meetings)
      .where(
        // and(
                eq(meetings.id, meetingId),
                // not(eq(meetings.status, "completed")),
                // not(eq(meetings.status, "active")),
                // not(eq(meetings.status, "cancelled")),
                // not(eq(meetings.status, "processing")),
            // )
        );

    if (!existingMeeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    await db
      .update(meetings)
      .set({
        status: "active",
        startedAt: new Date(),
      })
      .where(eq(meetings.id, existingMeeting.id));

    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, existingMeeting.agentId));

    if (!existingAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const call = streamVideo.video.call("default", meetingId);

    const realtimeClient = await streamVideo.video.connectOpenAi({
      call,
      openAiApiKey: process.env.OPENAI_API_KEY!,
      agentUserId: existingAgent.id,
    });
   console.log("✅ AI connected:", realtimeClient);
   
//     await realtimeClient.updateSession({
//       instructions: existingAgent.instructions?.trim().length
//   ? existingAgent.instructions
//   : "You're a helpful AI assistant for meetings.",

//     });
    realtimeClient.updateSession({
        instructions: existingAgent.instructions,
    })
  } else if (eventType === "call.session_participant_left") {
    const event = payload as unknown as CallSessionParticipantLeftEvent;
    const meetingId = event.call_cid.split(":")[1];

    if (!meetingId) {
      return NextResponse.json({ error: "missing meetingId" }, { status: 400 });
    }

    const call = streamVideo.video.call("default", meetingId);
    await call.end();
    // return NextResponse.json({ status: "ended" });
  }else if(eventType === "call.session_ended"){
    const event = payload as unknown as CallEndedEvent;
    const meetingId = event.call.custom?.meetingId;

     if (!meetingId) {
      return NextResponse.json({ error: "missing meetingId" }, { status: 400 });
    }

    await db
      .update(meetings)
      .set({
        status: "processing",
        startedAt: new Date(),
      })
      .where(and(eq(meetings.id, meetingId), eq(meetings.status, "active")));
  }

  return NextResponse.json({ status: "ok" });
}
