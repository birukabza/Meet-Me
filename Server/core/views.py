from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, AuthenticationFailed
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import (
    InvalidToken,
    TokenError,
)
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from .models import UserProfile, Post
from .serializers import UserProfileSerializer, RegistrationSerializer, PostSerializer
from .filters import UserProfileFilter
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
            serialized_data = serializer.data

            for post in serialized_data:
                post_obj = posts.get(post_id=post["post_id"])
                post["is_liked"] = request.user in post_obj.likes.all()

            return Response(
                {"success": True, "data": serialized_data},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            logger.error(f"An error occurred while serializing the user data: {str(e)}")
            return Response(
                {
                    "success": False,
                    "error": "serialization_error",
                    "detail": f"An error occurred while serializing the user data: {str(e)}",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class TogglePostLike(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        try:
            post_to_like = Post.objects.get(post_id=post_id)
            request_user = request.user
            liked: bool = False
            if request.user in post_to_like.likes.all():
                liked = False
                post_to_like.likes.remove(request_user)
            else:
                liked = True
                post_to_like.likes.add(request_user)

            return Response(
                {"success": True, "liked": liked},
                status=status.HTTP_200_OK,
            )

        except Post.DoesNotExist:
            return NotFound(
                {
                    "success": False,
                    "error": "post_not_found",
                    "detail": f"post does not exist.",
                }
            )
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return Response(
                {
                    "success": False,
                    "error": "internal_server_error",
                    "detail": "An unexpected error occurred while toggling like.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class CreatePostAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        try:
            user = request.user
            serializer = PostSerializer(
                data=request.data,
            )

            if serializer.is_valid():
                serializer.save(user=user)
                return Response(
                    {
                        "success": True,
                        "data": serializer.data,
                    },
                    status=status.HTTP_201_CREATED,
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
            logger.error(f"Unexpected error in CreatePostAPIView: {str(e)}")
            return Response(
                {
                    "success": False,
                    "error": "internal_server_error",
                    "detail": "An unexpected error occurred while creating the post.",
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


class FeedPagination(PageNumberPagination):
    page_size = 35
    page_size_query_param = "page_size"
    max_page_size = 80


class FeedView(APIView):
    def get(self, request):
        posts = Post.objects.prefetch_related("likes").all()

        paginator = FeedPagination()
        page_number = request.query_params.get("page", 1)
        total_posts = posts.count()
        total_pages = (total_posts + paginator.page_size - 1) // paginator.page_size
        if int(page_number) > total_pages:
            Response(
                {
                    "success": False,
                    "error": "page_not_found",
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        paginated_posts = paginator.paginate_queryset(posts, request)

        serializer = PostSerializer(paginated_posts, many=True)
        serialized_data = serializer.data

        user = request.user if request.user.is_authenticated else None

        for post, serialized_post in zip(paginated_posts, serialized_data):
            serialized_post["is_liked"] = user in post.likes.all() if user else False

        return paginator.get_paginated_response(serialized_data)


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
            print(serializer.errors)
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


class SinglePostView(APIView):
    def get(self, request, post_id):
        try:
            post = Post.objects.get(post_id=post_id)
        except Post.DoesNotExist:
            raise NotFound(
                {
                    "success": False,
                    "error": "post_not_found",
                    "detail": f"Post with ID {post_id} does not exist.",
                }
            )
        
        serializer = PostSerializer(post, many=False)
        return Response(
            {
                "success": True,
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )



        



class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)

            tokens = response.data

            access_token = tokens.get("access")
            refresh_token = tokens.get("refresh")
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

            request.data["refresh"] = refresh_token

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

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        res = Response(
            {
                "success": True,
                "message": "Logout Successful",
            },
            status=status.HTTP_200_OK,
        )
        res.delete_cookie("access_token", path="/",  samesite="None")    
        res.delete_cookie("refresh_token", path="/",  samesite="None")
        return res
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return Response(
            {
                "success": False,
                "error": "internal_server_error",
                "detail": "An unexpected error occurred while trying to logout.",
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )