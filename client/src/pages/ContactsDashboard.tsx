import React, { useEffect, useState, useCallback } from 'react';
import {
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    Grid,
    Box,
    Chip,
    IconButton,
    CircularProgress,
    Alert,
    TextField,
    Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { debounce } from 'lodash';
import { type Contact, type ContactFormData } from '../types/contacts.types';

import * as contactService from '../api/contacts.api';
import ContactFormDialog from '../components/ContactFormDialog';

const ContactsDashboard: React.FC = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

    // Fetch contacts with an optional query
    const fetchContacts = async (query: string = '') => {
        try {
            setLoading(true);
            const data = await contactService.getContacts(query);
            setContacts(data);
            setError('');
        } catch (err: any) {
            console.error(err);
            setError('Failed to fetch contacts');
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch on mount
    useEffect(() => {
        fetchContacts('');
    }, []);

    // Create a memoized debounced search function
    const debouncedFetch = useCallback(
        debounce((query: string) => {
            fetchContacts(query);
        }, 500),
        []
    );

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearch(query);
        debouncedFetch(query);
    };

    const handleCreateContact = async (data: ContactFormData) => {
        try {
            await contactService.createContact(data);
            // Refresh with current search term (or empty to see new contact if it matches)
            // Ideally we might clear search or just refetch with current search
            fetchContacts(search);
        } catch (err: any) {
            console.error('Failed to create contact:', err);
            throw err;
        }
    };

    const handleUpdateContact = async (data: ContactFormData) => {
        if (!selectedContact) return;
        try {
            await contactService.updateContact(selectedContact._id, data);
            fetchContacts(search);
            setSelectedContact(null);
        } catch (err: any) {
            console.error('Failed to update contact:', err);
            throw err;
        }
    };

    const handleDeleteContact = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            try {
                await contactService.deleteContact(id);
                fetchContacts(search);
            } catch (err: any) {
                console.error('Failed to delete contact:', err);
                alert('Failed to delete contact');
            }
        }
    };

    const openCreateDialog = () => {
        setSelectedContact(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (contact: Contact) => {
        setSelectedContact(contact);
        setIsDialogOpen(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Customer': return 'success';
            case 'Prospect': return 'warning';
            case 'Lead': return 'info';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Contacts
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        placeholder="Search contacts..."
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={handleSearchChange}
                        sx={{ bgcolor: 'background.paper' }}
                        InputProps={{
                            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={openCreateDialog}
                    >
                        Add Contact
                    </Button>
                </Box>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : contacts.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        No contacts found.
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={openCreateDialog}
                        sx={{ mt: 2 }}
                    >
                        Create your first contact
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {contacts.map((contact) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={contact._id}>
                            <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'flex-start' }}>
                                        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                            {contact.name}
                                        </Typography>
                                        <Chip
                                            label={contact.status}
                                            color={getStatusColor(contact.status)}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </Box>
                                    <Typography color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                                        {contact.company || 'No Company'}
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        {contact.email && (
                                            <Typography variant="body2" color="text.primary">
                                                {contact.email}
                                            </Typography>
                                        )}
                                        {contact.phone && (
                                            <Typography variant="body2" color="text.secondary">
                                                {contact.phone}
                                            </Typography>
                                        )}
                                    </Box>

                                    {contact.notes && (
                                        <Box sx={{ mt: 2, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                                            <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary', display: 'block' }}>
                                                {contact.notes}
                                            </Typography>
                                        </Box>
                                    )}
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                                    <IconButton size="small" onClick={() => openEditDialog(contact)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleDeleteContact(contact._id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <ContactFormDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={selectedContact ? handleUpdateContact : handleCreateContact}
                contact={selectedContact}
            />
        </Box>
    );
};

export default ContactsDashboard;
