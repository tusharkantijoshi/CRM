import React, { useEffect, useState } from 'react';
import {
    Container,
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
    TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
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

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const data = await contactService.getContacts(search);
            setContacts(data);
            setError('');
        } catch (err: any) {
            console.error(err);
            setError('Failed to fetch contacts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Debounce search could be added here, currently just fetching on effect
        const timeoutId = setTimeout(() => {
            fetchContacts();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const handleCreateContact = async (data: ContactFormData) => {
        try {
            await contactService.createContact(data);
            fetchContacts();
        } catch (err: any) {
            console.error('Failed to create contact:', err);
            throw err;
        }
    };

    const handleUpdateContact = async (data: ContactFormData) => {
        if (!selectedContact) return;
        try {
            await contactService.updateContact(selectedContact._id, data);
            fetchContacts();
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
                fetchContacts();
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
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Contacts
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={openCreateDialog}
                >
                    Add Contact
                </Button>
            </Box>

            <Box sx={{ mb: 3 }}>
                <TextField
                    label="Search contacts..."
                    variant="outlined"
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                    }}
                />
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : contacts.length === 0 ? (
                <Typography variant="body1" color="text.secondary" align="center">
                    No contacts found.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {contacts.map((contact) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={contact._id}>
                            <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="h6" component="div" noWrap>
                                            {contact.name}
                                        </Typography>
                                        <Chip
                                            label={contact.status}
                                            color={getStatusColor(contact.status)}
                                            size="small"
                                        />
                                    </Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        {contact.company || 'No Company'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        <strong>Email:</strong> {contact.email || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Phone:</strong> {contact.phone || 'N/A'}
                                    </Typography>
                                    {contact.notes && (
                                        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                                            "{contact.notes}"
                                        </Typography>
                                    )}
                                </CardContent>
                                <CardActions>
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
        </Container>
    );
};

export default ContactsDashboard;
