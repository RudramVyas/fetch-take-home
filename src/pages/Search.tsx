import { useState } from 'react';
import {
    Badge,
    Box,
    Button,
    createTheme,
    Drawer,
    IconButton,
    ThemeProvider,
    Typography,
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// import {
//     logout
// } from '../services/api';

import {
    // Favorite,
    // FavoriteBorder,
    Search as SearchIcon,
    // Logout as LogoutIcon,
    Star,
    // Menu as MenuIcon,
} from '@mui/icons-material';

const customTheme = createTheme({
    palette: {
        primary: { main: '#6A1B9A' },
        secondary: { main: '#FF8F00' },
        background: { default: '#F3E5F5', paper: '#F0F0F0' },
    },
    typography: {
        fontFamily: 'Poppins, sans-serif',
        h3: { fontWeight: 700, fontSize: '3rem' },
        h6: { fontWeight: 600 },
        body2: { fontSize: '0.9rem' },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputBase-input:focus': {
                        color: '#6A1B9A',
                    },
                },
            },
        },
    },
});

const Search = () => {
    // const [favorites, setFavorites] = useState<number[]>(Array.from({ length: 10 }, (_, i) => i + 1));
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
            alert('Logout failed. Please try again.');
        }
    };

    const handleMatch = () => {
        // Logic to find a match based on favorites
        try {
            alert(`Finding match for favorites: ${favorites.join(', ')}`);
        } catch (error) {
            console.error('Match failed:', error);
            alert('Match failed. Please try again.');
        }
    };

    return (
        <ThemeProvider theme={customTheme}>
            {/* Match button */}
            <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleMatch}
                disabled={!favorites.length}
                sx={{
                    borderRadius: 3,
                    whiteSpace: 'nowrap',
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    width: 200,
                    zIndex: 1200,
                    boxShadow: 3,
                    backgroundColor: 'primary.main',
                    color: 'common.white',
                    '&:hover': { backgroundColor: 'primary.dark' },
                }}
            >
                Find My Match
            </Button>
            <Box
                display={'flex'}
                flexDirection={'row'}
                sx={{
                    background: 'linear-gradient(135deg, #6A1B9A, #FF8F00)',
                    padding: '0 20px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    height: '80px',
                    alignItems: 'center',
                }}
            >
                {/* Title */}
                <Typography
                    variant="h4"
                    sx={{
                        color: '#FF8F00',
                        fontWeight: 700,
                    }}
                >
                    Dog Find
                </Typography>

                {/* Favourites Drawer */}
                <Box
                    display={'flex'}
                    flexDirection={'row'}
                    alignItems={'center'}
                    justifyContent={'flex-end'}
                    gap={2}
                    ml={'auto'}
                >
                    <IconButton onClick={() => setDrawerOpen(true)}>
                        <Badge badgeContent={favorites.length}>
                            <Star />
                        </Badge>
                    </IconButton>

                    {/* Logout Icon */}
                    <ExitToAppIcon
                        sx={{
                            // marginLeft: 'auto',
                            cursor: 'pointer',
                            color: '#6A1B9A',
                        }}
                        onClick={handleLogout}
                    />
                </Box>
            </Box>
            {/* Filters */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    padding: '20px',
                    backgroundColor: '#f0f0f0',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        color: '#300d38',
                        fontFamily: 'Arial, sans-serif',
                    }}
                >
                    Filters
                </Typography>
            </Box>

            {/* Paginated grid of dogs cards */}
            <Box></Box>
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <Box
                    sx={{
                        width: 300,
                        padding: 2,
                        backgroundColor: '#f0f0f0',
                        height: '100%',
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            color: '#300d38',
                            fontFamily: 'Arial, sans-serif',
                            marginBottom: 2,
                        }}
                    >
                        My Favorites
                    </Typography>
                    {favorites.length > 0 ? (
                        favorites.map((favorite, index) => (
                            <Box
                                key={index}
                                sx={{
                                    padding: 1,
                                    borderBottom: '1px solid #ccc',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography variant="body1">{`Dog ${favorite}`}</Typography>
                                <IconButton
                                    onClick={() => {
                                        setFavorites(
                                            favorites.filter(
                                                (fav) => fav !== favorite
                                            )
                                        );
                                    }}
                                >
                                    <Star sx={{ color: '#FBA919' }} />
                                </IconButton>
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body2" sx={{ color: '#300d38' }}>
                            No favorites selected.
                        </Typography>
                    )}
                </Box>
            </Drawer>
        </ThemeProvider>
        // <>
        //     {/* Title */}
        //     <Box
        //         display={'flex'}
        //         flexDirection={'row'}
        //         height={'80px'}
        //         alignItems={'center'}
        //         sx={{
        //             background: 'linear-gradient(135deg, #6A1B9A, #FF8F00)',
        //             padding: '0 20px',
        //             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        //         }}
        //     >
        //         <Typography
        //             variant="h4"
        //             sx={{
        //                 color: '#FF8F00',
        //                 fontFamily: 'Arial, sans-serif',
        //             }}
        //         >
        //             Dog Search
        //         </Typography>
        //         {/* logout icon clickabke */}
        //         <ExitToAppIcon
        //             sx={{
        //                 marginLeft: 'auto',
        //                 cursor: 'pointer',
        //                 color: '#300d38',
        //             }}
        //             onClick={() => alert('Logout clicked')}
        //         />
        //     </Box>
        //     {/* Filters */}
        //     <Box
        //         sx={{
        //             display: 'flex',
        //             flexDirection: 'row',
        //             justifyContent: 'space-between',
        //             padding: '20px',
        //             backgroundColor: '#f0f0f0',
        //             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        //         }}
        //     >
        //         <Typography
        //             variant="h6"
        //             sx={{
        //                 color: '#300d38',
        //                 fontFamily: 'Arial, sans-serif'
        //             }}
        //         >
        //             Filters
        //         </Typography>

        //     </Box>
        //     {/* Paginated grid of dogs cards*/}
        //     <Box
        //         sx={{
        //             display: 'grid',
        //             gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        //             gap: '20px',
        //             padding: '20px',
        //             backgroundColor: '#ffffff',
        //         }}
        //     >
        //         {/* Sample dog cards */}
        //         {Array.from({ length: 20 }).map((_, index) => (
        //             <Box
        //                 key={index}
        //                 sx={{
        //                     backgroundColor: '#e0e0e0',
        //                     padding: '10px',
        //                     borderRadius: '8px',
        //                     boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        //                     textAlign: 'center',
        //                     position: 'relative',
        //                     // width: '300px',
        //                 }}
        //             >
        //                 <img
        //                     src={`https://images.unsplash.com/photo-1563889362352-b0492c224f62?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
        //                     alt={`Dog ${index + 1}`}
        //                     style={{
        //                         width: '100%',
        //                         aspectRatio: '1 / 1', // Ensures the image is square
        //                         objectFit: 'cover',
        //                         borderRadius: '8px'
        //                     }}
        //                 />
        //                 <Typography variant="body2" sx={{ color: '#300d38' }}>
        //                     Name: Sample Dog {index + 1}
        //                 </Typography>
        //                 <Typography variant="body2" sx={{ color: '#300d38' }}>
        //                     Breed: Sample Breed
        //                 </Typography>
        //                 <Typography variant="body2" sx={{ color: '#300d38' }}>
        //                     Age: {Math.floor(Math.random() * 10) + 1} years
        //                 </Typography>
        //                 {/* favourites icon clickable, positioned at bottom left, toggles outlined to filled */}
        //                 <IconButton
        //                     sx={{
        //                         color: '#FBA919',
        //                         position: 'absolute',
        //                         bottom: '0px',
        //                         left: '0px'
        //                     }}
        //                     onClick={() => {
        //                         const newFavoriteStatus = [...favoriteStatus];
        //                         newFavoriteStatus[index] = !newFavoriteStatus[index];
        //                         setFavoriteStatus(newFavoriteStatus);
        //                     }}
        //                 >
        //                     {favoriteStatus[index] ? <Favorite sx={{ color: '#FBA919' }}/> : <FavoriteBorder sx={{ color: '#FBA919' }}/>}
        //                 </IconButton>
        //             </Box>
        //         ))}
        //     </Box>
        // </>
    );
};

export default Search;
