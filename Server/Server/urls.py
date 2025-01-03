from django.contrib import admin
from django.urls import path, include
from .home_view import home_view

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", home_view),
    path("api/", include("core.urls")),
]
