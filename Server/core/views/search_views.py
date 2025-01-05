from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from core.models import UserProfile
from core.serializers import UserProfileSerializer
from core.filters import UserProfileFilter
import logging

logger = logging.getLogger(__name__)


class SearchUserPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 100

class SearchUserView(ListAPIView):
    """
    Filter users based on their username, first_name, last_name
    """

    serializer_class = UserProfileSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = UserProfileFilter
    pagination_class = SearchUserPagination

    def get_queryset(self):
        if self.request.query_params.get("search"):
            return UserProfile.objects.all()
        return UserProfile.objects.none()