from django.contrib import admin
from django.urls import path, include
from .home_view import home_view
import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

ADMIN_URL = os.getenv('DJANGO_ADMIN_URL') if 'RENDER_EXTERNAL_HOSTNAME' in os.environ else "admin/"

urlpatterns = [
    path(ADMIN_URL, admin.site.urls),
    path("", home_view),
    path("api/", include("core.urls")),
]
