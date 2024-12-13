import PropTypes from "prop-types";
import Post from "../post/Post";

const Posts = ({ username }) => {
  const dummyPosts = [
    {
      id: 1,
      title: "Exploring React Best Practices",
      content: "Learn how to write clean and maintainable React code.",
      image: "https://i.ibb.co/RNw5pbk/sneakers.jpg",
    },
    {
      id: 2,
      title: "Understanding State Management",
      content: "A deep dive into Redux and React Context.",
    },
    {
      id: 3,
      title: "Styling in React",
      content: "CSS-in-JS vs traditional CSS. What works best?",
      image: "https://i.ibb.co/StjrxXv/jacket.jpg",
    },
    {
      id: 4,
      title: "Performance Optimization",
      content: "Tips to make your React app faster.",
    },
    {
      id: 5,
      title: "React Hooks",
      content: "How to effectively use useState and useEffect.",
      image: "https://i.ibb.co/StjrxXv/jacket.jpg",
    },
    {
      id: 6,
      title: "Component Composition",
      content: "Understanding props and children in React.",
    },
    {
      id: 7,
      title: "Performance Optimization",
      content: "Tips to make your React app faster.",
    },
    {
      id: 8,
      title: "React Hooks",
      content: "How to effectively use useState and useEffect.",
      image: "https://i.ibb.co/StjrxXv/jacket.jpg",
    },
    {
      id: 9,
      title: "Component Composition",
      content: "Understanding props and children in React.",
    },
    {
      id: 10,
      title: "Performance Optimization",
      content: "Tips to make your React app faster.",
    },
  ];

  return (
    <div className="mt-6 w-full flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl w-full px-4">
        {dummyPosts.length > 0 ? (
          dummyPosts.map((post) => <Post key={post.id} post={post} />) 
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No posts available for {username}.
          </p>
        )}
      </div>
    </div>
  );
};

Posts.propTypes = {
  username: PropTypes.string.isRequired,
};

export default Posts;
