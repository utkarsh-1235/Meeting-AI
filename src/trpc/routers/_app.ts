// import { z } from 'zod';
import { agentRouter } from '@/modules/agents/server/procedures';
import { createTRPCRouter } from '../init';
import { meetingsRouter } from '@/modules/meetings/server/procedure';
import { premiumRouter } from '@/modules/premium/server/procedure';

export const appRouter = createTRPCRouter({
  agents: agentRouter,
  meetings: meetingsRouter,
  premium: premiumRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;