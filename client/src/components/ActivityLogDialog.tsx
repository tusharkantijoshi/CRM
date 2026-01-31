import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import React, { useCallback, useEffect, useState } from "react";
import { getContactActivity } from "../api/contacts.api";
import { type ActivityLog } from "../types/contacts.types";

interface ActivityLogDialogProps {
  open: boolean;
  onClose: () => void;
  contactId: string | null;
  contactName: string;
}

const ActivityLogDialog: React.FC<ActivityLogDialogProps> = ({
  open,
  onClose,
  contactId,
  contactName,
}) => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchActivities = useCallback(async () => {
    if (!contactId) return;

    try {
      setLoading(true);
      setError("");
      const data = await getContactActivity(contactId);
      setActivities(data);
    } catch (error: unknown) {
      console.error("Failed to fetch activities:", error);
      setError("Failed to load activity logs");
    } finally {
      setLoading(false);
    }
  }, [contactId]);

  useEffect(() => {
    if (open && contactId) {
      fetchActivities();
    }
  }, [open, contactId, fetchActivities]);

  const getActionColor = (action: string) => {
    switch (action) {
      case "create":
        return "success";
      case "update":
        return "info";
      case "delete":
        return "error";
      default:
        return "default";
    }
  };

  const formatDetails = (details: Record<string, unknown>, action: string) => {
    const entries = Object.entries(details);
    if (entries.length === 0) return "No details";

    if (action === "update") {
      // Format as "field: oldValue → newValue"
      return entries
        .map(([key, value]) => {
          if (
            value &&
            typeof value === "object" &&
            "from" in value &&
            "to" in value
          ) {
            const fromVal = (value as { from?: unknown }).from || "(empty)";
            const toVal = (value as { to?: unknown }).to || "(empty)";
            return `${key}: ${fromVal} → ${toVal}`;
          }
          return `${key}: ${value as string}`;
        })
        .join(", ");
    }

    return entries.map(([key, value]) => `${key}: ${value}`).join(", ");
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }

    if (activities.length === 0) {
      return (
        <Typography color="text.secondary" sx={{ textAlign: "center", py: 3 }}>
          No activity logs found
        </Typography>
      );
    }

    return (
      <List sx={{ p: 0 }}>
        {activities.map((activity, index) => (
          <React.Fragment key={activity._id}>
            <ListItem
              alignItems="flex-start"
              sx={{ flexDirection: "column", alignItems: "stretch" }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Chip
                  label={activity.action.toUpperCase()}
                  color={getActionColor(activity.action)}
                  size="small"
                />
                <Typography variant="caption" color="text.secondary">
                  {format(new Date(activity.created_at), "MMM dd, yyyy HH:mm")}
                </Typography>
              </Box>
              <ListItemText
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {formatDetails(activity.details, activity.action)}
                  </Typography>
                }
              />
            </ListItem>
            {index < activities.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Activity History: {contactName}</DialogTitle>
      <DialogContent dividers>{renderContent()}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActivityLogDialog;
