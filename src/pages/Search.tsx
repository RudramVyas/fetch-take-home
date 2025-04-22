import { useState, useEffect } from 'react';
import {
    Badge,
    Box,
    Button,
    createTheme,
    Drawer,
    IconButton,
    TextField,
    ThemeProvider,
    Typography,
    Autocomplete,
    Slider,
    Pagination,
    Container,
    Dialog,
    Select,
    MenuItem,
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Masonry } from "@mui/lab";
import CssBaseline from '@mui/material/CssBaseline';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// import {
//     logout
// } from '../services/api';

import {
    Search as SearchIcon,
    Star,
    StarOutline,
} from '@mui/icons-material';

import { Dog } from '../services/types';
import {
    getBreeds,
    searchDogs,
    getDogsByIds,
    matchDogs,
} from '../services/api';

const customTheme = createTheme({
    palette: {
        primary: { main: '#6A1B9A' },
        secondary: { main: '#FF8F00' },
        background: { default: '#EDE7F6', paper: '#bbb' },
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

const PAGE_SIZE = 12; // Number of dogs per page
const MAX_AGE = 25; // Maximum age for the slider

const Search: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    
    // State variables
    // Filter and search states
    const [breedsOptions, setBreedsOptions] = useState<string[]>([]);
    const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
    const [ageRange, setAgeRange] = useState<number[]>([0, MAX_AGE]);
    const [nameQuery, setNameQuery] = useState("");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
    // const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
    
    // Dogs data and pagination states
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const displayedDogs = dogs.filter((d) =>
        d.name.toLowerCase().includes(nameQuery.toLowerCase())
    );
    
    // Favorites and match states
    const [favorites, setFavorites] = useState<string[]>([]);
    const [favoriteDogs, setFavoriteDogs] = useState<Dog[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    
    // Match dog state
    const [matchDog, setMatchDog] = useState<Dog | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    
    // Use effects to fetch data and manage state
    useEffect(() => {
        getBreeds().then((res) => setBreedsOptions(res.data));
    }, []);

    useEffect(() => {
        let cancelled = false;
        const fetchDogs = async () => {
            // setLoading(true);
            try {
                const from = (page - 1) * PAGE_SIZE;
                const resp = await searchDogs({
                    breeds: selectedBreeds,
                    ageMin: ageRange[0],
                    ageMax: ageRange[1],
                    size: PAGE_SIZE,
                    from,
                    sort: "breed",
                    sortDirection: sortDir,
                });
                if (cancelled) return;
                setTotal(resp.data.total);
                const details = await getDogsByIds(resp.data.resultIds);
                if (!cancelled) setDogs(details.data);
            } finally {
                // if (!cancelled) setLoading(false);
            }
        };
        fetchDogs();
        return () => {
            cancelled = true;
        };
    }, [selectedBreeds, ageRange, sortDir, page]);

    useEffect(() => {
        if (!favorites.length) return setFavoriteDogs([]);
        getDogsByIds(favorites).then((res) => setFavoriteDogs(res.data));
    }, [favorites]);

    // Handlers for logout, match finding, and favorites
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
            alert('Logout failed. Please try again.');
        }
    };

    const handleMatch = async () => {
        // Logic to find a match based on favorites
        try {
            const resp = await matchDogs(favorites);
            const [dog] = (await getDogsByIds([resp.data.match])).data;
            setMatchDog(dog);
            setDialogOpen(true);
        } catch (error) {
            console.error('Match failed:', error);
            alert('Failed to find a match. Please try again.');
        }
    };

    return (
        <ThemeProvider theme={customTheme}>
            <CssBaseline />
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

            {/* Header */}
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
                    Furry Friend Finder
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
                    alignItems: 'center',
                    padding: '20px',
                    backgroundColor: '#f0f0f0',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    gap: 2,
                    overflowX: 'auto',
                }}
            >
                {/* Search by name */}
                <TextField
                    label="Search Name"
                    value={nameQuery}
                    onChange={(e) => {
                        setNameQuery(e.target.value);
                        setPage(1);
                    }}
                    sx={{ minWidth: 150 }}
                    size="small"
                />

                {/* Breed filter */}
                <Autocomplete
                    multiple
                    options={breedsOptions}
                    value={selectedBreeds}
                    onChange={(_e, v) => {
                        setSelectedBreeds(v);
                        setPage(1);
                    }}
                    limitTags={3}
                    slotProps={{
                        chip: {
                            size: "small",
                            color: "secondary",
                            sx: {
                                maxWidth: 80,
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                            },
                        },
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Filter Breeds"
                            size="small"
                            sx={{ minWidth: 0 }}
                        />
                    )}
                    sx={{ minWidth: { xs: "100%", sm: "25%" } }}
                />

                {/* Age Slider */}
                <Box 
                    sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minWidth: "200px",
                        mx: 4,
                    }}
                 >
                    <Typography gutterBottom variant="body2">
                        Age: {ageRange[0]} - {ageRange[1]}
                    </Typography>
                    <Slider
                        value={ageRange}
                        onChange={(_e, v) => {
                            setAgeRange(v as number[]);
                            setPage(1);
                        }}
                        valueLabelDisplay="auto"
                        min={0}
                        max={MAX_AGE}
                        sx={{ color: "secondary.main" }}
                    />
                </Box>

                {/* Sort Ascending or Dec */}
                <Select
                    label="Sort"
                    value={sortDir}
                    onChange={(e) => {
                        setSortDir(e.target.value as "asc" | "desc");
                        setPage(1);
                    }}
                    size="small"
                    sx={{ minWidth: 150, ml: 2 }}
                >
                    <MenuItem value="asc">Breed A→Z</MenuItem>
                    <MenuItem value="desc">Breed Z→A</MenuItem>
                </Select>
            </Box>

            {/* Paginated grid of dogs cards */}
            <Container sx={{ mt: 4, mb: 6}}>
                <Masonry
                    columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
                    spacing={2}
                >
                    {displayedDogs.map((dog) => (
                        <Box
                            key={dog.id}
                            sx={{
                                backgroundColor: '#f0f0f0',
                                padding: 2,
                                borderRadius: 2,
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                position: 'relative',
                                ":hover": {
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                    transform: 'scale(1.02)',
                                    transition: 'transform 0.01s, box-shadow 0.2s',
                                },
                            }}
                        >
                            <img
                                src={dog.img}
                                alt={dog.name}
                                style={{
                                    width: '100%',
                                    aspectRatio: '1 / 1',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                }}
                            />
                            <Typography variant="body2" sx={{ color: '#300d38' }}>
                                Name: {dog.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#300d38' }}>
                                Breed: {dog.breed}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#300d38' }}>
                                Age: {dog.age} years
                            </Typography>
                            {/* Favorites icon clickable, toggles between filled and outlined */}
                            <IconButton
                                sx={{
                                    color: favorites.includes(dog.id) ? '#FBA919' : '#300d38',
                                    position: 'absolute',
                                    bottom: 8,
                                    right: 8,
                                }}
                                onClick={() => {
                                    const newFavorites = favorites.includes(dog.id)
                                        ? favorites.filter((id) => id !== dog.id)
                                        : [...favorites, dog.id];
                                    setFavorites(newFavorites);
                                }}
                            >
                                {favorites.includes(dog.id) ? <Star /> : <StarOutline />}
                            </IconButton>
                        </Box>
                    ))}
                </Masonry>
                <Pagination
                    count={Math.ceil(total / PAGE_SIZE)}
                    page={page}
                    onChange={(_, v) => setPage(v)}
                    color="secondary"
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                />
            </Container>

            {/* Fav Drawer */}
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
                                key={favorite}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: 1,
                                    gap: 1,
                                    border: '1px solid #ccc',
                                    borderRadius: 1,
                                    marginBottom: 1,
                                    backgroundColor: '#f0f0f0',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                                }}
                            >
                                <img
                                    src={favoriteDogs[index]?.img}
                                    alt={favoriteDogs[index]?.name || 'Loading...'}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        objectFit: 'cover',
                                        borderRadius: 4,
                                        marginRight: 1,
                                    }}
                                />
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="body2" sx={{ color: '#300d38' }}>
                                        {favoriteDogs[index]?.name || 'Loading...'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#300d38' }}>
                                        Breed: {favoriteDogs[index]?.breed || 'Loading...'}
                                    </Typography>
                                </Box>
                                <IconButton
                                    onClick={() => {
                                        setFavorites((prev) =>
                                            prev.filter((id) => id !== favorite)
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
            
            {/* Match Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <Box
                    sx={{
                        padding: 2,
                        backgroundColor: '#f0f0f0',
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="h6" sx={{ color: '#300d38', marginBottom: 2 }}>
                        Your Match!
                    </Typography>
                    {matchDog ? (
                        <>
                            <img
                                src={matchDog.img}
                                alt={matchDog.name}
                                style={{
                                    maxWidth: '400px',
                                    aspectRatio: '1 / 1',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    marginBottom: 2,
                                }}
                            />
                            <Typography variant="body1" sx={{ color: '#300d38' }}>
                                Name: {matchDog.name}
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#300d38' }}>
                                Breed: {matchDog.breed}
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#300d38' }}>
                                Age: {matchDog.age} years
                            </Typography>
                        </>
                    ) : (
                        <Typography variant="body2" sx={{ color: '#300d38' }}>
                            No match found.
                        </Typography>
                    )}
                </Box>
            </Dialog>

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
