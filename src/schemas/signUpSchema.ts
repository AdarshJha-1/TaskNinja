import { SignUp } from "@/types/SignUp"
import { z } from "zod";

export const signUpSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
    profileImageUrl: z.string()
})