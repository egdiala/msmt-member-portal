import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  addDays,
  endOfMonth,
  format,
  getDay,
  isToday,
  parse,
  parseISO,
  isYesterday,
  startOfMonth,
  setHours,
  setMinutes,
} from "date-fns";

import { LoginResponse } from "@/types/auth";
import { UpdateProfileType } from "@/types/profile";
import { FormOption } from "@/types/appointment";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Gets token expiration information
 * @returns Object with expirationDate, isExpired, and timeRemaining in minutes, or null if no token
 */
export const getTokenExpiration = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    const decryptedToken = JSON.parse(atob(token.split(".")[1]));
    const expirationDate = new Date(decryptedToken?.exp * 1000);
    const now = new Date();
    const isExpired = expirationDate < now;

    // Calculate time remaining in minutes
    const timeRemaining = isExpired
      ? 0
      : Math.floor((expirationDate.getTime() - now.getTime()) / (1000 * 60));

    return {
      expirationDate,
      isExpired,
      timeRemaining,
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const getAdminData = () => {
  const user = JSON.parse(
    localStorage.getItem("user") as string
  ) as LoginResponse;

  return user;
};

export const createQueryString = (queryObject: Record<string, any>): string => {
  if (!queryObject) {
    throw Error("objectToQuery expects an object");
  }
  const queryString = Object.entries(queryObject)
    .filter(
      // eslint-disable-next-line
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join("&");
  return queryString ? `?${queryString}` : "";
};

export function hasCompletedBasicProfile(data?: UpdateProfileType): boolean {
  if (!data) return false;

  const {
    // phone_number,
    // gender,
    marital_status,
    origin_country,
    preferred_lan,
  } = data;

  return (
    // Boolean(phone_number?.trim()) &&
    // Boolean(gender?.trim()) &&
    Boolean(marital_status?.trim()) &&
    Boolean(origin_country?.trim()) &&
    Boolean(preferred_lan?.trim())
  );
}

export const formatTableDate = (date: string) => {
  const parsedDate = parseISO(date);

  if (isToday(parsedDate)) {
    return `Today • ${format(parsedDate, "h:mmaaa")}`;
  }

  return format(parsedDate, "MMM d • h:mmaaa");
};

export const convertToFormOptions = (
  options: string[],
  questionId: string
): FormOption[] => {
  return options.map((option) => ({
    id: `${questionId}-${option}`,
    value: option,
    name: option,
  }));
};

export const getFieldNameFromQuestion = (question: string): string => {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "_");
};
// Function to get all the days of a specific month and year
export function getDaysOfMonth(year: number, month: number) {
  const startOfThisMonth = startOfMonth(new Date(year, month)); // start of the selected month
  const endOfThisMonth = endOfMonth(startOfThisMonth); // end of the selected month

  const daysInMonth = [];
  let currentDate = startOfThisMonth;

  while (currentDate <= endOfThisMonth) {
    daysInMonth.push(currentDate);
    currentDate = addDays(currentDate, 1); // Increment by 1 day
  }

  return daysInMonth;
}

// Function to merge availability with all days of the month
export function mergeAvailabilityWithDays(
  daysOfMonth: Date[], // List of all days in the month
  availability: any[] // Availability data
) {
  return daysOfMonth.map((day) => {
    const dayOfWeek = getDay(day); // Get day of the week (0-6)

    // Find matching availability based on day of the month
    const avail = availability?.find((item) => item.av_day === dayOfWeek);

    if (avail) {
      // Create an array of time slots for this day
      const slots = [];
      for (
        let hour = avail?.start_time?.[0];
        hour <= avail?.end_time?.[0];
        hour++
      ) {
        const ampm = hour < 12 ? "AM" : "PM";
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12; // Adjust to 12-hour format
        slots.push({ hour: formattedHour, ampm, originalHour: hour });
      }

      // Return merged availability with slots
      return {
        date: day,
        available: true,
        slots,
      };
    } else {
      // If no availability, mark as unavailable
      return {
        date: day,
        available: false,
        slots: [],
      };
    }
  });
}

// Function to convert time to AM/PM format
export function formatTimeToAMPM(time: string): string {
  const timeObj = parse(time, "HH:mm", new Date());
  return format(timeObj, "h:mm a"); // 'h:mm a' gives the time in AM/PM format
}

export function formatTimeToHH(time: string): string {
  const timeObj = parse(time, "HH:mm", new Date());
  return format(timeObj, "HH"); // 'HH' gives the time in 24-hour format
}

export function formatApptTimeShort(hour: number): string {
  const date = setMinutes(setHours(new Date(), hour), 0);
  return format(date, "h:mm a");
}

type QuestionOption = {
  question: string;
  option?: string[];
  option_type: "radio" | "checkbox";
  has_child?: boolean;
  child_question?: {
    question: string;
    option: string[];
    option_type: "radio" | "checkbox";
  }[];
};

type AnswerValue = string | string[];

type Answers = {
  [key: string]: AnswerValue;
};

type MappedData = {
  question: string;
  sub_question?: string;
  answer: AnswerValue;
};

export function mapAnswersToData(
  questions: QuestionOption[],
  answers: Answers
): MappedData[] {
  const data: MappedData[] = [];

  questions.forEach((q) => {
    if (q.has_child && q.child_question) {
      q.child_question.forEach((sub) => {
        const key = sub.question.toLowerCase().replace(/ /g, "_");
        const answer = answers[key];
        if (answer !== undefined) {
          data.push({
            question: q.question,
            sub_question: sub.question,
            answer,
          });
        }
      });
    } else {
      const key = q.question
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "");
      const answer = answers[key];
      if (answer !== undefined) {
        data.push({
          question: q.question,
          answer,
        });
      }
    }
  });

  return data;
}

export function formatApptDate(dateStr: string): string {
  const date = parseISO(dateStr);

  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "dd/MM/yyyy");
}

export const isEmpty = (obj: unknown): boolean => {
  return !obj || Object.keys(obj).length === 0;
};

export function getSessionStatus(statusCode: number | string): string {
  switch (statusCode) {
    case 1:
      return "Upcoming";
    case 2:
      return "Live";
    case 3:
      return "Completed";
    case 4:
      return "Canceled";
    case "":
      return "All";
    default:
      return "Unknown";
  }
}
