import * as z from "zod"

export const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

export const signUpSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  dateOfBirth: z.string().refine(
    (date) => {
      const parsedDate = new Date(date)
      const today = new Date()
      const minAge = new Date()
      minAge.setFullYear(today.getFullYear() - 18)
      return !isNaN(parsedDate.getTime()) && parsedDate <= minAge
    },
    { message: "You must be at least 13 years old" },
  ),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  terms: z.boolean().refine((value) => value === true, {
    message: "You must accept the terms and conditions",
  }),
})

export const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

export const verifyEmailSchema = z.object({
  otp: z
    .string()
    .min(6, { message: "Please enter the complete verification code" })
    .max(6, { message: "Verification code must be 6 digits" })
    .regex(/^\d+$/, { message: "Verification code must contain only numbers" }),
})

