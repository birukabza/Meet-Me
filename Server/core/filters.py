from django_filters import rest_framework as filters
from .models import UserProfile
from django.db.models import Q


class UserProfileFilter(filters.FilterSet):
    search = filters.CharFilter(method='search_filter', label='Search')

    class Meta:
        model = UserProfile
        fields = []

    def search_filter(self, queryset, name, value):
        return queryset.filter(
            Q(username__icontains=value) | 
            Q(first_name__icontains=value) |
            Q(last_name__icontains=value)
        )