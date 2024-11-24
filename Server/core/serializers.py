from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    follower_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ["username", "bio", "avatar", ]
    
    def get_follower_count(self, obj):
        return obj.followers.count()
    
    def get_following_count(self, obj):
        return obj.following.count()
    
    def validate_bio(self, value):
        if value:
            if len(value) > 600:
                raise ValidationError("Bio can not be greater than 600 characters")
