from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework import status
from .models import UserProfile
from .serializers import UserProfileSerializer


class UserProfileApiView(APIView):

    def get(self, request, username):

        try:
            user = UserProfile.objects.get(username=username)
            try:
                serializer = UserProfileSerializer(user)
                return Response(serializer.data, status=status.HTTP_200_OK)

            except Exception as e:
                return Response(
                    {
                        "error": "serialization_error",
                        "detail": f"An error occurred while serializing the user data: {str(e)}",
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        except UserProfile.DoesNotExist:
            raise NotFound(
                {
                    "error": "user_not_found",
                    "detail": f"The requested user with user_id {username} does not exist.",
                }
            )
        except Exception as e:
            return Response(
                {
                    "error": "internal_server_error",
                    "detail": "An unexpected error occurred. Please try again later.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
