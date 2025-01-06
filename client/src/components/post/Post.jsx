import  { useState } from "react";
import PropTypes from "prop-types";
import { FaHeart } from "react-icons/fa6";
import { toggleLike } from "../../api/userApi";
import { CLOUDINARY_BASE_URL } from "../../constants/constants";
import { Link } from "react-router-dom";

const Post = ({ post, masonry = false }) => {
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count);

  const handleLikeClick = async (e) => {
    e.preventDefault();
    try {
      const response = await toggleLike(post.post_id);
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
    if (image.includes('https://')) {
      return `https:${image.split(":")[1]}`;
    }
    return `${CLOUDINARY_BASE_URL}${image}`;
  };

  const imageUrl = handleImage(post.image);

  return (
    <Link to={`/post/${post.post_id}`}>
      <div
        key={post.post_id}
        className={masonry ? "overflow-hidden group relative" : "aspect-square overflow-hidden group relative"}
      >
        <div className="w-full h-full transition-opacity duration-300 group-hover:opacity-50">
          <img
            src={imageUrl}
            alt="image of the user posts"
            className={`w-full h-full object-cover ${masonry ? "rounded-lg" : ""}`}
            style={{ height: post.height || "100%" }}
          />
          <div className="hidden w-full h-full bg-gray-800 p-4">
            <p className="text-white text-lg">{post.content}</p>
          </div>
        </div>
        <div className="flex justify-center items-center gap-2 scale-0 group-hover:scale-100 absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] z-10">
          <div className="justify-self-center" onClick={handleLikeClick}>
            <FaHeart
              size={30}
              color={isLiked ? "red" : "white"}
              className={`cursor-pointer ${isLiked ? "scale-110" : "scale-100"
                } transition-transform duration-200`}
            />
          </div>
          <span className="text-3xl text-white">{likesCount}</span>
        </div>
      </div>
    </Link>
  );
};

Post.propTypes = {
  post: PropTypes.shape({
    post_id: PropTypes.number.isRequired,
    content: PropTypes.string,
    image: PropTypes.string,
    likes_count: PropTypes.number.isRequired,
    is_liked: PropTypes.bool,
    height: PropTypes.number,
    created_at: PropTypes.string,
  }).isRequired,
  masonry: PropTypes.bool,
};

export default Post;