import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  contactSchema,
  ContactStatus,
  type Contact,
  type ContactFormData,
} from "../types/contacts.types";

interface ContactFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ContactFormData) => Promise<void>;
  contact?: Contact | null;
}

const ContactFormDialog: React.FC<ContactFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  contact,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      status: ContactStatus.Lead,
      notes: "",
    },
  });

  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (contact) {
        reset({
          name: contact.name,
          email: contact.email || "",
          phone: contact.phone || "",
          company: contact.company || "",
          status: contact.status as ContactStatus,
          notes: contact.notes || "",
        });
      } else {
        reset(); // Reset to defaultValues for new contact
      }
    }
  }, [contact, reset, open]);

  // Reset error when dialog opens or closes, but avoid main effect dependency issues
  useEffect(() => {
    // Avoid setting state in effect if possible.
    // If we want to clear error on open, we can do it here but wrap in a check to avoid potential loop if not careful?
    // Actually, just ignoring it is fine if we accept it's a sync update on prop change.
    // But since `open` changes, removing it is safer for lint.
    // Let's rely on handleFormSubmit clearing it.
  }, [open]);

  const handleFormSubmit = async (data: ContactFormData) => {
    try {
      setSubmitError(null);
      await onSubmit(data);
      onClose();
    } catch (error: unknown) {
      console.error("Failed to submit contact:", error);
      const err = error as {
        response?: { data?: { msg?: string } };
        message?: string;
      };
      const msg =
        err.response?.data?.msg || err.message || "Failed to submit contact";
      setSubmitError(msg);
    }
  };

  const handleClose = () => {
    setSubmitError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{contact ? "Edit Contact" : "Add New Contact"}</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {contact ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ContactFormDialog;
