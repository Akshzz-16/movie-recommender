import csv
import os
from django.core.management.base import BaseCommand
from django.conf import settings
from recommender.models import Rating

class Command(BaseCommand):
    help = 'Load ratings from CSV in data folder'

    def handle(self, *args, **options):
        data_path = os.path.join(settings.BASE_DIR, 'data', 'ratings.csv')
        batch_size = 1000
        ratings = []
        
        with open(data_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for i, row in enumerate(reader):
                ratings.append(Rating(
                    user_id=row['userId'],
                    movie_id=row['movieId'],
                    rating=row['rating']
                ))
                if len(ratings) % batch_size == 0:
                    Rating.objects.bulk_create(ratings)
                    ratings = []
            if ratings:  # Create remaining records
                Rating.objects.bulk_create(ratings)
                
        self.stdout.write(self.style.SUCCESS(f'Loaded {i+1} ratings'))