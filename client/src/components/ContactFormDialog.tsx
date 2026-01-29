import React, { useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Box
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type Contact, type ContactFormData, ContactStatus } from '../types/contacts.types';

interface ContactFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: ContactFormData) => Promise<void>;
    contact?: Contact | null;
}

const ContactFormDialog: React.FC<ContactFormDialogProps> = ({ open, onClose, onSubmit, contact }) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            company: '',
            status: ContactStatus.Lead,
            notes: ''
        }
    });

    useEffect(() => {
        if (contact) {
            reset({
                name: contact.name,
                email: contact.email || '',
                phone: contact.phone || '',
                company: contact.company || '',
                status: contact.status as ContactStatus,
                notes: contact.notes || ''
            });
        } else {
            reset({
                name: '',
                email: '',
                phone: '',
                company: '',
                status: ContactStatus.Lead,
                notes: ''
            });
        }
    }, [contact, open, reset]);

    const handleFormSubmit = async (data: ContactFormData) => {
        try {
            await onSubmit(data);
            onClose();
        } catch (error) {
            console.error('Failed to submit contact:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{contact ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Name"
                                    fullWidth
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            )}
                        />
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Email"
                                    fullWidth
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            )}
                        />
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Phone"
                                    fullWidth
                                    error={!!errors.phone}
                                    helperText={errors.phone?.message}
                                />
                            )}
                        />
                        <Controller
                            name="company"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Company"
                                    fullWidth
                                    error={!!errors.company}
                                    helperText={errors.company?.message}
                                />
                            )}
                        />
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Status"
                                    fullWidth
                                    error={!!errors.status}
                                    helperText={errors.status?.message}
                                >
                                    {Object.values(ContactStatus).map((status) => (
                                        <MenuItem key={status} value={status}>
                                            {status}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                        <Controller
                            name="notes"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Notes"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    error={!!errors.notes}
                                    helperText={errors.notes?.message}
                                />
                            )}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="inherit">
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                        {contact ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ContactFormDialog;
