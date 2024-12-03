from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import (
    UserProfileApiView,
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    RegistrationApiView,
)


urlpatterns = [
    path("user/<str:username>/", UserProfileApiView.as_view(), name="user_profile"),
    path("token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", CustomTokenRefreshView.as_view(), name="token_refresh"),
    path("register/", RegistrationApiView.as_view(), name="register")
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
