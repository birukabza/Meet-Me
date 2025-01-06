from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser
from core.models import UserProfile, Post
from core.serializers import PostSerializer
import logging

logger = logging.getLogger(__name__)


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
            raise NotFound(
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
    
class DeletePostAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, post_id):
        try:
            post = Post.objects.get(post_id=post_id)

            if post.user != request.user:
                return Response(
                    {
                        "success": False,
                        "error": "forbidden",
                        "detail": "You do not have permission to delete this post.",
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

            post.delete()

            return Response(
                {
                    "success": True,
                    "detail": f"Post with ID {post_id} has been successfully deleted.",
                },
                status=status.HTTP_204_NO_CONTENT,
            )

        except Post.DoesNotExist:
            raise NotFound(
                {
                    "success": False,
                    "error": "post_not_found",
                    "detail": f"Post with ID {post_id} does not exist.",
                }
            )
        except Exception as e:
            logger.error(f"Unexpected error in DeletePostAPIView: {str(e)}")
            return Response(
                {
                    "success": False,
                    "error": "internal_server_error",
                    "detail": "An unexpected error occurred while deleting the post.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
class UpdatePostAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, post_id):
        try:
            post = Post.objects.get(post_id=post_id)

            if post.user != request.user:
                return Response(
                    {
                        "success": False,
                        "error": "forbidden",
                        "detail": "You do not have permission to update this post.",
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

            content = request.data.get('content')
            if content:
                post.content = content
                post.save()

                serializer = PostSerializer(post)

                return Response(
                    {
                        "success": True,
                        "data": serializer.data,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "success": False,
                        "error": "content_required",
                        "detail": "Content is required to update the post.",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except Post.DoesNotExist:
            raise NotFound(
                {
                    "success": False,
                    "error": "post_not_found",
                    "detail": f"Post with ID {post_id} does not exist.",
                }
            )
        except Exception as e:
            logger.error(f"Unexpected error in UpdatePostAPIView: {str(e)}")
            return Response(
                {
                    "success": False,
                    "error": "internal_server_error",
                    "detail": "An unexpected error occurred while updating the post.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
