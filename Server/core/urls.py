from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import UserProfileApiView

urlpatterns = [
    path("user/<str:username>/", UserProfileApiView.as_view(), name="user_profile"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
