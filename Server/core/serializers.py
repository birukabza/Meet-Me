from rest_framework import serializers
from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            "user_id",
            "username",
            "bio",
            "avatar",
            "followers_count",
            "following_count",
        ]

    def get_followers_count(self, obj):
        return obj.followers.count()

    def get_following_count(self, obj):
        return obj.following.count()

    def validate_bio(self, value):
        if value:
            if len(value) > 600:
                raise serializers.ValidationError("Bio can not be greater than 600 characters")

class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = UserProfile
        fields = ["username", "email", "first_name", "last_name", "password"]
    

    def create(self, validated_data):
        user = UserProfile(
            username=validated_data.get("username"),
            email = validated_data.get("email"),
            first_name = validated_data.get("first_name"),
            last_name = validated_data.get("last_name") 
        )

        user.set_password(validated_data.get("password"))
        user.save()
        return user
