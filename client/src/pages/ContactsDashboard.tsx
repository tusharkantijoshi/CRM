import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Pagination,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { debounce } from "lodash";
import React, { useState } from "react";
import { type Contact, type ContactFormData } from "../types/contacts.types";

import ActivityLogDialog from "../components/ActivityLogDialog";
import ContactFormDialog from "../components/ContactFormDialog";
import { useAuth } from "../context/AuthContext";
import {
  useContacts,
  useCreateContact,
  useDeleteContact,
  useUpdateContact,
} from "../hooks/useContacts";

const ContactsDashboard: React.FC = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Activity log dialog state
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
  const [activityContactId, setActivityContactId] = useState<string | null>(
    null,
  );
  const [activityContactName, setActivityContactName] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const limit = 12; // Grid layout 4x3 or 3x4 works well

  // Role-based access control from context
  const { isAdmin } = useAuth();

  // React Query Hooks
  const {
    data: contactsData,
    isLoading: loading,
    isError: isContactsError,
    error: contactsError,
  } = useContacts(debouncedSearch, undefined, page, limit);

  const createMutation = useCreateContact();
  const updateMutation = useUpdateContact();
  const deleteMutation = useDeleteContact();

  const contacts = contactsData?.contacts || [];
  const totalPages = contactsData?.totalPages || 1;
  const error = isContactsError
    ? (contactsError as Error).message || "Failed to fetch contacts"
    : "";

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearch(query);
    const handler = debounce((q: string) => {
      setPage(1);
      setDebouncedSearch(q);
    }, 500);
    handler(query);
  };

  const handleCreateContact = async (data: ContactFormData) => {
    try {
      await createMutation.mutateAsync(data);
      setPage(1); // Reset to first page to show the new contact
      setIsDialogOpen(false);
    } catch (err: unknown) {
      console.error("Failed to create contact:", err);
      // Optional: show error toast
    }
  };

  const handleUpdateContact = async (data: ContactFormData) => {
    if (!selectedContact) return;
    try {
      await updateMutation.mutateAsync({ id: selectedContact._id, data });
      setIsDialogOpen(false);
      setSelectedContact(null);
    } catch (err: unknown) {
      console.error("Failed to update contact:", err);
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (globalThis.confirm("Are you sure you want to delete this contact?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err: unknown) {
        console.error("Failed to delete contact:", err);
        alert("Failed to delete contact");
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

  const openActivityDialog = (contact: Contact) => {
    setActivityContactId(contact._id);
    setActivityContactName(contact.name);
    setIsActivityDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Customer":
        return "success";
      case "Prospect":
        return "warning";
      case "Lead":
        return "info";
      default:
        return "default";
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (contacts.length === 0) {
      return (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No contacts found.
          </Typography>
          {isAdmin && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={openCreateDialog}
              sx={{ mt: 2 }}
            >
              Create your first contact
            </Button>
          )}
        </Paper>
      );
    }

    return (
      <>
        <Grid container spacing={3}>
          {contacts.map((contact) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={contact._id}>
              <Card
                elevation={2}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: 4 },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ fontWeight: "bold" }}
                    >
                      {contact.name}
                    </Typography>
                    <Chip
                      label={contact.status}
                      color={getStatusColor(contact.status)}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  <Typography
                    color="text.secondary"
                    gutterBottom
                    sx={{ mb: 2 }}
                  >
                    {contact.company || "No Company"}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                    }}
                  >
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
                    <Box
                      sx={{
                        mt: 2,
                        p: 1,
                        bgcolor: "action.hover",
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontStyle: "italic",
                          color: "text.secondary",
                          display: "block",
                        }}
                      >
                        {contact.notes}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
                  {isAdmin && (
                    <>
                      <IconButton
                        size="small"
                        onClick={() => openActivityDialog(contact)}
                        color="info"
                      >
                        <HistoryIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => openEditDialog(contact)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteContact(contact._id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </>
    );
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          sx={{ mb: 2, fontSize: { xs: "1.75rem", sm: "2.125rem" } }}
        >
          Contacts
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          <TextField
            placeholder="Search contacts..."
            variant="outlined"
            size="small"
            value={search}
            onChange={handleSearchChange}
            sx={{
              bgcolor: "background.paper",
              flexGrow: { xs: 1, sm: 0 },
              minWidth: { sm: "250px" },
            }}
            slotProps={{
              input: {
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              },
            }}
          />
          {isAdmin && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={openCreateDialog}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              Add Contact
            </Button>
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {renderContent()}

      <ContactFormDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={selectedContact ? handleUpdateContact : handleCreateContact}
        contact={selectedContact}
      />

      <ActivityLogDialog
        open={isActivityDialogOpen}
        onClose={() => setIsActivityDialogOpen(false)}
        contactId={activityContactId}
        contactName={activityContactName}
      />
    </Box>
  );
};

export default ContactsDashboard;
