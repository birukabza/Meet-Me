import { useEffect, useState } from 'react';
import { Masonry } from 'masonic';
import { fetchFeed } from '../../api/userApi';
import Post from '../post/Post';
import Loading from '../Loading/Loading'; // Import your loading component

const Feed = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isFirstPageLoaded, setIsFirstPageLoaded] = useState(false); 

  const loadMoreData = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const data = await fetchFeed(page);
      if (Array.isArray(data) && data.length > 0) {
        const itemsWithRandomHeight = data.map(item => ({
          ...item,
          height: Math.floor(Math.random() * (450 - 200) + 200),
        }));
        setItems(prevItems => [...prevItems, ...itemsWithRandomHeight]);
        setPage(prevPage => prevPage + 1);
        if (!isFirstPageLoaded) {
          setIsFirstPageLoaded(true); 
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMoreData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = ({ data }) => {
    if (!data || !data.post_id) {
      console.warn('Invalid post data:', data);
      return null;
    }

    return (
      <div className="masonry-item" key={data.post_id}>
        <Post post={data} masonry />
      </div>
    );
  };

  return (
    <div className="feed-container py-6 px-4">
      <div className="masonry-container max-w-7xl mx-auto">
        {!isFirstPageLoaded ? (
          <div className="flex justify-center items-center h-full">
            <Loading /> 
          </div>
        ) : (
          items.length > 0 ? (
            <Masonry
              items={items}
              columnWidth={300}
              columnGutter={20}
              overscanBy={150}
              render={renderItem}
            />
          ) : (
            <p className="text-white text-center">No posts to display</p>
          )
        )}
      </div>
      <div className="text-center py-6">
        {hasMore ? (
          <button
            className="load-more-button bg-black text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition"
            onClick={loadMoreData}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        ) : (
          <p className="text-white">No more posts to load</p>
        )}
      </div>
    </div>
  );
};

export default Feed;
