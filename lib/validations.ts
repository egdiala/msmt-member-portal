import { ChildQuestion, FormQuestions } from "@/types/appointment";
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
  );
// .refine(
//   (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password),
//   "Password must include at least one special character"
// );

export const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
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
    currentPassword: z.string().nonempty("Password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().nonempty("Confirm Password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const editProfileDetailsSchema = z.object({
  preferredName: z
    .string()
    // .min(2, "Preferred name must be at least 2 characters")
    .optional(),
  phone_prefix: z.string().optional(),
  phoneNumber: z
    .string()
    .min(8, "Phone number must be at least 8 characters")
    .max(12, "Phone number must be at most 12 characters"),
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
  firstName: z.string().min(2, "First name must be at least 2 characters"),

  lastName: z.string().min(2, "Last name must be at least 2 characters"),

  phone_prefix: z.string(),
  phoneNumber: z
    .string()
    .min(8, "Phone number must be at least 8 characters")
    .max(12, "Phone number must be at most 12 characters"),

  email: z.string().email("Please enter a valid email address"),
  relationship: z.string().min(2, "Relationship must be at least 2 characters"),
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
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone_prefix: z.string().optional(),
  phone_number: z
    .string()
    .min(8, "Phone number must be at least 8 characters")
    .optional(),
  gender: z.string().min(2, "Gender must be at least 2 characters"),
  relationship: z.string().min(2, "Relationship must be at least 2 characters"),
});

export const suspendMemberSchema = z.object({
  reason: z.string().min(2, "Reason must be atleast 2 characters"),
});

export const createAppointmentQuestionnaireSchema = (
  questions: FormQuestions
) => {
  const schemaFields: Record<string, z.ZodType<any>> = {};

  if (Array.isArray(questions)) {
    questions.forEach((question) => {
      const fieldName = getFieldNameFromQuestion(question.question);

      if (question.has_child && question.child_question) {
        question.child_question.forEach((childQ: ChildQuestion) => {
          const childFieldName = getFieldNameFromQuestion(childQ.question);
          schemaFields[childFieldName] = z
            .string()
            .min(1, { message: `${childQ.question} is required` });
        });
      } else {
        if (question.option_type === "checkbox") {
          schemaFields[fieldName] = z.array(z.string()).min(1, {
            message: `${question.question} requires at least one selection`,
          });
        } else {
          schemaFields[fieldName] = z
            .string()
            .min(1, { message: `${question.question} is required` });
        }
      }
    });
  }

  return z.object(schemaFields);
};

function getFieldNameFromQuestion(question: string): string {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "_");
}

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

export const setAppointmentSchedule = z.object({
  service: z.string().nonempty("Required"),
  paymentMethod: z.string().optional(),
  appointmentDate: z.date(),
  appointmentTime: z.string().nonempty("Required"),
  communicationPreference: z.string().nonempty("Required"),
  agreeToCancellation: z.boolean().refine((val) => val === true, {
    message: "You must accept the cancellation and refund policy.",
  }),
});

export const fundWalletSchema = z.object({
  amount: z.coerce.number().int().gte(1, "Enter an amount of at least 1"),
});

export const disableProfileSchema = z.object({
  password: z.string().min(1, { message: "Password is required" }),
});

const childQuestionSchema = z.object({
  question: z.string(),
  option: z.array(z.string()),
  option_type: z.literal("radio"),
  answer: z.string().min(1, "This child question is required"),
});

const baseQuestionSchema = z.object({
  question: z.string(),
  option: z.array(z.string()).optional(),
  option_type: z.string().optional(),
  has_child: z.boolean(),
});

const radioQuestionSchema = baseQuestionSchema.extend({
  option_type: z.literal("radio"),
  has_child: z.literal(false),
  answer: z.string().min(1, "This question is required"),
});

const checkboxQuestionSchema = baseQuestionSchema.extend({
  option_type: z.literal("checkbox"),
  has_child: z.literal(false),
  answer: z.array(z.string()).min(1, "Select at least one option"),
});

const parentQuestionSchema = baseQuestionSchema.extend({
  has_child: z.literal(true),
  child_question: z.array(childQuestionSchema),
  answer: z.string().optional(),
});

export const appointmentBookingQuestionnaireSchema = z.object({
  questions: z.array(
    z.union([radioQuestionSchema, checkboxQuestionSchema, parentQuestionSchema])
  ),
});
