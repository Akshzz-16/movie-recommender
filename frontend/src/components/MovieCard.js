import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

export default function MovieCard({ movie }) {
  // Extract clean title and year
  const title = movie.title.replace(/\s*\(\d{4}\)$/, '');
  const yearMatch = movie.title.match(/\((\d{4})\)/);
  const year = yearMatch ? yearMatch[1] : '';

  // Handle poster image
  const posterUrl = movie.poster_path 
  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
  : '/placeholder.jpg';

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="500"
        image={posterUrl}
        alt={title}
        sx={{
          objectFit: 'cover',
          backgroundColor: '#f5f5f5' // Fallback color
        }}
      />
      <CardContent>
        <Typography gutterBottom variant="h6">
          {title} {year && `(${year})`}
        </Typography>
        <Typography variant="body2">
          TMDB Rating: {movie.tmdb_rating || 'N/A'}
        </Typography>
      </CardContent>
    </Card>
  );
}