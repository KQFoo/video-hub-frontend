import React, { useState, useRef, useEffect } from "react";
import { 
    ArrowLeft,
    Play, 
    Pause, 
    Volume2, 
    VolumeX, 
    Repeat, 
    RotateCcw,
    SkipForward, 
    Maximize, 
    Minimize,
    Edit2,
    // Search,
    // ChevronRight,
    Info,
    FileText,
    FileVideo,
    ChevronLeft,
    X
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import SidebarContent from './SidebarContent';

export default function PlayVideo({ handleGlobalMiniPlayer }) {
    const navigate = useNavigate();
    const location = useLocation();
    const videoRef = useRef(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isShown, setIsShown] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showLyrics, setShowLyrics] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [showRecommendations, setShowRecommendations] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [videoTitle, setVideoTitle] = useState("");
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterBy, setFilterBy] = useState("all");
    const [sidebarWidth, setSidebarWidth] = useState("w-96");
    const [showSidebar, setShowSidebar] = useState(true);
    const [videos, setVideos] = useState([]);

    const handleVideoEnd = () => {
        // Ensure selectedVideo and videos exist before processing
        if (!selectedVideo || !videos || videos.length === 0) return;

        // Find the current video's index in the playlist
        const currentIndex = videos.findIndex(
            video => video.video_id === selectedVideo.video_id
        );

        // Calculate the next video index
        if (currentIndex !== -1 && currentIndex < videos.length - 1) {
            const nextVideo = videos[currentIndex + 1];
            
            // Navigate to the next video
            navigate(`/watch?id=${nextVideo.video_id}`, { 
                state: { selectedVideo: nextVideo } 
            });

            setIsPlaying(true);
        }
    };

    useEffect(() => {
        // Reset mini-player when navigating to watch route
        handleGlobalMiniPlayer({
            video: null,
            isMinimizing: false
        });

        const fetchVideos = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/playlists/${selectedVideo?.playlist_id}/find-all-videos`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }});
                
                const data = await response.json();

                if(data.success) { 
                    setVideos(data.data);
                } else {
                    console.log("No videos found"); 
                    setVideos([]);
                }
            } catch (error) {
                console.error("Fetch error:", error);
                setVideos([]);
            }
        };

        // Check if video is passed through navigation state
        if (location.state && location.state.selectedVideo) {
            setSelectedVideo(location.state.selectedVideo);
            setVideoTitle(location.state.selectedVideo.video_name);
        } else {
            // Fallback to default video if no video is selected
            setSelectedVideo({
                video_id: 1,
                link: "https://www.w3schools.com/html/mov_bbb.mp4",
                thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
                video_name: "Default Video",
                views: "0 views",
                // duration: "0:00"
            });
            setVideoTitle("Default Video");
        }

        fetchVideos();
        setIsLoading(false);
    }, [selectedVideo, location.state]);

    useEffect(() => {
        const videoElement = videoRef.current;
        
        if (videoElement) {
            videoElement.addEventListener('ended', handleVideoEnd);
            
            return () => {
                videoElement.removeEventListener('ended', handleVideoEnd);
            };
        }
    }, [videoRef, videos, selectedVideo]);

    // Video Control Functions
    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
            setDuration(videoRef.current.duration);
        }
    };

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        setCurrentTime(time);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
        }
    };

    const toggleLoop = () => {
        if (videoRef.current) {
            videoRef.current.loop = !isLooping;
            setIsLooping(!isLooping);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            videoRef.current.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const handleTitleEdit = async () => {
        if (isEditing) {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/videos/rename/${selectedVideo?.video_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ video_name: videoTitle }),
            });

            const data = await response.json();

            if (data.success) {
                console.log("Title updated successfully");
            } else {
                console.error("Failed to update title");
            }
        }
        setIsEditing(!isEditing);
    };

    const filteredVideos = videos.filter(video => {
        const matchesSearch = video.video_name.toLowerCase().startsWith(searchQuery.toLowerCase());
        
        // Apply different sorting/filtering based on filterBy value
        let matchesFilter = true;
        if (filterBy === 'mostViewed') {
            // Sort by views (assuming we have a views property)
            matchesFilter = true; // We'll sort after filtering
        } else if (filterBy === 'mostRecent') {
            // Sort by date (assuming we have a date property)
            matchesFilter = true; // We'll sort after filtering
        } else if (filterBy === 'leastViewed') {
            // Sort by views (assuming we have a views property)
            matchesFilter = true; // We'll sort after filtering
        } else if (filterBy === 'leastRecent') {
            // Sort by date (assuming we have a date property)
            matchesFilter = true; // We'll sort after filtering
        }

        return matchesSearch && matchesFilter;
    });

    // Apply sorting based on filterBy
    if (filterBy === 'mostViewed') {
        // filteredVideos.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (filterBy === 'mostRecent') {
        filteredVideos.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    } else if (filterBy === 'leastViewed') {
        filteredVideos.sort((a, b) => (a.views || 0) - (b.views || 0));
    } else if (filterBy === 'leastRecent') {
        // Sort by the earliest date, prioritizing older videos
        filteredVideos.sort((a, b) => {
            // Handle cases where date might be undefined or invalid
            const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
            const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
            return dateA - dateB;
        });
    }

    if (isLoading) return <div>Loading...</div>;
    if (!selectedVideo) return <div>Loading...</div>;

    const handleBackOrMiniPlayer = () => {
        console.log('Minimizing video:', selectedVideo);
        
        // Prepare a comprehensive video state object
        const videoState = {
            video: selectedVideo,
            isPlaying: isPlaying,
            currentTime: videoRef.current ? videoRef.current.currentTime : 0,
            volume: volume,
            isMuted: isMuted,
            isLooping: isLooping,
            duration: duration,
            isMinimizing: true  // Add this flag
        };
    
        // Pass the entire video state to global mini-player
        handleGlobalMiniPlayer(videoState);
        
        // Navigate back to previous route
        navigate('/');
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-[#0f0f0f]" onTimeUpdate={handleTimeUpdate}>
            {/* Main Content */}
            <div className={`flex-1 p-4 md:p-6 overflow-y-auto scrollbar-thin 
                            scrollbar-track-[#0f0f0f] 
                            scrollbar-thumb-[#272727] 
                            hover:scrollbar-thumb-[#3a3a3a]
                            ${!showSidebar ? 'w-full' : 'w-96'}`}>
                {/* Back Button */}
                <button 
                    onClick={() => handleBackOrMiniPlayer()}
                    className="flex items-center text-sm md:text-md text-[#f1f1f1] mb-4 hover:text-white"
                >
                    <ArrowLeft className="mr-2" size={16} />
                    Back
                </button>

                {/* Video Player */}
                {isLoading ? (
                    <p className="text-[#f1f1f1]">Loading videos...</p>
                ) : (
                <div className="bg-black rounded overflow-hidden">
                    <div className="relative aspect-video">
                        <video
                            onClick={togglePlay} 
                            ref={videoRef}
                            src={`${import.meta.env.VITE_API_BASE_URL}/videos/display/${selectedVideo?.video_id}`}
                            className="w-full h-full object-cover"
                            onTimeUpdate={handleTimeUpdate}
                            // onPlay={() => setIsPlaying(true)}
                            // onPause={() => setIsPlaying(false)}
                            autoPlay
                            onEnded={handleVideoEnd}
                            onError={(e) => {
                                console.error('Video loading error:', e);
                                console.error('Video source:', `${import.meta.env.VITE_API_BASE_URL}/videos/display/${selectedVideo?.video_id}`);
                            }}
                            // controls
                        />
                        {!selectedVideo?.video_id && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
                                Video not available
                            </div>
                        )}
                        
                        {/* Video Controls */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 md:p-4">
                            <div className="flex items-center space-x-3 md:space-x-4 text-white">
                                <button onClick={togglePlay} className="hover:text-[#3ea6ff]">
                                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                                </button>
                                 
                                <input
                                    type="range"
                                    min="0"
                                    max={duration}
                                    step="0.1"
                                    value={currentTime}
                                    onChange={handleSeek}
                                    className="flex-1 h-1 bg-[#383838]"
                                />
                                 
                                <span className="text-xs md:text-sm text-[#f1f1f1]">
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </span>
                                 
                                <div className="flex items-center space-x-2" onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)}>
                                    <button onClick={toggleMute} className="hover:text-[#3ea6ff]">
                                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                    </button>

                                    {isShown && (
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={volume}
                                            onChange={handleVolumeChange}
                                            className="w-16 md:w-20 h-1 bg-[#383838]"
                                        />
                                    )}
                                </div>
                                 
                                <button onClick={toggleLoop} className={`hover:text-[#3ea6ff] ${isLooping ? 'text-[#3ea6ff]' : ''}`}>
                                    {isLooping ? <Repeat size={16} className="text-[#3ea6ff]" /> : <RotateCcw size={16} />}
                                </button>
                                 
                                <button onClick={toggleFullscreen} className="hover:text-[#3ea6ff]">
                                    {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                )}

                {/* Video Information */}
                <div className="mt-3 md:mt-4 space-y-3 md:space-y-4">
                    <p className="text-sm italic md:text-base text-[#f1f1f1]">* Follow naming format: "artist - title"</p>
                    {/* Title */}
                    <div className="flex items-center justify-between">
                        {isEditing ? (
                            <input
                                type="text"
                                value={videoTitle}
                                onChange={(e) => setVideoTitle(e.target.value)}
                                className="flex-1 text-lg md:text-2xl font-bold px-2 py-1 bg-[#121212] border border-[#272727] rounded text-[#f1f1f1] focus:outline-none focus:border-[#3ea6ff]"
                                autoFocus
                            />
                        ) : (
                            <h2 className="text-lg md:text-2xl font-bold text-[#f1f1f1]">{videoTitle}</h2>
                        )}
                        <button 
                            onClick={handleTitleEdit}
                            className="ml-2 p-1 md:p-2 hover:bg-[#272727] rounded-full text-[#f1f1f1]"
                        >
                            <Edit2 size={16} />
                        </button>
                    </div>

                    <div className="text-xs md:text-sm text-[#aaa]">
                        <a href={selectedVideo?.link} target="_blank" className="text-[#3ea6ff]">Watch on YouTube</a>
                        <p>{selectedVideo?.views} views</p>
                        <p>Created on: {selectedVideo?.created_at.split('T')[0]}</p>
                        <p>Last watched: {selectedVideo?.last_watched.split('T')[0]}</p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2 md:space-x-4">
                        <button 
                            onClick={() => {
                                setShowLyrics(!showLyrics);
                                setShowInfo(false);
                                setShowRecommendations(false);
                            }}
                            className={`flex items-center px-3 md:px-4 py-1 md:py-2 rounded ${
                                showLyrics ? 'bg-[#3ea6ff] text-white' : 'bg-[#272727] text-[#f1f1f1] hover:bg-[#383838]'
                            }`}
                        >
                            <FileText className="mr-1 md:mr-2" size={16} />
                            Show Lyrics
                        </button>
                        <button 
                            onClick={() => {
                                setShowInfo(!showInfo);
                                setShowLyrics(false);
                                setShowRecommendations(false);
                            }}
                            className={`flex items-center px-3 md:px-4 py-1 md:py-2 rounded ${
                                showInfo ? 'bg-[#3ea6ff] text-white' : 'bg-[#272727] text-[#f1f1f1] hover:bg-[#383838]'
                            }`}
                        >
                            <Info className="mr-1 md:mr-2" size={16} />
                            Show Info
                        </button>
                        <button 
                            onClick={() => {
                                setShowInfo(false);
                                setShowLyrics(false);
                                setShowRecommendations(!showRecommendations);
                            }}
                            className={`flex items-center px-3 md:px-4 py-1 md:py-2 rounded ${
                                showRecommendations ? 'bg-[#3ea6ff] text-white' : 'bg-[#272727] text-[#f1f1f1] hover:bg-[#383838]'
                            }`}
                        >
                            <FileVideo className="mr-1 md:mr-2" size={16} />
                            Show Recommendations
                        </button>
                    </div>
                </div>
            </div>

            {/* SidebarContent */}
            {showSidebar && (
            <SidebarContent 
                showLyrics={showLyrics} 
                showInfo={showInfo} 
                showRecommendations={showRecommendations}
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                filterBy={filterBy} 
                setFilterBy={setFilterBy} 
                filteredVideos={filteredVideos} 
                selectedVideo={selectedVideo}
                width={sidebarWidth}
                onClose={() => setShowSidebar(false)}
            />
        )}
        <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="fixed bottom-4 right-4 z-50 bg-[#272727] text-white p-2 rounded-full"
        >
            {showSidebar ? <X size={24} /> : <ChevronLeft size={24} />}
        </button>
        </div>
    );
}