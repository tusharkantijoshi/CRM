import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as contactService from "../api/contacts.api";
import { type ContactFormData } from "../types/contacts.types";

export const CONTACTS_QUERY_KEY = ["contacts"];

export const useContacts = (
  search: string = "",
  status: string | undefined = undefined,
  page: number = 1,
  limit: number = 10,
) => {
  return useQuery({
    queryKey: [...CONTACTS_QUERY_KEY, { search, status, page, limit }],
    queryFn: () => contactService.getContacts(search, status, page, limit),
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new page
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ContactFormData) => contactService.createContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTACTS_QUERY_KEY });
    },
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ContactFormData>;
    }) => contactService.updateContact(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTACTS_QUERY_KEY });
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contactService.deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTACTS_QUERY_KEY });
    },
  });
};
