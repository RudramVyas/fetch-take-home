// React and hooks
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import {
    Badge,
    Box,
    Button,
    Drawer,
    IconButton,
    TextField,
    Typography,
    Autocomplete,
    Slider,
    Pagination,
    Container,
    Dialog,
    Select,
    MenuItem,
} from '@mui/material';
import { Masonry } from '@mui/lab';

// Icons
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Search as SearchIcon, Star, StarOutline } from '@mui/icons-material';

import { Dog, Location } from '../services/types';
import {
    getBreeds,
    searchDogs,
    getDogsByIds,
    matchDogs,
    getLocationsByZip,
} from '../services/api';


const PAGE_SIZE = 12; // Number of dogs per page
const MAX_AGE = 25; // Maximum age for the slider

const Search: React.FC = () => {
    // Navigation and authentication hooks
    const navigate = useNavigate();
    const { logout } = useAuth();

    // State variables

    // Filter and search states
    const [breedsOptions, setBreedsOptions] = useState<string[]>([]);
    const [zipCodes, setZipCodes] = useState<string[]>([]);
    const [zipInput, setZipInput] = useState('');
    const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
    const [ageRange, setAgeRange] = useState<number[]>([0, MAX_AGE]);
    const [nameQuery, setNameQuery] = useState('');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    // const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

    // Dogs data and pagination states
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);

    // Favorites and match states
    const [favorites, setFavorites] = useState<string[]>([]);
    const [favoriteDogs, setFavoriteDogs] = useState<Dog[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [locationMapping, setLocationMapping] = useState<Record<string, Location>>({});

    // Match dog state
    const [matchDog, setMatchDog] = useState<Dog | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Use effects to fetch data and manage state
    useEffect(() => {
        getBreeds().then((res) => setBreedsOptions(res.data));
    }, []);

    useEffect(() => {
        const fetchDogs = async () => {
            // setLoading(true);
            try {
                const from = (page - 1) * PAGE_SIZE;
                const resp = await searchDogs({
                    breeds: selectedBreeds,
                    zipCodes:
                        zipCodes.length && zipCodes[0].length === 5
                            ? zipCodes
                            : undefined,
                    ageMin: ageRange[0],
                    ageMax: ageRange[1],
                    size: PAGE_SIZE,
                    from,
                    sort: 'breed',
                    sortDirection: sortDir,
                });

                setTotal(resp.data.total);
                const details = await getDogsByIds(resp.data.resultIds);
                setDogs(details.data);
                console.log("Total:", resp.data.total, "Dogs fetched:", details.data.length, "Dogs Len:", dogs.length);
            } catch (error) {
                console.error('Error fetching dogs:', error);
                alert('Failed to fetch dogs. Please try again later.');
            }
        };

        fetchDogs();
        return;
    }, [selectedBreeds, ageRange, sortDir, page, zipCodes]);

    useEffect(() => {
        if (!favorites.length) return setFavoriteDogs([]);
        getDogsByIds(favorites).then((res) => setFavoriteDogs(res.data));
    }, [favorites]);

    useEffect(() => {
        const uniqueZips = Array.from(new Set(dogs.map((dog) => dog.zip_code)));
        if (uniqueZips.length) {
            getLocationsByZip(uniqueZips)
                .then((res) => {
                    const mapping: Record<string, Location> = {};
                    res.data.forEach((loc: Location) => {
                        mapping[loc.zip_code] = loc;
                    });
                    setLocationMapping(mapping);
                })
                .catch((err) =>
                    console.error('Error fetching location data:', err)
                );
        }
    }, [dogs]);

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
        <>
            {/* Matching Button */}
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

                {/* Search by Zip */}
                <TextField
                    label="Search Zip"
                    value={zipInput}
                    onChange={(e) => {
                        setZipInput(e.target.value)
                        const zips = zipInput.split(',').map(s => s.trim()).filter(Boolean);
                        setZipCodes(zips);
                        setPage(1);
                    }}
                    placeholder="e.g. 12345, 67890"
                    sx={{ minWidth: 200 }}
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
                            size: 'small',
                            color: 'secondary',
                            sx: {
                                maxWidth: 80,
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
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
                    sx={{ minWidth: 200}}
                />

                {/* Sort Ascending or Dec */}
                <Select
                    value={sortDir}
                    onChange={(e) => {
                        setSortDir(e.target.value as 'asc' | 'desc');
                        setPage(1);
                    }}
                    size="small"
                    sx={{ minWidth: 200}}
                >
                    <MenuItem value="asc">Breed A → Z</MenuItem>
                    <MenuItem value="desc">Breed Z → A</MenuItem>
                </Select>

                {/* Age Slider */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minWidth: '200px',
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
                        sx={{ color: 'secondary.main' }}
                    />
                </Box>
            </Box>

            {/* Paginated grid of dogs cards */}
            <Container sx={{ mt: 4, mb: 6 }}>
                <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
                    {dogs.map((dog) => (
                        <Box
                            key={dog.id}
                            sx={{
                                backgroundColor: '#f0f0f0',
                                padding: 2,
                                borderRadius: 2,
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                position: 'relative',
                                ':hover': {
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                    transform: 'scale(1.02)',
                                    transition:
                                        'transform 0.01s, box-shadow 0.2s',
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
                            <Typography
                                variant="body2"
                                sx={{ color: '#300d38' }}
                            >
                                Hey, you can call me <strong>{dog.name}</strong>!
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: '#300d38' }}
                            >
                                I am a <strong>{dog.age}</strong> y/o <strong>{dog.breed}</strong>.      
                            </Typography>
                            {locationMapping[dog.zip_code] && (
                                <>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: '#300d38', alignItems: 'bottom' }}
                                    >
                                        {locationMapping[dog.zip_code].city},{' '}
                                        {locationMapping[dog.zip_code].state}{' - '}
                                        {dog.zip_code}
                                    </Typography>
                                </>
                            )}
                            {/* Favorites icon clickable, toggles between filled and outlined */}
                            <IconButton
                                sx={{
                                    color: favorites.includes(dog.id)
                                        ? '#FBA919'
                                        : '#300d38',
                                    position: 'absolute',
                                    bottom: 8,
                                    right: 8,
                                }}
                                onClick={() => {
                                    const newFavorites = favorites.includes(
                                        dog.id
                                    )
                                        ? favorites.filter(
                                              (id) => id !== dog.id
                                          )
                                        : [...favorites, dog.id];
                                    setFavorites(newFavorites);
                                }}
                            >
                                {favorites.includes(dog.id) ? (
                                    <Star />
                                ) : (
                                    <StarOutline />
                                )}
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
                                    alt={
                                        favoriteDogs[index]?.name ||
                                        'Loading...'
                                    }
                                    style={{
                                        width: 50,
                                        height: 50,
                                        objectFit: 'cover',
                                        borderRadius: 4,
                                        marginRight: 1,
                                    }}
                                />
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: '#300d38' }}
                                    >
                                        {favoriteDogs[index]?.name ||
                                            'Loading...'}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: '#300d38' }}
                                    >
                                        Breed:{' '}
                                        {favoriteDogs[index]?.breed ||
                                            'Loading...'}
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
                    <Typography
                        variant="h6"
                        sx={{ color: '#300d38', marginBottom: 2 }}
                    >
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
                            <Typography
                                variant="body2"
                                sx={{ color: '#300d38' }}
                            >
                                Hey, you can call me{' '}
                                <strong>{matchDog.name}</strong>! <br />I am a{' '}
                                <strong>{matchDog.age}</strong> y/o{' '}
                                <strong>{matchDog.breed}</strong>.
                            </Typography>
                            {locationMapping[matchDog.zip_code] && (
                                <Typography
                                    variant="body2"
                                    sx={{ color: '#300d38' }}
                                >
                                    {locationMapping[matchDog.zip_code].city},{' '}
                                    {locationMapping[matchDog.zip_code].state}{' '}
                                    - {matchDog.zip_code}
                                </Typography>
                            )}
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => setDialogOpen(false)}
                                sx={{ marginTop: 2 }}
                            >
                                Close
                            </Button>
                        </>
                    ) : (
                        <Typography variant="body2" sx={{ color: '#300d38' }}>
                            No match found.
                        </Typography>
                    )}
                </Box>
            </Dialog>
        </>
    );
};

export default Search;
