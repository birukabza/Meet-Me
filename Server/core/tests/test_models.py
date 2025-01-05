from django.test import TestCase
from rest_framework.exceptions import ValidationError
from core.models import UserProfile, Post

# Test UserProfile Model
class UserProfileTest(TestCase):
    def setUp(self):
        self.user = UserProfile.objects.create_user(
            username="testuser", password="password123"
        )

    def test_user_creation(self):
        """Test that a user is created with the correct fields"""
        self.assertEqual(self.user.username, "testuser")
        self.assertEqual(self.user.bio, None)
        self.assertIsNone(self.user.avatar)

    def test_bio_length_validation(self):
        """Test the bio validation"""
        self.user.bio = "A" * 601  
        with self.assertRaises(ValidationError):
            self.user.clean()  

    def test_user_profile_str_method(self):
        """Test the __str__ method of UserProfile"""
        self.assertEqual(str(self.user), "testuser")

    def test_following(self):
        """Test the following functionality"""
        user2 = UserProfile.objects.create_user(username="testuser2", password="password123")
        self.user.followers.add(user2)
        self.assertIn(user2, self.user.followers.all())
        self.assertIn(self.user, user2.following.all())
        self.assertNotIn(user2, self.user.following.all())

# Test Post Model
class PostTest(TestCase):
    def setUp(self):
        self.user = UserProfile.objects.create_user(username="testuser", password="password123")
        self.post = Post.objects.create(
            user=self.user, content="Test post content", image="test.jpg"
        )

    def test_post_creation(self):
        """Test that a post is created correctly"""
        self.assertEqual(self.post.user, self.user)
        self.assertEqual(self.post.content, "Test post content")
        self.assertTrue(self.post.image.url.startswith("http"))
        self.assertIn("cloudinary.com", self.post.image.url)
        self.assertEqual(str(self.post), f"Post by {self.user.username} at {self.post.created_at}")


    def test_post_str_method(self):
        """Test the __str__ method of Post"""
        post_str = f"Post by {self.user.username} at {self.post.created_at}"
        self.assertEqual(str(self.post), post_str)

    def test_post_likes(self):
        """Test the likes functionality of a post"""
        user2 = UserProfile.objects.create_user(username="testuser2", password="password123")
        self.post.likes.add(user2)
        self.assertIn(user2, self.post.likes.all())

    def test_post_ordering(self):
        """Test the ordering of posts based on created_at"""
        post2 = Post.objects.create(
            user=self.user, content="Another test post", image="test2.jpg"
        )
        posts = Post.objects.all()
        self.assertGreaterEqual(posts[0].created_at, posts[1].created_at) 


   
