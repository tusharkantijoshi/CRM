import { z } from "zod";

export const ContactStatus = {
  Lead: "Lead",
  Prospect: "Prospect",
  Customer: "Customer",
} as const;

export type ContactStatus = (typeof ContactStatus)[keyof typeof ContactStatus];

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  company: z.string().optional(),
  status: z.nativeEnum(ContactStatus),
  notes: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export interface Contact extends ContactFormData {
  _id: string;
  created_by: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedContactsResponse {
  contacts: Contact[];
  total: number;
  page: number;
  totalPages: number;
}
