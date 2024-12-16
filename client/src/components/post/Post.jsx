import PropTypes from "prop-types";

import { SERVER_URL } from "../../constants/constants";

import { FaHeart } from "react-icons/fa6";

import { toggleLike } from "../../api/userApi";

import { useState } from "react";

const Post = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count);

  const handleLikeClick = async () => {
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

  return (
    <div
      key={post.post_id}
      className="aspect-square overflow-hidden group relative"
    >
      <div className="w-full h-full transition-opacity duration-300 group-hover:opacity-50">
        <img
          src={`${SERVER_URL}${post.image}`}
          alt="image of the user posts"
          className="w-full h-full object-cover"
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
  );
};

Post.propTypes = {
  post: PropTypes.shape({
    post_id: PropTypes.number.isRequired,
    content: PropTypes.string,
    image: PropTypes.string,
    likes_count: PropTypes.number.isRequired,
    is_liked: PropTypes.bool,
  }).isRequired,
};

export default Post;
