import PropTypes from "prop-types";
import { SERVER_URL } from "../../constants/constants";

const Post = ({ post }) => {
  return (
    <div
      key={post.post_id}
      className="aspect-square relative overflow-hidden"
    >
      {post.image ? (
        <>
        <img
          src={`${SERVER_URL}${post.image}`}
          alt="image of the user posts"
          className="w-full h-full object-cover"
        />
        <div className="hidden w-full h-full bg-gray-800  p-4">
          <p className="text-white text-lg">{post.content}</p>
        </div>
        </>
        
      ) : (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center p-4">
          <p className="text-white text-lg">{post.content}</p>
        </div>
      )}
    </div>
  );
};

Post.propTypes = {
  post: PropTypes.shape({
    post_id: PropTypes.number.isRequired,
    content: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
};

export default Post;