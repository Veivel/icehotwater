import { BadRequestResponse } from '@src/shared/commons/patterns'
import { z } from 'zod'

export const registerSchemaV2 = z.object({
    body: z.object({
        username: z.string(),
        email: z.string().email(),
        password: z.string().min(8).refine((password) => {
            const regex = [
                {
                    regex: /[a-z]/,
                    errorMessage: 'Password must contain at least one lowercase letter',
                },
                {
                    regex: /[A-Z]/,
                    errorMessage: 'Password must contain at least one uppercase letter',
                },
                {
                    regex: /\d/,
                    errorMessage: 'Password must contain at least one number',
                },
            ]

            return regex.every((reg) => {
                if (!reg.regex.test(password)) {
                    return false
                }
                return true;
            })
        }, "Invalid password"),
        full_name: z.string(),
        address: z.string(),
        phone_number: z.string().refine((phone_number) => {
            const regex = [
                {
                    regex: /[0-9]/,
                    errorMessage: 'Phone number must be numeric',
                },
            ]

            return regex.every((reg) => {
                if (!reg.regex.test(phone_number)) {
                    return false
                }
                return true;
            })
        }, "Invalid phone number"),
    })
})