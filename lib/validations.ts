import * as z from "zod";

export const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const signUpSchema = z.object({
  organizationType: z.enum(["client", "provider"], {
    required_error: "Please select an organization type",
  }),
  providerType: z.string().optional().or(z.literal("")),
  organizationName: z.string().min(2, {
    message: "Organization name must be at least 2 characters",
  }),
  industryType: z.string().min(1, {
    message: "Please select an industry type",
  }),
  officeAddress: z.string().min(5, {
    message: "Please enter a valid address",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
  terms: z.boolean().refine((value) => value === true, {
    message: "You must accept the terms and conditions",
  }),
});

export const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export const setNewPasswordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  confirm_password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const verifyEmailSchema = z.object({
  otp: z
    .string()
    .min(6, { message: "Please enter the complete verification code" })
    .max(6, { message: "Verification code must be 6 digits" })
    .regex(/^\d+$/, { message: "Verification code must contain only numbers" }),
});
