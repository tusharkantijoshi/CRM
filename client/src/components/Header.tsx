import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
    title?: string;
    children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title = 'Osmium Energy', children }) => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    {title}
                </Typography>

                {/* Custom Content (Search, Buttons, etc.) */}
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'flex-end', mr: { xs: 1, sm: 2 } }}>
                    {children}
                </Box>

                {/* User Menu */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                    {user?.email && (
                        <Typography variant="body2" color="inherit" sx={{ display: { xs: 'none', md: 'block' } }}>
                            {user.email}
                        </Typography>
                    )}
                    <AccountCircle sx={{ color: 'inherit', fontSize: 32 }} />
                    <Button
                        color="inherit"
                        onClick={handleLogout}
                        sx={{ ml: 1 }}
                    >
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
