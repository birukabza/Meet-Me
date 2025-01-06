from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from .views.auth_views import (
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    RegistrationApiView,
    AuthStatusView,
)

from .views.post_views import (
    CreatePostAPIView,
    TogglePostLike,
    GetUserPostApiView,
    FeedView,
    SinglePostView,
    DeletePostAPIView,
    UpdatePostAPIView,
)
from .views.profile_views import (
    UserProfileApiView,
    ToggleFollowView,
    EditProfileView,
)
from .views.search_views import SearchUserView


urlpatterns = [
    path("user/<str:username>/", UserProfileApiView.as_view(), name="user_profile"),
    path("token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", CustomTokenRefreshView.as_view(), name="token_refresh"),
    path("register/", RegistrationApiView.as_view(), name="register"),
    path("auth/status/", AuthStatusView.as_view(), name="auth_status"),
    path(
        "toggle_follow/<str:username>/",
        ToggleFollowView.as_view(),
        name="toggle_follow",
    ),
    path("posts/<str:username>", GetUserPostApiView.as_view(), name="user_posts"),
    path(
        "toggle_like_post/<int:post_id>/",
        TogglePostLike.as_view(),
        name="toggle_like_post",
    ),
    path("create_post/", CreatePostAPIView.as_view(), name="create_post"),
    path("feed/", FeedView.as_view(), name="feed"),
    path("search_user/", SearchUserView.as_view(), name="search_user"),
    path("edit_profile/", EditProfileView.as_view(), name="edit_profile"),
    path("post/<int:post_id>/", SinglePostView.as_view(), name="single_post_view"),
    path("post_delete/<int:post_id>/", DeletePostAPIView.as_view(), name="post_delete"),
    path("post_update/<int:post_id>/", UpdatePostAPIView.as_view(), name="post_update"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
