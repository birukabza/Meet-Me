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
from core.models import UserProfile
from core.serializers import UserProfileSerializer, RegistrationSerializer

import logging

logger = logging.getLogger(__name__)
class AuthStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            {
                "message": "User is authenticated",
                "username": request.user.username,
            }
        )

class RegistrationApiView(APIView):
    def post(self, request, *args, **kwargs):

        try:
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
        except Exception as e:
            logger.error("Unexpected error in RegistrationAPIView: ", e)
            return Response(
                {
                    "success": False,
                    "error": "registration_error",
                    "detail": "Unexpected error while serializing in Registration",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)

            tokens = response.data
            username = request.data.get("username")

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
                serializer = UserProfileSerializer(user, many=False)
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

            res = Response(
                {
                    "success": True,
                    "message": "Login Successful",
                    "user": serializer.data,
                    "access_token": tokens.get("access"),
                    "refresh_token": tokens.get("refresh"),
                },
                status=status.HTTP_200_OK,
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
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {
                    "success": False,
                    "error": "Refresh token not provided",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)

            access_token = serializer.validated_data.get('access')
            return Response(
                {
                    "success": True,
                    "message": "Token refreshed successfully",
                    "access_token": access_token,
                },
                status=status.HTTP_200_OK,
            )
        except TokenError as e:
            if isinstance(e, InvalidToken):
                return Response(
                    {
                        "success": False,
                        "error": "invalid_token",
                        "detail": str(e),
                    },
                    status=status.HTTP_401_UNAUTHORIZED,
                )
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

