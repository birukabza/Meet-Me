import { useEffect, useState } from 'react';
import { Masonry } from 'masonic';
import { fetchFeed } from '../../api/userApi';
import { SERVER_URL } from '../../constants/constants';

const Feed = () => {
  const [items, setItems] = useState([]);

  const loadMoreData = async () => {
    try {
      const data = await fetchFeed();
      console.log(data)
      const itemsWithRandomHeight = data.map(item => ({
        ...item,
        height: Math.floor(Math.random() * (450 - 200) + 200)
      }));
      setItems(itemsWithRandomHeight);
    } catch (error) {
      console.error('Error fetching feed:', error);
    }
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  const renderItem = ({ data: { post_id, image, height } }) => (
    <div className="masonry-item" key={post_id}>
      <img 
        src={`${SERVER_URL}${image}`} 
        alt="Placeholder" 
        className="w-full object-cover rounded-lg shadow-sm hover:opacity-95 transition-opacity"
        style={{ 
          height: `${height}px`,
        }}
      />
    </div>
  );

  return (
    <div className="feed-container py-6 px-4">
      <div className="masonry-container max-w-7xl mx-auto">
        <Masonry
          items={items}
          columnWidth={300}
          columnGutter={20}
          columnCount={window.innerWidth > 1536 ? 5 : 
                       window.innerWidth > 1280 ? 4 : 
                       window.innerWidth > 768 ? 3 : 
                       window.innerWidth > 640 ? 2 : 1}
          overscanBy={5}
          render={renderItem}
        />
      </div>
      
    </div>
  );
};

export default Feed;