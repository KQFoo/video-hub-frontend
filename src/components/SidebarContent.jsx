import React from 'react';
import { Search, ChevronRight } from "lucide-react";

const SidebarContent = ({
  showLyrics,
  showInfo,
  showRecommendations,
  searchQuery,
  setSearchQuery,
  filterBy,
  setFilterBy,
  filteredVideos,
  selectedVideo,
}) => {
  console.log('SidebarContent Props:', {
    showLyrics,
    showInfo,
    showRecommendations,
    searchQuery,
    filterBy,
    filteredVideos,
    selectedVideo
  });

  return (
    <div className="w-96 bg-[#0f0f0f] border-l border-[#272727] p-4 overflow-y-auto">
      {showLyrics ? (
        // Lyrics View
        <div>
          <h2 className="text-xl font-bold mb-4 text-white">Lyrics</h2>
          <p className="whitespace-pre-line text-[#f1f1f1]">
            {selectedVideo?.lyrics || "No lyrics available"}
          </p>
        </div>
      ) : showInfo ? (
        // Info View
        <div>
          <h2 className="text-xl font-bold mb-4 text-white">Music Info</h2>
          <div className="space-y-2 text-[#f1f1f1]">
            <p><strong>Artist:</strong> {selectedVideo?.info?.artist}</p>
            <p><strong>Album:</strong> {selectedVideo?.info?.album}</p>
            <p><strong>Year:</strong> {selectedVideo?.info?.year}</p>
            <p><strong>Genre:</strong> {selectedVideo?.info?.genre}</p>
          </div>
        </div>
      ) : showRecommendations ? (
        <div>
          <h2 className="text-xl font-bold mb-4 text-white">YouTube Recommendations</h2>
          {filteredVideos.map((video) => (
              <div 
                key={video.id}
                className="flex items-start p-2 hover:bg-[#272727] rounded"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-24 h-16 object-cover rounded"
                />
                <div className="ml-3 flex-1">
                  <h3 className="font-medium line-clamp-2 text-[#f1f1f1]">{video.title}</h3>
                  <p className="text-sm text-[#aaa]">{video.views}</p>
                </div>
                <button 
                  className="p-2 ml-2 hover:bg-[#383838] rounded-full text-[#f1f1f1]"
                  title="Go to Video"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
          ))}
        </div>
      ) : (
        // Playlist View
        <div>
          {/* Search and Filter */}
          <div className="mb-4 space-y-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#121212] border border-[#272727] rounded text-[#f1f1f1] placeholder-[#aaa] focus:outline-none focus:border-[#3ea6ff]"
              />
              <Search className="absolute left-3 top-2.5 text-[#aaa]" size={20} />
            </div>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="w-full p-2 bg-[#121212] border border-[#272727] rounded text-[#f1f1f1] focus:outline-none focus:border-[#3ea6ff]"
            >
              <option value="mostRecent">Most Recent</option>
              <option value="mostViewed">Most Viewed</option>
              <option value="leastViewed">Least Viewed</option>
              <option value="leastRecent">Least Recent</option>
            </select>
          </div>

          {/* Video List */}
          <div className="space-y-2">
            {filteredVideos.map((video) => (
              <div 
                key={video.id}
                className="flex items-start p-2 hover:bg-[#272727] rounded"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-24 h-16 object-cover rounded"
                />
                <div className="ml-3 flex-1">
                  <h3 className="font-medium line-clamp-2 text-[#f1f1f1]">{video.title}</h3>
                  <p className="text-sm text-[#aaa]">{video.views}</p>
                </div>
                <button 
                  className="p-2 ml-2 hover:bg-[#383838] rounded-full text-[#f1f1f1]"
                  title="Play Next"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarContent;
