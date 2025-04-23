import csv
import os
from django.core.management.base import BaseCommand
from django.conf import settings
from recommender.models import Movie

class Command(BaseCommand):
    help = 'Load movies from CSV in data folder'

    def handle(self, *args, **options):
        data_path = os.path.join(settings.BASE_DIR, 'data', 'movies.csv')
        
        with open(data_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                Movie.objects.get_or_create(
                    movie_id=row['movieId'],
                    title=row['title'],
                    genres=row['genres']
                )
        self.stdout.write(self.style.SUCCESS(f'Loaded {Movie.objects.count()} movies'))