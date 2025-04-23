from django.db import models

# Create your models here.
from django.db import models

class Movie(models.Model):
    movie_id = models.IntegerField(unique=True)
    title = models.CharField(max_length=200)
    genres = models.CharField(max_length=200)
    
class Rating(models.Model):
    user_id = models.IntegerField()
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    rating = models.FloatField()