import PropTypes from "prop-types";

const Post = ({ post }) => {
  return (
    <div
      key={post.id}
      className="p-4 bg-gray-800  transition-shadow flex flex-col justify-between h-full"
    >
      {post.image ? (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover mb-4"
        />
      ) : (
        null
      )}
      <div className="flex flex-col justify-center flex-grow">
        <h3 className="text-white text-lg font-semibold mb-2">{post.title}</h3>
        <p className="text-gray-400 text-sm">{post.content}</p>
      </div>
    </div>
  );
};

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    image: PropTypes.string,
  }).isRequired,
};

export default Post;
