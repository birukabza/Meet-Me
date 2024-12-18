import { Masonry } from "masonic";

const Feed = () => {
  const pins = [
    { id: 1, image: "https://via.placeholder.com/300x400" },
    { id: 2, image: "https://via.placeholder.com/350x500" },
    { id: 3, image: "https://via.placeholder.com/400x300" },
    { id: 4, image: "https://via.placeholder.com/320x450" },
    { id: 5, image: "https://via.placeholder.com/300x350" },
    { id: 6, image: "https://via.placeholder.com/400x500" },
    { id: 7, image: "https://via.placeholder.com/350x400" },
    { id: 8, image: "https://via.placeholder.com/300x450" },
    { id: 1, image: "https://via.placeholder.com/300x400" },
    { id: 2, image: "https://via.placeholder.com/350x500" },
    { id: 3, image: "https://via.placeholder.com/400x300" },
    { id: 4, image: "https://via.placeholder.com/320x450" },
    { id: 5, image: "https://via.placeholder.com/300x350" },
    { id: 6, image: "https://via.placeholder.com/400x500" },
    { id: 7, image: "https://via.placeholder.com/350x400" },
    { id: 8, image: "https://via.placeholder.com/300x450" },
    { id: 1, image: "https://via.placeholder.com/300x400" },
    { id: 2, image: "https://via.placeholder.com/350x500" },
    { id: 3, image: "https://via.placeholder.com/400x300" },
    { id: 4, image: "https://via.placeholder.com/320x450" },
    { id: 5, image: "https://via.placeholder.com/300x350" },
    { id: 6, image: "https://via.placeholder.com/400x500" },
    { id: 7, image: "https://via.placeholder.com/350x400" },
    { id: 8, image: "https://via.placeholder.com/300x450" },
    { id: 1, image: "https://via.placeholder.com/300x400" },
    { id: 2, image: "https://via.placeholder.com/350x500" },
    { id: 3, image: "https://via.placeholder.com/400x300" },
    { id: 4, image: "https://via.placeholder.com/320x450" },
    { id: 5, image: "https://via.placeholder.com/300x350" },
    { id: 6, image: "https://via.placeholder.com/400x500" },
    { id: 7, image: "https://via.placeholder.com/350x400" },
    { id: 8, image: "https://via.placeholder.com/300x450" },
  ];

  const MasonryCard = ({ data: { image, id }, width }) => (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={image}
        alt={`Pin ${id}`}
        className="w-full h-auto rounded-lg"
      />
    </div>
  );

  return (
    <div className="p-6">
      <Masonry
        items={pins}
        render={MasonryCard}
        columnGutter={16} 
        columnWidth={300} 
        overscanBy={2}
      />
    </div>
  );
};

export default Feed;