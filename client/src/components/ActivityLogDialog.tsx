import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    CircularProgress,
    Alert,
    List,
    ListItem,
    ListItemText,
    Chip,
    Divider
} from '@mui/material';
import { format } from 'date-fns';
import { getContactActivity } from '../api/contacts.api';

interface ActivityLog {
    _id: string;
    action: 'create' | 'update' | 'delete';
    entity: string;
    entity_id: string;
    details: Record<string, any>;
    created_at: string;
    created_by: string;
}

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
    contactName
}) => {
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open && contactId) {
            fetchActivities();
        }
    }, [open, contactId]);

    const fetchActivities = async () => {
        if (!contactId) return;

        try {
            setLoading(true);
            setError('');
            const data = await getContactActivity(contactId);
            setActivities(data);
        } catch (err: any) {
            console.error('Failed to fetch activities:', err);
            setError('Failed to load activity logs');
        } finally {
            setLoading(false);
        }
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'create': return 'success';
            case 'update': return 'info';
            case 'delete': return 'error';
            default: return 'default';
        }
    };

    const formatDetails = (details: Record<string, any>) => {
        const entries = Object.entries(details);
        if (entries.length === 0) return 'No details';

        return entries.map(([key, value]) => `${key}: ${value}`).join(', ');
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Activity History: {contactName}
            </DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : activities.length === 0 ? (
                    <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                        No activity logs found
                    </Typography>
                ) : (
                    <List sx={{ p: 0 }}>
                        {activities.map((activity, index) => (
                            <React.Fragment key={activity._id}>
                                <ListItem alignItems="flex-start" sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Chip
                                            label={activity.action.toUpperCase()}
                                            color={getActionColor(activity.action)}
                                            size="small"
                                        />
                                        <Typography variant="caption" color="text.secondary">
                                            {format(new Date(activity.created_at), 'MMM dd, yyyy HH:mm')}
                                        </Typography>
                                    </Box>
                                    <ListItemText
                                        secondary={
                                            <Typography variant="body2" color="text.secondary">
                                                {formatDetails(activity.details)}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                                {index < activities.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ActivityLogDialog;
