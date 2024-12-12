from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import (
    UserProfileApiView,
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    RegistrationApiView,
    AuthStatusView,
    ToggleFollowView,
    GetUserPostApiView,
)


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
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
