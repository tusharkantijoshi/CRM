import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Box
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
    title?: string;
    children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title = 'Osmium Energy', children }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { user, logout } = useAuth();

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

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
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
