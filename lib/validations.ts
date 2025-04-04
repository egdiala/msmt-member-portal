import * as z from "zod";

export const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
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

export const signUpSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  dateOfBirth: z
    .date({
      required_error: "Date of birth is required",
    })
    .refine((date) => {
      const today = new Date();
      const eighteenYearsAgo = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );
      return date <= eighteenYearsAgo;
    }, "You must be at least 18 years old"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export const profileSecuritySchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const profileDetailsSchema = z.object({
  preferredName: z
    .string()
    .min(2, "Preferred name must be at least 2 characters"),
  phoneNumber: z.string().min(8, "Phone number must be at least 8 characters"),
  religion: z.string().min(2, "Religion must be at least 2 characters"),
  gender: z.string().min(2, "Gender name must be at least 2 characters"),
  maritalStatus: z
    .string()
    .min(2, "Marital status must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  preferredLanguage: z
    .string()
    .min(2, "Preferred language must be at least 2 characters"),
});

export const contactPersonDetailsSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phoneNumber: z.string().min(8, "Phone number must be at least 8 characters"),
  email: z.string().email("Please enter a valid email address"),
  relationship: z.string().min(2, "Relationship must be at least 2 characters"),
});

export const addMemberSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  relationship: z.string().min(2, "Relationship must be at least 2 characters"),
  isAbove18: z.boolean(),
});

export const removeMemberSchema = z.object({
  reason: z.string().min(2, "Reason must be at least 2 characters"),
});
