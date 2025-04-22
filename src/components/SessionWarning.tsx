// src/components/SessionWarning.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const SessionWarning: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();

  // Listen for the custom 'session:warn' event
  useEffect(() => {
    const handleWarn = () => setOpen(true);
    window.addEventListener('session:warn', handleWarn);
    return () => {
      window.removeEventListener('session:warn', handleWarn);
    };
  }, []);

  // User opts to stay logged in: simply close the dialog
  const handleContinue = () => {
    setOpen(false);
  };

  // User chooses to logout immediately
  const handleLogout = () => {
    setOpen(false);
    logout();
  };

  return (
    <Dialog open={open} onClose={handleContinue}>
      <DialogTitle>Session Expiring Soon</DialogTitle>
      <DialogContent>
        Your session will expire in 10 minutes. Would you like to stay logged in?
      </DialogContent>
      <DialogActions>
        <Button onClick={handleLogout}>Logout Now</Button>
        <Button onClick={handleContinue} variant="contained">
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionWarning;