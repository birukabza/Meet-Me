from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.response import Response
from core.models import Comment, Post
from core.serializers import CommentSerializer
import logging

logger = logging.getLogger(__name__)


class CreateCommentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        try:
            user = request.user
            post = Post.objects.get(post_id=post_id)
            data = request.data
        except Post.DoesNotExist:
            raise NotFound(
                {
                    "success": False,
                    "error": "post_not_found",
                    "detail": f"post with post_id {post_id} does not exist.",
                }
            )

        try:
            serializer = CommentSerializer(data=data)

            if serializer.is_valid():
                serializer.save(user=user, post=post)
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
            logger.error(f"Unexpected error in CreateCommentAPIView: {str(e)}")
            return Response(
                {
                    "success": False,
                    "error": "internal_server_error",
                    "detail": "An unexpected error occurred while creating the post.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class GetPostCommentsAPIView(APIView):

    def get(self, request, post_id):
        try:
            post = Post.objects.get(post_id=post_id)
        except Post.DoesNotExist:
            raise NotFound(
                {
                    "success": False,
                    "error": "post_not_found",
                    "detail": f"post with post_id {post_id} does not exist.",
                }
            )
        
        try:
            comments = post.comments.all()
            serializer = CommentSerializer(comments, many=True)
            return Response(
                {
                    "success": True,
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            logger.error(f"An error occurred while serializing the comments data: {str(e)}")
            return Response(
                {
                    "success": False,
                    "error": "serialization_error",
                    "detail": f"An error occurred while serializing the comments data: {str(e)}",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    
class GetCommentAPIView(APIView):
    def get (self, request, comment_id):
        try:
            comment = Comment.objects.get(comment_id=comment_id)
        except Comment.DoesNotExist:
            raise NotFound(
                {
                    "success": False,
                    "error": "comment_not_found",
                    "detail": f"comment with comment_id {comment_id} does not exist.",
                }
            )
        
        try:
            serializer = CommentSerializer(comment, many=False)
            return Response(
                {
                    "success": True, 
                    "data":serializer.data
                }
            )
        except Exception as e:
            logger.error(f"An error occurred while serializing the comment's data: {str(e)}")
            return Response(
                {
                    "success": False,
                    "error": "serialization_error",
                    "detail": f"An error occurred while serializing the comment data: {str(e)}",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class UpdateCommentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, comment_id):
        try:
            comment = Comment.objects.get(comment_id=comment_id)

            if comment.user != request.user:
                return Response(
                    {
                        "success": False,
                        "error": "forbidden",
                        "detail": "You do not have permission to update this comment.",
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

            content = request.data.get('content')
            if content:
                comment.content = content
                comment.save()

                serializer = CommentSerializer(comment)

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
                        "detail": "Content is required to update the comment.",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except Comment.DoesNotExist:
            raise NotFound(
                {
                    "success": False,
                    "error": "comment_not_found",
                    "detail": f"Comment with ID {comment_id} does not exist.",
                }
            )
        except Exception as e:
            logger.error(f"Unexpected error in UpdateCommentAPIView: {str(e)}")
            return Response(
                {
                    "success": False,
                    "error": "internal_server_error",
                    "detail": "An unexpected error occurred while updating the comment.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class DeleteCommentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, comment_id):
        try:
            comment = Comment.objects.get(comment_id=comment_id)

            if comment.user != request.user:
                return Response(
                    {
                        "success": False,
                        "error": "forbidden",
                        "detail": "You do not have permission to delete this comment.",
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

            comment.delete()

            return Response(
                {
                    "success": True,
                    "message": "Comment deleted successfully.",
                },
                status=status.HTTP_204_NO_CONTENT, 
            )

        except Comment.DoesNotExist:
            raise NotFound(
                {
                    "success": False,
                    "error": "comment_not_found",
                    "detail": f"Comment with ID {comment_id} does not exist.",
                }
            )
        except Exception as e:
            logger.error(f"Unexpected error in DeleteCommentAPIView: {str(e)}")
            return Response(
                {
                    "success": False,
                    "error": "internal_server_error",
                    "detail": "An unexpected error occurred while deleting the comment.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )



