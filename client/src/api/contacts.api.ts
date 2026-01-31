import {
  type ActivityLog,
  type Contact,
  type ContactFormData,
  type PaginatedContactsResponse,
} from "../types/contacts.types";
import apiClient from "./client";

export const getContacts = async (
  search?: string,
  status?: string,
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedContactsResponse> => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (status) params.append("status", status);
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const response = await apiClient.get<PaginatedContactsResponse>(
    `/contacts?${params.toString()}`,
  );
  return response.data;
};

export const createContact = async (
  data: ContactFormData,
): Promise<Contact> => {
  const response = await apiClient.post<Contact>("/contacts", data);
  return response.data;
};

export const updateContact = async (
  id: string,
  data: Partial<ContactFormData>,
): Promise<Contact> => {
  const response = await apiClient.put<Contact>(`/contacts/${id}`, data);
  return response.data;
};

export const deleteContact = async (id: string): Promise<void> => {
  await apiClient.delete(`/contacts/${id}`);
};

export const getContactActivity = async (
  id: string,
): Promise<ActivityLog[]> => {
  const response = await apiClient.get<ActivityLog[]>(
    `/contacts/${id}/activity`,
  );
  return response.data;
};
