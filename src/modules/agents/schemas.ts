import {z} from "zod";

export const agenstsInsertSchema = z.object({
    name: z.string().min(1, {message: "Name is required"}),
    instructions: z.string().min(1, {message: "Instructions is required"})
})

export const agentsUpdateSchema = agenstsInsertSchema.extend({
    id: z.string().min(1, {message: "Id is required"}),
});