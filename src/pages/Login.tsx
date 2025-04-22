import React from 'react';

import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
} from '@mui/material';

import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';


const Login: React.FC = () => {
    const { login } = useAuth();

    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');


    const handleLogin = async () => {
        if (!name.trim() || !email.trim()) {
            return alert('Name and Email are required');
        }
        try {
            await login(name.trim(), email.trim());
        } catch (error) {
            alert('Login failed');
        }
    };

    return (
        <>
            <Box
                width={'100vw'}
                height={'100vh'}
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                sx={{
                    background: 'linear-gradient(135deg, #6A1B9A, #FF8F00)',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <Card
                        sx={{
                            width: 400,
                            borderRadius: 4,
                            boxShadow: ' 0 4px 20px rgba(0, 0, 0, 0.6)',
                        }}
                    >
                        <CardContent
                            sx={{
                                p: 4,
                                backgroundColor: 'background.paper',
                            }}
                        >
                            <Typography
                                variant="h3"
                                align="left"
                                gutterBottom
                                sx={{
                                    background:
                                        'linear-gradient(135deg, #6A1B9A, #FF8F00)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                Welcome!
                            </Typography>
                            <Box
                                display={'flex'}
                                flexDirection="column"
                                gap={2.5}
                            >
                                <TextField
                                    label="Name"
                                    variant="outlined"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    fullWidth
                                    required
                                />
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    fullWidth
                                    required
                                />
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    fullWidth
                                    type="submit"
                                    onClick={handleLogin}
                                    sx={{
                                        borderRadius: 3,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 600,
                                            color: '#FFFFFF',
                                            fontSize: '1rem',
                                        }}
                                    >
                                        Log In
                                    </Typography>
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </motion.div>
            </Box>
        </>
    );
};

export default Login;
