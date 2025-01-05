import random
from django.core.management.base import BaseCommand
from core.models import UserProfile
from faker import Faker

class Command(BaseCommand):
    help = "Populate the database with users having first name, last name, and optional bios"

    def handle(self, *args, **kwargs):
        faker = Faker()
        
        for i in range(25):  
            username = faker.user_name()
            email = faker.email()
            password = "password123"  
            first_name = faker.first_name()
            last_name = faker.last_name()
            bio = faker.sentence() if random.choice([True, False]) else None  
            if not UserProfile.objects.filter(username=username).exists():
                user = UserProfile.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    first_name=first_name,
                    last_name=last_name
                )
                
                if bio:
                    user.bio = bio  
                    user.save()

                self.stdout.write(
                    self.style.SUCCESS(
                        f"User created: {username}, {first_name} {last_name}, Bio: {bio or 'No bio'}"
                    )
                )
        
        self.stdout.write(self.style.SUCCESS("Database population complete!"))
