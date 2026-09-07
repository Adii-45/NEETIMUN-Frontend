import { apiRequest } from "./client";

export type ContactInquiryPayload = {
  fullName: string;
  email: string;
  category: string;
  message: string;
};

export type ContactInquiry = {
  id: string;
  fullName: string;
  email: string;
  category: string;
  message: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
};

export async function submitContactInquiry(
  payload: ContactInquiryPayload,
): Promise<ContactInquiry> {
  const { data } = await apiRequest<ContactInquiry>("/api/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data;
}
