from django.core.management.base import BaseCommand
from faker import Faker
from core.models import UserProfile, Post
from .dummy_data import random_images
import random

class Command(BaseCommand):
    help = "Populate the database with posts, each tied to a unique image from the list"

    def handle(self, *args, **kwargs):
        faker = Faker()

        users = list(UserProfile.objects.all())

        if not users:
            self.stdout.write(self.style.ERROR("No users found in the database. Add users before populating posts."))
            return

        if not random_images:
            self.stdout.write(self.style.ERROR("No images found in the 'random_images' list."))
            return

        for image in random_images:
            user = random.choice(users)

            content = faker.paragraph(nb_sentences=3)  
            post = Post.objects.create(
                user=user,
                content=content,
                image=image,
            )

            num_likes = random.randint(0, len(users))  
            liked_users = random.sample(users, k=num_likes) if num_likes > 0 else []
            post.likes.add(*liked_users)

            self.stdout.write(
                self.style.SUCCESS(
                    f"Created post: {post} with image {image} and {num_likes} likes."
                )
            )

        self.stdout.write(self.style.SUCCESS("Database population with posts complete!"))
