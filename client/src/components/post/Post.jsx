import PropTypes from "prop-types";

const Post = ({ post }) => {
  return (
    <div
      key={post.id}
      className="p-4 bg-gray-800  transition-shadow flex flex-col justify-between size-72"
    >
      {post.image ? (
        <>
        <img
          src={post.image}
          alt={post.title}
          className="w-full  object-cover mb-4 h-80"
        />
      <div className="hidden flex-col justify-center flex-grow">
        <h3 className="text-white text-lg font-semibold mb-2">{post.title}</h3>
        <p className="text-gray-400 text-sm">{post.content}</p>
      </div>
        
        </>
      ) : (
        <div className="flex flex-col justify-center flex-grow">
        <h3 className="text-white text-lg font-semibold mb-2">{post.title}</h3>
        <p className="text-gray-400 text-sm">{post.content}</p>
      </div>
      )}
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
