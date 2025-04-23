import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Grid, 
  Typography, 
  Rating as MuiRating,
  CircularProgress,
  Box
} from '@mui/material';
import { searchMovies, submitRating, getRecommendations } from '../services/api';
import MovieCard from '../components/MovieCard';

export default function Recommendations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userId] = useState(1); // Replace with actual user ID

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await searchMovies(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRateMovie = async (newValue) => {
    if (!selectedMovie) return;
    setUserRating(newValue);
    try {
      await submitRating(userId, selectedMovie.id, newValue * 2);
      // Refresh recommendations after rating
      const data = await getRecommendations(selectedMovie.id);
      setRecommendations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Rating submission failed:", error);
    }
  };

  useEffect(() => {
    const loadRecommendations = async () => {
      if (selectedMovie) {
        setLoading(true);
        try {
          const data = await getRecommendations(selectedMovie.id);
          setRecommendations(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Failed to load recommendations:", error);
          setRecommendations([]);
        } finally {
          setLoading(false);
        }
      }
    };
    loadRecommendations();
  }, [selectedMovie]);

  return (
    <Box sx={{ p: 3 }}>
      {/* Search Section */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Search Movies"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          disabled={loading}
        />
        <Button 
          variant="contained" 
          onClick={handleSearch}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Search
        </Button>
      </Box>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>Search Results</Typography>
          <Grid container spacing={2}>
            {searchResults.map((movie) => {
              const yearMatch = movie.title.match(/\((\d{4})\)/);
              const year = yearMatch ? yearMatch[1] : '';
              const titleWithoutYear = movie.title.replace(/\s*\(\d{4}\)$/, '');
              
              return (
                <Grid item xs={6} sm={4} md={3} key={movie.id}>
                  <Box
                    onClick={() => setSelectedMovie(movie)}
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      cursor: 'pointer',
                      bgcolor: selectedMovie?.id === movie.id ? 'action.selected' : 'background.paper',
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}
                  >
                    <Typography>{titleWithoutYear}</Typography>
                    {year && <Typography variant="body2" color="text.secondary">({year})</Typography>}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}

      {/* Selected Movie */}
      {selectedMovie && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Recommendations for: {selectedMovie.title.replace(/\s*\(\d{4}\)$/, '')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography>Your Rating:</Typography>
            <MuiRating
              value={userRating}
              onChange={(_, newValue) => handleRateMovie(newValue)}
              disabled={loading}
            />
          </Box>
        </Box>
      )}

      {/* Recommendations */}
      {loading ? (
        <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
      ) : (
        <Grid container spacing={3}>
          {recommendations.map((movie) => (
            <Grid item xs={12} sm={6} md={4} key={movie.movieId || movie.id}>
              <MovieCard movie={movie} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}