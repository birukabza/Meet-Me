from django.db import models
from django.contrib.auth.models import AbstractUser
from rest_framework.exceptions import ValidationError


class UserProfile(AbstractUser):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50, unique=True)
    bio = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to="avatar_image/", blank=True)
    followers = models.ManyToManyField(
        "self", symmetrical=False, related_name="following", blank=True
    )


    def clean(self):
        if self.bio:
            char_count = len(self.bio)
            if char_count > 600:
                raise ValidationError("Bio can not be greater than 600 characters")
        

    # over riding the built in save method
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


    def __str__(self):
        return self.username