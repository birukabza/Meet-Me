from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from core.models import UserProfile
from core.serializers import UserProfileSerializer
import logging

logger = logging.getLogger(__name__)


class UserProfileApiView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):

        try:
            user = UserProfile.objects.get(username=username)
            try:
                serializer = UserProfileSerializer(user, many=False)

                is_following = request.user in user.followers.all()

                return Response(
                    {
                        **serializer.data,
                        "is_self": request.user.username == user.username,
                        "is_following": is_following,
                    },
                    status=status.HTTP_200_OK,
                )

            except Exception as e:
                logger.error(
                    f"An error occurred while serializing the user data: {str(e)}"
                )
                return Response(
                    {
                        "success": False,
                        "error": "serialization_error",
                        "detail": f"An error occurred while serializing the user data: {str(e)}",
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        except UserProfile.DoesNotExist:
            raise NotFound(
                {
                    "success": False,
                    "error": "user_not_found",
                    "detail": f"The requested user with username {username} does not exist.",
                }
            )
        except Exception as e:
            return Response(
                {
                    "success": False,
                    "error": "internal_server_error",
                    "detail": "An unexpected error occurred. Please try again later.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )








class ToggleFollowView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        try:
            user_to_follow = UserProfile.objects.get(username=username)
            requesting_user = request.user

            if user_to_follow.user_id == requesting_user.user_id:
                return Response(
                    {
                        "success": False,
                        "error": "not_allowed",
                        "detail": "You can't Follow/unfollow yourself",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if requesting_user in user_to_follow.followers.all():
                user_to_follow.followers.remove(requesting_user)
                return Response(
                    {"success": True, "detail": "Successfully unfollowed"},
                    status=status.HTTP_200_OK,
                )
            else:
                user_to_follow.followers.add(requesting_user)
                return Response(
                    {"success": True, "detail": "Successfully followed"},
                    status=status.HTTP_200_OK,
                )

        except UserProfile.DoesNotExist:
            raise NotFound(
                {
                    "success": False,
                    "error": "user_not_found",
                    "detail": f"User  does not exist.",
                }
            )
        except Exception as e:
            return Response(
                {
                    "success": False,
                    "error": "internal_server_error",
                    "detail": "An unexpected error occurred.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class EditProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        try:
            user = request.user
            serializer = UserProfileSerializer(
                user, data=request.data, partial=True
            )
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "success": True,
                        "data": serializer.data,
                    },
                    status=status.HTTP_200_OK,
                )
            return Response(
                {
                    "success": False,
                    "error": "validation_error",
                    "detail": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            logger.error(f"Unexpected error in EditProfileView: {str(e)}")
            return Response(
                {
                    "success": False,
                    "error": "internal_server_error",
                    "detail": "An unexpected error occurred while updating the profile.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        



