import { z } from "zod";

export const createProductSchemaV2 = z.object({
    body: z.object({
        name: z
            .string({ required_error: "Product name is required" }),
        description: z
            .string()
            .optional(),
        price: z
            .number({ required_error: "Product price is required" })
            .min(0, { message: "Product price cannot be negative" }),
        quantity_available: z
            .number({ required_error: "Product stock is required" })
            .min(0, { message: "Product stock cannot be negative" }),
        category_id: z
            .string()
            .uuid()
            .optional(),
    })
})