import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const SidebarContent = ({
  width = "w-96",
  onClose,
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
  const [lyrics, setLyrics] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [info, setInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (showLyrics && selectedVideo?.video_id) {
        await handleShowLyrics();
      }

      if (showRecommendations && selectedVideo?.video_id) {
        await handleRecommendations();
      }

      if (showInfo && selectedVideo?.video_id) {
        await handleShowInfo();
      }
    };

    fetchData();
  }, [showLyrics, showRecommendations, showInfo, selectedVideo?.video_id]);

  const handleShowLyrics = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/music/video/${selectedVideo?.video_id}/lyrics`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setLyrics(data.lyrics.lyrics);
      } else {
        console.error("Failed to fetch lyrics");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleRecommendations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/recommendations/${selectedVideo?.video_id}?limit=10`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      
      if (data.success) {
        const transformedRecommendations = data.data.map(video => ({
          videoId: video.videoId,
          title: video.title,
          thumbnail: video.thumbnail,
          url: video.url,
          viewCount: video.statistics?.viewCount?.toLocaleString() || 'N/A'
        }));
  
        setRecommendations(transformedRecommendations);  
      } else {
        console.error("Failed to fetch recommendations");
        setRecommendations([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleShowInfo = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/music/video/${selectedVideo?.video_id}/info`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      
      if (data.success) {
        const video = data.music_info;

        const genres = [...new Set(video.track.tags)];
        const uniqueGenres = genres.length > 1
        ? genres.map(tag => tag.charAt(0).toUpperCase() + tag.slice(1)).join(', ')
        : genres.length === 1
        ? genres[0].charAt(0).toUpperCase() + genres[0].slice(1)
        : '';

        setInfo({
          Title: video.track.name,
            Artist: video.track.artist,
            Bio: video.artist.bio,
            SimilarArtists: video.artist.similar_artists?.map((artist) => ({ name: artist.name, url: artist.url })),
            Album: video.track.album,
            Genre: uniqueGenres,
        });
      } else {
        console.error("Failed to fetch info");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handlePlayNext = async (video) => {
    try {
      // Increment view count for the next video
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/videos/${video.video_id}/increment-view`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        }
      });

      const data = await response.json();

      if (data.success) {
        // Navigate to the next video
        navigate(`/watch?v=${video.video_id}`, { 
          state: { selectedVideo: video } 
        });
      } else {
        console.error("Failed to increment view count");
      }
    } catch (error) {
      console.error("Error playing next video:", error);
    }
  }

  return (
    <div className={`w-96 bg-[#0f0f0f] border-l border-[#272727] p-4 overflow-y-auto scrollbar-thin scrollbar-track-[#0f0f0f] scrollbar-thumb-[#272727] hover:scrollbar-thumb-[#3a3a3a] transition-all duration-300 ${width}`}>
      {showLyrics ? (
        <div>
          <h2 className="text-xl font-bold mb-4 text-white">Lyrics</h2>
          <pre className="whitespace-pre-line text-[#f1f1f1]">
            {isLoading ? "Loading..." : (lyrics || "No lyrics available")}
          </pre>
        </div>
      ) : showInfo ? (
        // Info View
        <div>
          <h2 className="text-xl font-bold mb-4 text-white">Music Info</h2>
          {isLoading ? (
            <p className="text-[#f1f1f1]">Loading info...</p>  
          ) : info ? (
            <div className="space-y-2 text-[#f1f1f1]">
              <p><strong>Title: </strong>{info?.Title}</p>
              <p><strong>Artist:</strong> {info?.Artist}</p>
              <p><strong>Bio:</strong> {info?.Bio}</p>
              <p><strong>Similar Artists:</strong><br/> {info?.SimilarArtists?.length > 0 && (
                info?.SimilarArtists?.map((artist) => 
                <a href={artist.url} className="text-[#3ea6ff]" target="_blank">{artist.name}<br/></a>)
              )}</p>
              <p><strong>Album:</strong> {info?.Album}</p>
              <p><strong>Genre:</strong> {info?.Genre}</p>
            </div>
          ) : (
            <p className="text-[#f1f1f1]">No info available</p>
          )}
        </div>
      ) : showRecommendations ? (
        <div>
          <h2 className="text-xl font-bold mb-4 text-white">YouTube Recommendations</h2>
          {isLoading ? (
            <p className="text-[#f1f1f1]">Loading recommendations...</p>
          ) : recommendations.length > 0 ? (
            recommendations.map((video) => (
              <div 
                key={video.videoId}
                onClick={() => window.open(video.url, "_blank")}
                className="flex items-start p-2 hover:bg-[#272727] rounded"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-24 h-16 object-cover rounded"
                />
                <div className="ml-3 flex-1">
                  <h3 className="font-medium line-clamp-2 text-[#f1f1f1]">{video.title}</h3>
                  <p className="text-sm text-[#aaa]">{video.viewCount || 'N/A'} views</p>
                </div>
                <button 
                  onClick={() => window.open(video.url, "_blank")}
                  className="p-2 ml-2 hover:bg-[#383838] rounded-full text-[#f1f1f1]"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            ))
          ) : <p className="text-[#f1f1f1]">No recommendations available</p>}
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
                key={video.video_id}
                className="flex items-start p-2 hover:bg-[#272727] rounded"
                onClick={() => {handlePlayNext(video);}}
              >
                <img
                  src={video.thumbnail}
                  alt={video.video_name}
                  className="w-24 h-16 object-cover rounded"
                />
                <div className="ml-3 flex-1">
                  <h3 className="font-medium line-clamp-2 text-[#f1f1f1]">{video.video_name}</h3>
                  <p className="text-sm text-[#aaa]">{video.views} views</p>
                </div>
                <button 
                  className="p-2 ml-2 hover:bg-[#383838] rounded-full text-[#f1f1f1]"
                  title="Play Next"
                  onClick={() => {
                    handlePlayNext(video);
                  }}
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
