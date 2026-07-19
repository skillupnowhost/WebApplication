import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";
import { MUHURTHAM_EVENTS } from "./astrology/constants";

export const phoneSchema = z
  .string()
  .min(8, "Enter a valid phone number")
  .refine((val) => isValidPhoneNumber(val), {
    message: "Enter a valid phone number with country code, e.g. +91 98765 43210",
  });

export const emailSchema = z.string().trim().toLowerCase().email("Enter a valid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Include at least one uppercase letter")
  .regex(/[0-9]/, "Include at least one number");

export const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name"),
    email: emailSchema,
    phone: phoneSchema,
    country: z.string().trim().length(2).optional(),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your password"),
    role: z.enum(["STUDENT", "MENTOR"]).default("STUDENT"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const channelSchema = z.enum(["phone", "email"]);

export const otpRequestSchema = z.object({
  identifier: z.string().min(3),
  purpose: z.enum(["signup", "login", "reset"]),
  channel: channelSchema,
});

export const otpVerifySchema = z.object({
  identifier: z.string().min(3),
  purpose: z.enum(["signup", "login", "reset"]),
  channel: channelSchema,
  code: z.string().length(6),
});

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  email: emailSchema,
  phone: phoneSchema,
  company: z.string().trim().optional().or(z.literal("")),
  service: z.string().min(1, "Select a service"),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const internshipApplicationSchema = z.object({
  internshipId: z.string().min(1),
  coverNote: z.string().trim().max(1500).optional().or(z.literal("")),
  resumeName: z.string().trim().optional().or(z.literal("")),
});

export const tutoringBookingSchema = z.object({
  tutorId: z.string().min(1),
  subject: z.string().min(1),
  grade: z.string().min(1),
  board: z.string().min(1),
  preferredSlot: z.string().min(1),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export type SignupInput = z.input<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type LeadInput = z.infer<typeof leadSchema>;

const astrologyLanguageEnum = z.enum(["en", "ta", "hi", "te", "ml"]);
const optionalShortText = z.string().trim().max(120).optional().or(z.literal(""));

export const astrologyProfileSchema = z.object({
  fullName: z.string().trim().min(2, "Enter the full name"),
  gender: z.enum(["male", "female", "other"]).optional().or(z.literal("")),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date"),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/, "Enter a valid time"),
  birthTimeKnown: z.boolean().default(true),
  birthPlace: z.string().trim().min(2, "Enter the place of birth"),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  system: z.enum(["THIRUKKANITHAM", "VAKYA", "KP", "RAMAN"]).default("THIRUKKANITHAM"),
  fatherName: optionalShortText,
  motherName: optionalShortText,
  maritalStatus: z.enum(["single", "married", "divorced", "widowed"]).optional().or(z.literal("")),
  phone: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || /^[+\d][\d\s\-()]{7,17}$/.test(v), { message: "Enter a valid phone number" }),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").optional().or(z.literal("")),
  parentsNames: z.string().trim().max(200).optional().or(z.literal("")),
  occupation: optionalShortText,
  businessType: optionalShortText,
  salary: optionalShortText,
  community: optionalShortText,
  caste: optionalShortText,
  gothram: optionalShortText,
  customNotes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const astrologyReportRequestSchema = z.object({
  profileId: z.string().min(1),
  depth: z.enum(["SUMMARY", "FULL"]),
  chartStyle: z.enum(["NORTH_INDIAN", "SOUTH_INDIAN", "EAST_INDIAN"]),
  language: astrologyLanguageEnum,
  reportStyle: z.enum(["PROFESSIONAL", "TRADITIONAL", "MODERN"]).default("PROFESSIONAL"),
});

export const astrologyMatchRequestSchema = z.object({
  profileAId: z.string().min(1),
  profileBId: z.string().min(1),
  language: astrologyLanguageEnum,
});

export type AstrologyProfileInput = z.infer<typeof astrologyProfileSchema>;
export type AstrologyReportRequestInput = z.infer<typeof astrologyReportRequestSchema>;
export type AstrologyMatchRequestInput = z.infer<typeof astrologyMatchRequestSchema>;

const astrologyDateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date");
const astrologyLanguage = astrologyLanguageEnum.default("en");

export const astrologyNamingQuerySchema = z.object({
  birthDate: astrologyDateString,
  birthTime: z.string().regex(/^\d{2}:\d{2}$/, "Enter a valid time"),
  place: z.string().trim().min(2, "Enter the place of birth"),
  gender: z.enum(["boy", "girl", "both"]).default("both"),
  letter: z.string().trim().max(4).optional().or(z.literal("")),
  lang: astrologyLanguage,
});

export const astrologyNumerologyQuerySchema = z.object({
  name: z.string().trim().min(2, "Enter the full name"),
  birthDate: astrologyDateString,
  lang: astrologyLanguage,
  // Newline- or comma-separated additional names for side-by-side Chaldean comparison (max 10).
  compareNames: z.string().trim().max(600).optional().or(z.literal("")),
});

export const astrologyMuhurthamQuerySchema = z
  .object({
    name: z.string().trim().min(2, "Enter your name"),
    event: z.enum(MUHURTHAM_EVENTS),
    from: astrologyDateString,
    to: astrologyDateString,
    place: z.string().trim().min(2, "Enter the location"),
    lang: astrologyLanguage,
  })
  .refine((v) => v.to >= v.from, { message: "End date must be on or after the start date", path: ["to"] });

export type AstrologyNamingQueryInput = z.infer<typeof astrologyNamingQuerySchema>;
export type AstrologyNumerologyQueryInput = z.infer<typeof astrologyNumerologyQuerySchema>;
export type AstrologyMuhurthamQueryInput = z.infer<typeof astrologyMuhurthamQuerySchema>;
