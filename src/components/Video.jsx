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
    FileVideo
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SidebarContent from './SidebarContent';

export default function VideoPlay({ selectedVideo }) {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isShown, setIsShown] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showLyrics, setShowLyrics] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [showRecommendations, setShowRecommendations] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [videoTitle, setVideoTitle] = useState(selectedVideo?.title || "");
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterBy, setFilterBy] = useState("all");

    // Sample videos data
    const [playlistVideos] = useState([
        {
            id: 1,
            thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
            title: "Never Gonna Give You Up",
            artist: "Rick Astley",
            views: "1.2B views",
            duration: "3:32",
            lyrics: "Never gonna give you up...",
            info: {
                artist: "Rick Astley",
                album: "Whenever You Need Somebody",
                year: "1987",
                genre: "Pop"
            }
        },
        // Add more videos
    ]);

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

    const handleTitleEdit = () => {
        if (isEditing) {
            // Save the new title
            // You would typically make an API call here
            console.log("Saving new title:", videoTitle);
        }
        setIsEditing(!isEditing);
    };

    const filteredVideos = playlistVideos.filter(video => {
        const matchesSearch = video.title.toLowerCase().startsWith(searchQuery.toLowerCase());
        
        // Apply different sorting/filtering based on filterBy value
        let matchesFilter = true;
        if (filterBy === 'mostViewed') {
            // Sort by views (assuming we have a views property)
            matchesFilter = true; // We'll sort after filtering
        } else if (filterBy === 'mostRecent') {
            // Sort by date (assuming we have a date property)
            matchesFilter = true; // We'll sort after filtering
        } else if (filterBy === 'alphabetical') {
            // Sort alphabetically
            matchesFilter = true; // We'll sort after filtering
        }

        return matchesSearch && matchesFilter;
    });

    // Apply sorting based on filterBy
    if (filterBy === 'mostViewed') {
        filteredVideos.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (filterBy === 'mostRecent') {
        filteredVideos.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    } else if (filterBy === 'alphabetical') {
        filteredVideos.sort((a, b) => a.title.localeCompare(b.title));
    }

    return (
        <div className="flex h-screen bg-[#0f0f0f]">
            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto">
                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center text-md text-[#f1f1f1] mb-4 hover:text-white"
                >
                    <ArrowLeft className="mr-2" />
                    Back
                </button>

                {/* Video Player */}
                <div onClick={togglePlay} className="bg-black rounded overflow-hidden">
                    <div className="relative aspect-video">
                        <video
                            ref={videoRef}
                            src={selectedVideo?.videoUrl}
                            className="w-full h-full object-cover"
                            onTimeUpdate={handleTimeUpdate}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                        />
                        
                        {/* Video Controls */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                            <div className="flex items-center space-x-4 text-white">
                                <button onClick={togglePlay} className="hover:text-[#3ea6ff]">
                                    {isPlaying ? <Pause /> : <Play />}
                                </button>
                                 
                                <input
                                    type="range"
                                    min="0"
                                    max={duration || 0}
                                    value={currentTime}
                                    onChange={handleSeek}
                                    className="flex-1 h-1 bg-[#383838]"
                                />
                                 
                                <span className="text-sm text-[#f1f1f1]">
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </span>
                                 
                                <div className="flex items-center space-x-2" onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)}>
                                    <button onClick={toggleMute} className="hover:text-[#3ea6ff]">
                                        {isMuted ? <VolumeX /> : <Volume2 />}
                                    </button>

                                    {isShown && (
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={volume}
                                            onChange={handleVolumeChange}
                                            className="w-20 h-1 bg-[#383838]"
                                        />
                                    )}
                                </div>
                                 
                                <button onClick={toggleLoop} className={`hover:text-[#3ea6ff] ${isLooping ? 'text-[#3ea6ff]' : ''}`}>
                                    {isLooping ? <Repeat className="text-[#3ea6ff]" /> : <RotateCcw />}
                                </button>
                                 
                                <button onClick={toggleFullscreen} className="hover:text-[#3ea6ff]">
                                    {isFullscreen ? <Minimize /> : <Maximize />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Video Information */}
                <div className="mt-4 space-y-4">
                    {/* Title */}
                    <div className="flex items-center justify-between">
                        {isEditing ? (
                            <input
                                type="text"
                                value={videoTitle}
                                onChange={(e) => setVideoTitle(e.target.value)}
                                className="flex-1 text-2xl font-bold px-2 py-1 bg-[#121212] border border-[#272727] rounded text-[#f1f1f1] focus:outline-none focus:border-[#3ea6ff]"
                                autoFocus
                            />
                        ) : (
                            <h2 className="text-2xl font-bold text-[#f1f1f1]">{videoTitle}</h2>
                        )}
                        <button 
                            onClick={handleTitleEdit}
                            className="ml-2 p-2 hover:bg-[#272727] rounded-full text-[#f1f1f1]"
                        >
                            <Edit2 size={20} />
                        </button>
                    </div>

                    <div className="text-[#aaa]">
                        <p>link</p>
                        <p>views</p>
                        <p>created_at</p>
                        <p>last_watched</p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                        <button 
                            onClick={() => {
                                setShowLyrics(!showLyrics);
                                setShowInfo(false);
                                setShowRecommendations(false);
                            }}
                            className={`flex items-center px-4 py-2 rounded ${
                                showLyrics ? 'bg-[#3ea6ff] text-white' : 'bg-[#272727] text-[#f1f1f1] hover:bg-[#383838]'
                            }`}
                        >
                            <FileText className="mr-2" size={20} />
                            Show Lyrics
                        </button>
                        <button 
                            onClick={() => {
                                setShowInfo(!showInfo);
                                setShowLyrics(false);
                                setShowRecommendations(false);
                            }}
                            className={`flex items-center px-4 py-2 rounded ${
                                showInfo ? 'bg-[#3ea6ff] text-white' : 'bg-[#272727] text-[#f1f1f1] hover:bg-[#383838]'
                            }`}
                        >
                            <Info className="mr-2" size={20} />
                            Show Info
                        </button>
                        <button 
                            onClick={() => {
                                setShowInfo(false);
                                setShowLyrics(false);
                                setShowRecommendations(!showRecommendations);
                            }}
                            className={`flex items-center px-4 py-2 rounded ${
                                showRecommendations ? 'bg-[#3ea6ff] text-white' : 'bg-[#272727] text-[#f1f1f1] hover:bg-[#383838]'
                            }`}
                        >
                            <FileVideo className="mr-2" size={20} />
                            Show Recommendations
                        </button>
                    </div>
                </div>
            </div>

            {/* Sidebar */}
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
            />
        </div>
    );
}