from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, AuthenticationFailed
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import (
    InvalidToken,
    TokenError,
)
from .models import UserProfile, Post
from .serializers import UserProfileSerializer, RegistrationSerializer, PostSerializer
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


class RegistrationApiView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"success": True, "data": serializer.data},
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "success": False,
                "error": "registration_error",
                "detail": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class GetUserPostApiView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):

        try:
            user = UserProfile.objects.get(username=username)
        except UserProfile.DoesNotExist:
            raise NotFound(
                {
                    "success": False,
                    "error": "user_not_found",
                    "detail": f"The requested user with username {username} does not exist.",
                }
            )
        try:
            posts = user.posts.all()
            serializer = PostSerializer(posts, many=True)
            return Response(
                {"success": True, "data": serializer.data},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {
                    "success": False,
                    "error": "serialization_error",
                    "detail": f"An error occurred while serializing the user data: {str(e)}",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class AuthStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            {
                "message": "User is authenticated",
                "username": request.user.username,
            }
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


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)

            tokens = response.data

            access_token = tokens.get("access")
            refresh_token = tokens.get("refresh")

            res = Response(
                {
                    "success": True,
                    "message": "Login Successful",
                },
                status=status.HTTP_200_OK,
            )
            res.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                samesite="None",
                secure=True,
                path="/",
            )
            res.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                samesite="None",
                secure=True,
                path="/",
            )
            return res

        except AuthenticationFailed as e:
            print(f"error in while authenticating: {e}")
            return Response(
                {
                    "success": False,
                    "error": "invalid_credentials",
                    "detail": "Invalid username or password.",
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        except Exception as e:
            print(f"Unexpected error: {e}")
            return Response(
                {
                    "success": False,
                    "error": "internal_server_error",
                    "detail": "An unexpected error occurred. Please try again later.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get("refresh_token")

            if not refresh_token:
                return Response(
                    {"success": False, "error": "Refresh token not provided"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            mutable_data = request.data.copy()
            mutable_data["refresh"] = refresh_token
            request.__full__data = mutable_data

            response = super().post(request, *args, **kwargs)

            tokens = response.data
            new_access_token = tokens.get("access")

            res = Response(
                {
                    "success": True,
                    "message": "Token refreshed successfully",
                },
                status=status.HTTP_200_OK,
            )

            res.set_cookie(
                key="access_token",
                value=new_access_token,
                httponly=True,
                secure=True,
                samesite="None",
                path="/",
            )

            return res
        except InvalidToken as e:
            return Response(
                {
                    "success": False,
                    "error": "invalid_token",
                    "detail": str(e),
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )
        except TokenError as e:
            return Response(
                {
                    "success": False,
                    "error": "token_error",
                    "detail": str(e),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return Response(
                {
                    "success": False,
                    "error": "internal_server_error",
                    "detail": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
