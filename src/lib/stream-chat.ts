import "server-only";
import {StreamChat} from "stream-chat";


const apiKey = process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY!;
const apiSecret = process.env.STREAM_CHAT_SECRET_KEY;

console.log("StreamChat ENV:", {
  apiKey,
  apiSecret: apiSecret ? "defined" : "missing"
});

if (!apiKey || !apiSecret) {
  throw new Error("Missing Stream Chat credentials");
}

export const streamChat = StreamChat.getInstance(apiKey, apiSecret);
// export const streamChat = StreamChat.getInstance(
//     process.env.STREAM_CHAT_API_KEY!,
//     process.env.STREAM_CHAT_SECRET_KEY!
// )