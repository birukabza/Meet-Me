import PropTypes from "prop-types";

import { SERVER_URL } from "../../constants/constants";

import { FaHeart } from "react-icons/fa6";

const Post = ({ post }) => {
  return (
    <div
      key={post.post_id}
      className="aspect-square overflow-hidden group relative"
    >
      <div className="w-full h-full transition-opacity duration-300 group-hover:opacity-50">
        {post.image ? (
          <>
            <img
              src={`${SERVER_URL}${post.image}`}
              alt="image of the user posts"
              className="w-full h-full object-cover"
            />
            <div className="hidden w-full h-full bg-gray-800 p-4">
              <p className="text-white text-lg">{post.content}</p>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center p-4">
            <p className="text-white text-lg">{post.content}</p>
          </div>
        )}
      </div>

      <div className="flex justify-center items-center gap-2 scale-0 group-hover:scale-100 absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] z-10">
        <div className="justify-self-center">

        <FaHeart size={30}/>
        </div>
        <span className="text-3xl text-white"> {post.likes_count}</span>
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
  }).isRequired,
};

export default Post;