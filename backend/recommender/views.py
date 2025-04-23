import os
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from django.db.models import Q
import pandas as pd
import requests


TMDB_API_KEY = "a8f0c9314ef626f2fba393afcccae6ce"

@api_view(['GET'])
def search_movies(request):
    query = request.GET.get('q', '').lower()
    
    # Load movies data
    movies_path = os.path.join(settings.DATA_DIR, 'movies.csv')
    movies_df = pd.read_csv(movies_path)
    
    # Filter movies (case-insensitive)
    results = movies_df[
        movies_df['title'].str.lower().str.contains(query)
    ].head(20)  # Limit to 20 results
    
    # Format response
    return Response([{
        'id': row['movieId'],
        'title': row['title'],
        'year': row['title'][-5:-1] if '(' in row['title'] else ''
    } for _, row in results.iterrows()])

@api_view(['POST'])
def submit_rating(request):
    # Get data from request
    user_id = request.data.get('user_id', 1)  # Default to guest user
    movie_id = request.data.get('movie_id')
    rating = request.data.get('rating')
    
    # Load ratings data
    ratings_path = os.path.join(settings.DATA_DIR, 'ratings.csv')
    ratings_df = pd.read_csv(ratings_path)
    
    # Check if rating exists
    existing_rating = ratings_df[
        (ratings_df['userId'] == user_id) & 
        (ratings_df['movieId'] == movie_id)
    ]
    
    if not existing_rating.empty:
        # Update existing rating
        ratings_df.loc[
            (ratings_df['userId'] == user_id) & 
            (ratings_df['movieId'] == movie_id),
            'rating'
        ] = rating
    else:
        # Add new rating
        new_rating = pd.DataFrame([{
            'userId': user_id,
            'movieId': movie_id,
            'rating': rating,
            'timestamp': int(pd.Timestamp.now().timestamp())
        }])
        ratings_df = pd.concat([ratings_df, new_rating], ignore_index=True)
    
    # Save updated ratings
    ratings_df.to_csv(ratings_path, index=False)
    
    return Response({"status": "success"})

@api_view(['GET'])
def recommend_movies(request, movie_id):
    try:
        # 1. Load data from CSVs
        movies_path = os.path.join(settings.DATA_DIR, 'movies.csv')
        ratings_path = os.path.join(settings.DATA_DIR, 'ratings.csv')
        
        movies_df = pd.read_csv(movies_path)
        ratings_df = pd.read_csv(ratings_path)
        
        # 2. Create user-item matrix
        user_movie_matrix = ratings_df.pivot_table(
            index='userId',
            columns='movieId',
            values='rating',
            fill_value=0
        )
        
        # 3. Calculate movie similarity
        movie_similarity = cosine_similarity(user_movie_matrix.T)
        movie_similarity_df = pd.DataFrame(
            movie_similarity,
            index=user_movie_matrix.columns,
            columns=user_movie_matrix.columns
        )
        
        # 4. Get top similar movies
        similar_movies = movie_similarity_df[movie_id].sort_values(ascending=False)[1:6]
        recommended_ids = similar_movies.index.tolist()
        
        # 5. Get movie details and add TMDB data
        recommended_movies = []
        for movie_id in recommended_ids:
            movie_data = movies_df[movies_df['movieId'] == movie_id].iloc[0].to_dict()
            
            # Fetch TMDB data
            try:
                response = requests.get(
                    "https://api.themoviedb.org/3/search/movie",
                    params={
                        'api_key': TMDB_API_KEY,
                        'query': movie_data['title'].split(' (')[0],
                        'year': movie_data['title'][-5:-1] if '(' in movie_data['title'] else None
                    }
                )
                if response.status_code == 200:
                    tmdb_result = response.json().get('results', [])
                    if tmdb_result:
                        movie_data['poster_path'] = tmdb_result[0].get('poster_path')
                        movie_data['tmdb_rating'] = tmdb_result[0].get('vote_average')
            except Exception as e:
                print(f"TMDB API error for movie {movie_id}: {str(e)}")
            
            recommended_movies.append(movie_data)
        
        return Response(recommended_movies)  # Now includes TMDB data
        
    except Exception as e:
        return Response({"error": str(e)}, status=500)