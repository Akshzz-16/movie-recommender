from django.urls import path
from . import views

urlpatterns = [
    path('recommend/<int:movie_id>/', views.recommend_movies, name='recommend_movies'),
    path('search/', views.search_movies, name='search-movies'),
    path('rate/', views.submit_rating, name='submit-rating'),
    path('recommend/<int:movie_id>/', views.recommend_movies, name='recommend-movies'),
]
