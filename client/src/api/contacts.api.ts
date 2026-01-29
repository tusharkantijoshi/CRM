import apiClient from './client';
import { type Contact, type ContactFormData } from '../types/contacts.types';

export const getContacts = async (search?: string, status?: string): Promise<Contact[]> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);

    const response = await apiClient.get<Contact[]>(`/contacts?${params.toString()}`);
    return response.data;
};

export const createContact = async (data: ContactFormData): Promise<Contact> => {
    const response = await apiClient.post<Contact>('/contacts', data);
    return response.data;
};

export const updateContact = async (id: string, data: Partial<ContactFormData>): Promise<Contact> => {
    const response = await apiClient.put<Contact>(`/contacts/${id}`, data);
    return response.data;
};

export const deleteContact = async (id: string): Promise<void> => {
    await apiClient.delete(`/contacts/${id}`);
};
