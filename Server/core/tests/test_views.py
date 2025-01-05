from rest_framework.test import APIClient
from rest_framework import status
from django.test import TestCase
from core.models import UserProfile, Post
from rest_framework_simplejwt.tokens import RefreshToken
from django.urls import reverse


class UserProfileApiViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = UserProfile.objects.create_user(
            username="testuser", password="password"
        )

        response = self.client.post(
            "/api/token/", data={"username": "testuser", "password": "password"}
        )
        self.token = response.data["access_token"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

    def test_get_user_profile(self):
        response = self.client.get(f"/api/user/{self.user.username}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("username", response.data)
        self.assertIn("is_self", response.data)
        self.assertIn("is_following", response.data)

    def test_user_not_found(self):
        response = self.client.get("/api/user/nonexistentuser/")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"], "user_not_found")


class RegistrationApiViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_registration_success(self):
        data = {
            "username": "newuser",
            "first_name": "test",
            "last_name": "user",
            "password": "password",
            "email": "newuser@example.com",
        }
        response = self.client.post("/api/register/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("success", response.data)
        self.assertIn("data", response.data)

    def test_registration_error(self):
        data = {"username": "newuser", "password": "short", "email": "invalidemail"}
        response = self.client.post("/api/register/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("registration_error", response.data["error"])


class GetUserPostApiViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = UserProfile.objects.create_user(
            username="testuser", password="password"
        )

        response = self.client.post(
            "/api/token/", data={"username": "testuser", "password": "password"}
        )
        self.token = response.data["access_token"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

        self.post = Post.objects.create(user=self.user, content="Test Post")

    def test_get_user_posts(self):
        url = reverse("user_posts", kwargs={"username": self.user.username})

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_posts_not_found(self):
        response = self.client.get("/api/posts/nonexistentuser/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class TogglePostLikeTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = UserProfile.objects.create_user(
            username="testuser", password="password"
        )

        response = self.client.post(
            "/api/token/", data={"username": "testuser", "password": "password"}
        )
        self.token = response.data["access_token"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

        self.post = Post.objects.create(user=self.user, content="Test Post")

    def test_toggle_like_post(self):
        url = reverse("toggle_like_post", kwargs={"post_id": self.post.post_id})

        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("liked", response.data)

    def test_post_not_found(self):
        url = reverse("toggle_like_post", kwargs={"post_id": 999})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class CreatePostAPIViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = UserProfile.objects.create_user(
            username="testuser", password="password"
        )

        response = self.client.post(
            "/api/token/", data={"username": "testuser", "password": "password"}
        )
        self.token = response.data["access_token"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

    def test_create_post_success(self):
        data = {"image": "test.png", "content": "New test post"}
        response = self.client.post("/api/create_post/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_post_validation_error(self):
        data = {"content": "wr"}
        response = self.client.post("/api/create_post/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ToggleFollowViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = UserProfile.objects.create_user(
            username="testuser1", password="password"
        )
        self.user2 = UserProfile.objects.create_user(
            username="testuser2", password="password"
        )

        response = self.client.post(
            "/api/token/", data={"username": "testuser1", "password": "password"}
        )
        self.token = response.data["access_token"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

    def test_follow_user(self):
        url = reverse("toggle_follow", kwargs={"username": self.user2.username})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("success", response.data)

    def test_unfollow_user(self):
        self.user2.followers.add(self.user1)
        url = reverse("toggle_follow", kwargs={"username": self.user2.username})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("success", response.data)

    def test_follow_self_error(self):
        url = reverse("toggle_follow", kwargs={"username": self.user1.username})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class FeedViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = UserProfile.objects.create_user(
            username="testuser", password="password"
        )

        response = self.client.post(
            "/api/token/", data={"username": "testuser", "password": "password"}
        )
        self.token = response.data["access_token"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

        self.posts = [
            Post.objects.create(
                user=self.user, image=f"test{i}.png", content=f"Post {i}"
            )
            for i in range(40)
        ]

    def test_feed_view(self):
        response = self.client.get("/api/feed/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 35)

    def test_feed_pagination(self):
        response = self.client.get("/api/feed/?page=2&page_size=10")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 10)


class SearchUserViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = UserProfile.objects.create_user(
            username="user1",
            first_name="First1",
            last_name="Last1",
            password="password",
        )
        self.user2 = UserProfile.objects.create_user(
            username="user2",
            first_name="First2",
            last_name="Last2",
            password="password",
        )
        self.user3 = UserProfile.objects.create_user(
            username="user3",
            first_name="First3",
            last_name="Last3",
            password="password",
        )
        self.user4 = UserProfile.objects.create_user(
            username="user4",
            first_name="First4",
            last_name="Last4",
            password="password",
        )

    def test_search_user_with_pagination(self):
        url = reverse("search_user")

        # Test without search, expecting no results
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 0)

        # Test with search query, expecting a list of users
        response = self.client.get(url, {"search": "First"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 4)

        # Test pagination - page 1
        response = self.client.get(url, {"search": "First", "page": 1})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            len(response.data["results"]), 4
        )  # The results should be 4 since it’s less than the page size

        # Test with page size greater than the default page size (12), expecting a max of 100
        response = self.client.get(url, {"search": "First", "page_size": 100})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 4)

        # Test pagination with a page size of 2
        response = self.client.get(url, {"search": "First", "page_size": 2, "page": 1})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)
        self.assertIn("next", response.data)

        # Test pagination with page 2 and page size 2
        response = self.client.get(url, {"search": "First", "page_size": 2, "page": 2})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)

    def test_search_user_by_username(self):
        url = reverse("search_user")

        response = self.client.get(url, {"search": "user"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 4)

    def test_search_user_by_first_name(self):
        url = reverse("search_user")

        response = self.client.get(url, {"search": "first"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 4)

    def test_search_user_by_last_name(self):
        url = reverse("search_user")

        response = self.client.get(url, {"search": "last"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 4)

    def test_search_user_no_results(self):
        url = reverse("search_user")

        # Test with search query that doesn't match any users
        response = self.client.get(url, {"search": "NonExistentUser"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 0)


class EditProfileViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = UserProfile.objects.create_user(
            username="testuser", password="password"
        )

        response = self.client.post(
            "/api/token/", data={"username": "testuser", "password": "password"}
        )
        self.token = response.data["access_token"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

    def test_edit_profile_all_fields(self):
        data = {
            "first_name": "NewName",
            "avatar": "NewAvatar",
            "last_name": "newLastname",
            "bio": "NewBio",
        }
        response = self.client.patch("/api/edit_profile/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("success", response.data)

    def test_edit_profile_by_first_name(self):
        data = {"first_name": "NewName"}
        response = self.client.patch("/api/edit_profile/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("success", response.data)

    def test_edit_profile_by_avatar(self):
        data = {"avatar": "NewAvatar"}
        response = self.client.patch("/api/edit_profile/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("success", response.data)

    def test_edit_profile_validation_error(self):
        data = {"bio": "A" * 605}
        response = self.client.patch("/api/edit_profile/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("validation_error", response.data["error"])


class AuthStatusViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = UserProfile.objects.create_user(
            username="testuser", password="password"
        )

    def test_authenticated_user_status(self):

        response_auth = self.client.post(
            "/api/token/", data={"username": "testuser", "password": "password"}
        )
        self.token = response_auth.data["access_token"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")
        response = self.client.get("/api/auth/status/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("message", response.data)
        self.assertIn("username", response.data)

    def test_unauthenticated_user_status(self):
        response = self.client.get("/api/auth/status/")
        print(response.status_code)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("detail", response.data)

class CustomTokenObtainPairViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = UserProfile.objects.create_user(username='testuser', password='password')

    def test_token_obtain_pair(self):
        data = {'username': 'testuser', 'password': 'password'}
        response = self.client.post('/api/token/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access_token', response.data)
        self.assertIn('refresh_token', response.data)

    def test_token_obtain_pair_invalid_credentials(self):
        data = {'username': 'testuser1', 'password': 'password'}
        response = self.client.post('/api/token/', data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class CustomTokenRefreshViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_token_refresh(self):
        data = {'refresh': 'some_valid_refresh_token'}
        response = self.client.post('/api/token/refresh/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_token_refresh_no_token(self):
        response = self.client.post('/api/token/refresh/', {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

class CustomTokenRefreshViewTest(TestCase):
    def setUp(self):
        self.user = UserProfile.objects.create_user(
            username='testuser',
            password='testpassword'
        )

        refresh = RefreshToken.for_user(self.user)
        self.valid_refresh_token = str(refresh)

        self.client = APIClient()

    def test_token_refresh(self):
        data = {'refresh': self.valid_refresh_token}
        response = self.client.post('/api/token/refresh/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_token_refresh_no_token(self):
        response = self.client.post('/api/token/refresh/', {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
    
    def test_token_refresh_invalid_token(self):
        response = self.client.post('/api/token/refresh/', {"refresh": "Invalid"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        
