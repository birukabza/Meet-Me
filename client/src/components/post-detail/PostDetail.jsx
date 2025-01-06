import { useState, useEffect, useRef } from "react";
import { FaHeart } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { toggleLike, getPostById } from "../../api/userApi";
import { CLOUDINARY_BASE_URL } from "../../constants/constants";

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const postDetailRef = useRef(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPostById(postId);
        if (response.success) {
          setPost(response.data);
          setIsLiked(response.data.is_liked);
          setLikesCount(response.data.likes_count);
        } else {
          console.error("Failed to fetch post:", response.error);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [postId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (postDetailRef.current && !postDetailRef.current.contains(event.target)) {
        navigate("/");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navigate]);

  const handleLikeClick = async () => {
    try {
      const response = await toggleLike(postId);
      if (response.success) {
        setIsLiked((prevIsLiked) => !prevIsLiked);
        setLikesCount((prevLikesCount) =>
          isLiked ? prevLikesCount - 1 : prevLikesCount + 1
        );
      } else {
        console.error("Failed to toggle like:", response.error);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleImage = (image) => {
    if (image.includes("https://")) {
      return `https:${image.split(":")[1]}`;
    }
    return `${CLOUDINARY_BASE_URL}${image}`;
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  const imageUrl = handleImage(post.image);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
      <div ref={postDetailRef} className="bg-primaryLight rounded-lg max-w-6xl w-full max-h-[90vh] flex overflow-hidden relative">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 hover:text-red-600 z-10 hover:opacity-75 transition-opacity"
        >
          <FaTimes size={24} />
        </button>

        <div className="w-2/3 bg-black flex items-center justify-center">
          <img
            src={imageUrl}
            alt="Post detail"
            className="h-[90vh] w-full object-cover"
            style={{ aspectRatio: "1 / 2" }} 
          />
        </div>

        <div className="w-1/3 flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="font-semibold text-lg">Post Details</div>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {post.content && (
              <p className="text-gray-200 mb-4">{post.content}</p>
            )}

          </div>

          <div className="p-4 mt-28 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleLikeClick}
                className="flex items-center space-x-2"
              >
                <FaHeart
                  size={24}
                  color={isLiked ? "red" : "white"}
                  className={`cursor-pointer ${
                    isLiked ? "scale-110" : "scale-100"
                  } transition-transform duration-200`}
                />
                <span className="text-lg">{likesCount}</span>
              </button>
            </div>
            <div className="text-sm text-gray-400">
              Posted on: {new Date(post.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;