from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError


class UserProfile(AbstractUser):
    username = models.CharField(max_length=50, unique=True, primary_key=True)
    bio = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to="avatar_image/", blank=True, null=True)
    followers = models.ManyToManyField(
        "self", symmetrical=False, related_name="following"
    )

    def clean(self):
        if self.bio:
            char_count = len(self.bio)
            if char_count > 600:
                raise ValidationError("Bio can not be greater tha 600 characters")

    # over riding the built in save method
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
