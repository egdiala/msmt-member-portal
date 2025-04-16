import * as z from "zod";

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .refine(
    (password) => /[A-Z]/.test(password) && /[a-z]/.test(password),
    "Password must include both uppercase and lowercase letters"
  )
  .refine(
    (password) => /[0-9]/.test(password),
    "Password must include at least one number"
  )
  .refine(
    (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password),
    "Password must include at least one special character"
  );

export const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export const setNewPasswordSchema = z
  .object({
    password: passwordSchema,
    confirm_password: passwordSchema,
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export const verifyEmailSchema = z.object({
  otp: z
    .string()
    .min(5, { message: "Please enter the complete verification code" })
    .max(5, { message: "Verification code must be 5 digits" })
    .regex(/^\d+$/, { message: "Verification code must contain only numbers" }),
});

export const signUpSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  dob: z
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
  password: passwordSchema,
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
    .min(2, "Preferred name must be at least 2 characters")
    .optional(),
  phoneNumber: z
    .string()
    .min(8, "Phone number must be at least 8 characters")
    .optional(),
  religion: z
    .string()
    .min(2, "Religion must be at least 2 characters")
    .optional(),
  gender: z.string().min(2, "Gender must be at least 2 characters").optional(),
  maritalStatus: z
    .string()
    .min(2, "Marital status must be at least 2 characters")
    .optional(),
  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .optional(),
  preferredLanguage: z
    .string()
    .min(2, "Preferred language must be at least 2 characters")
    .optional(),
  avatar: z
    .any()
    .optional()
    .refine(
      (value) => {
        if (typeof value === "string") return true;

        if (value instanceof File) {
          return ["image/jpeg", "image/png"].includes(value.type);
        }

        return false;
      },
      {
        message: "Only JPEG, PNG images are allowed",
      }
    )
    .refine(
      (value) => {
        if (typeof value === "string") return true;
        if (value instanceof File) {
          return value.size <= 5 * 1024 * 1024;
        }

        return false;
      },
      {
        message: "File size must be less than 5MB",
      }
    ),
});

export const contactPersonDetailsSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .optional(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .optional(),
  phoneNumber: z
    .string()
    .min(8, "Phone number must be at least 8 characters")
    .optional(),
  email: z.string().email("Please enter a valid email address").optional(),
  relationship: z
    .string()
    .min(2, "Relationship must be at least 2 characters")
    .optional(),
});

export const ratingFormSchema = z.object({
  sessionRating: z.enum(["great", "neutral", "not-great"], {
    required_error: "Please select how your session was",
  }),
  heListens: z.boolean().optional(),
  feelBetter: z.boolean().optional(),
  starRating: z.number().min(1, "Please rate with at least 1 star").max(5),
  feedback: z.string().optional(),
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

export const appointmentQuestionnaireSchema = z.object({
  safePlace: z.string(),
  aloneWithSomeone: z.string(),
  experiencingFear: z.string(),
  everBeenInCounselling: z.string(),
  experiencingSadness: z.string(),
  reasonForSeekingHelp: z.array(z.string()),
  currentPhysicalHealthRate: z.string(),
  currentEatingHabits: z.string(),
  currentSleepingHabits: z.string(),
  employmentStatus: z.string(),
  alcoholIntakeFrequency: z.string(),
  eatingHabits: z.string(),
  sleepingHabits: z.string(),
});
