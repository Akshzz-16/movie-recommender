from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import numpy as np

class MovieRecommender:
    def __init__(self):
        self.user_movie_matrix = None
        self.movie_similarity = None
        
    def fit(self, ratings):
        # Create user-item matrix
        self.user_movie_matrix = ratings.pivot_table(
            index='user_id', columns='movie_id', values='rating'
        ).fillna(0)
        
        # Calculate item-item similarity
        self.movie_similarity = cosine_similarity(self.user_movie_matrix.T)
        
    def recommend(self, movie_id, n=5):
        # Get similar movies
        movie_idx = list(self.user_movie_matrix.columns).index(movie_id)
        similar_movies = list(enumerate(self.movie_similarity[movie_idx]))
        similar_movies = sorted(similar_movies, key=lambda x: x[1], reverse=True)[1:n+1]
        
        return [self.user_movie_matrix.columns[i[0]] for i in similar_movies]