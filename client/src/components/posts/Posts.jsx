import PropTypes from "prop-types";

import Post from "../post/Post";
import PlusSign from "../custom-buttons/PlusSign";
import CreatePostModal from "../modals/CreatePostModal";

import { getUserPosts } from "../../api/userApi";

import { useEffect, useState, useContext } from "react";

import AuthContext from "../../contexts/AuthContext";

const Posts = ({ username }) => {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState(null);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  const { currentUsername } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoadingPosts(true);
      setError(null);
      try {
        const fetchedPosts = await getUserPosts(username);
        setPosts(fetchedPosts || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, [username]);

  const handleNewPost = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts])
  }

  if (loadingPosts) {
    return (
      <div className="mt-6 w-full flex justify-center">
        <p className="text-white text-center">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 w-full flex justify-center">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-6 w-full flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-full w-full px-4">
        {username === currentUsername && posts.length >0 && (
          <div
            className="flex flex-col justify-center items-center"
            onClick={() => setShowCreatePostModal(true)}
          >
            <PlusSign />
            Add your work
          </div>
        )}
        {posts.length > 0 ? (
          posts.map((post) => <Post key={post.post_id} post={post} />)
        ) : (
          <div className="flex flex-col gap-5 justify-center items-center col-span-full h-full">
            {

              currentUsername === username ? (
                <>
                  <p className="text-white">Share Your first art</p>
                  <div className="" onClick={() => setShowCreatePostModal(true)}>
                    <PlusSign />
                  </div>
                </>
              ) : (
                <p className="">No Posts Available</p>
              )

            }
          </div>
        )}
      </div>
      {showCreatePostModal && (
        <CreatePostModal onClose={() => setShowCreatePostModal(false)} onCreateNewPost={handleNewPost}/>
      )}
    </div>
  );
};

Posts.propTypes = {
  username: PropTypes.string.isRequired,
};

export default Posts;
