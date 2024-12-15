import { useState, useEffect, useRef } from "react";
import { LayoutDashboard, Download, Music, Video, DiscAlbum, Play, Pause, X } from "lucide-react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Sidebar, { SidebarItem, Submenu } from "./components/Sidebar";
import DownloadVideo from "./components/Download";
import Recommendation from "./components/Recommendation";
import Playlist from "./components/Playlist";
import PlayVideo from "./components/Video";
import { toast } from 'react-hot-toast';

function AppContent() {
  const [activeItem, setActiveItem] = useState('home');
  const [selectedVideo] = useState({
    id: 1,
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Sample video URL
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    title: "Never Gonna Give You Up",
    artist: "Rick Astley",
    views: "1.2B views",
    duration: "3:32",
    lyrics: "Never gonna give you up\nNever gonna let you down\nNever gonna run around and desert you...",
    info: {
      artist: "Rick Astley",
      album: "Whenever You Need Somebody",
      year: "1987",
      genre: "Pop"
    }
  });

  const renderContent = () => {
    switch (activeItem) {
      case 'home':
        return (
          <>
            <DownloadVideo />
            <hr className="border-gray-300" />
            <Recommendation />
          </>
        );
      case 'music':
        return <Playlist id={1} />;
      case 'video':
        return <Playlist id={2} />;
      case 'music no lyrics':
        return <Playlist id={3} />;
      default:
        return (
          <>
            <DownloadVideo />
            <hr className="border-gray-300" />
            <Recommendation />
          </>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-[#f1f1f1]">
      <Sidebar>
        <hr className="my-3 border-none" />
        <SidebarItem 
          icon={<LayoutDashboard size={20} />} 
          text="Home" 
          active={activeItem === 'home'}
          onClick={() => setActiveItem('home')}
        />
        <hr className="my-1.5 border-none" />
        <SidebarItem 
          icon={<Download size={20} />} 
          text="Downloads"
        >
          <Submenu 
            icon={<Music size={20} />} 
            text="Music" 
            active={activeItem === 'music'}
            onClick={() => setActiveItem('music')}
          />
          <Submenu 
            icon={<DiscAlbum size={20} />} 
            text="Music (No Lyrics)" 
            active={activeItem === 'music no lyrics'}
            onClick={() => setActiveItem('music no lyrics')}
          />
          <Submenu 
            icon={<Video size={20} />} 
            text="Videos" 
            active={activeItem === 'video'}
            onClick={() => setActiveItem('video')}
          />
        </SidebarItem>
      </Sidebar>
      <main className="flex-1 overflow-auto">
        <div className="">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

function App() {
  const [globalMiniPlayer, setGlobalMiniPlayer] = useState(null);
  const videoRef = useRef(null);
  const [videoState, setVideoState] = useState({
    isPlaying: false,
    volume: 1,
    isMuted: false,
    currentTime: 0,
    duration: 0
  });

  const handleGlobalMiniPlayer = (videoStateFromPlayer) => {
    // Always reset the mini-player
    setGlobalMiniPlayer(null);
    setVideoState({
      isPlaying: false, 
      volume: 1, 
      isMuted: false, 
      currentTime: 0,
      duration: 0 
    });
  
    // Only set the mini-player if explicitly minimizing
    if (videoStateFromPlayer.isMinimizing) {
      setGlobalMiniPlayer(videoStateFromPlayer.video);
      setVideoState(videoStateFromPlayer);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      // Set initial video state
      videoRef.current.currentTime = videoState.currentTime;
      videoRef.current.volume = videoState.isMuted ? 0 : videoState.volume;
      
      // Play or pause based on previous state
      if (videoState.isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [globalMiniPlayer]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoState.isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setVideoState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
    }
  };

  const handleVolumeChange = (newVolume) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVideoState(prev => ({ 
        ...prev, 
        volume: newVolume, 
        isMuted: newVolume === 0 
      }));
    }
  };

  const handleSeek = (newTime) => {
    newTime = parseFloat(newTime.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setVideoState(prev => ({ ...prev, currentTime: newTime }));
    }
  };

  // Global refresh prevention
  useEffect(() => {
    const preventRefresh = (e) => {
      // Prevent default refresh actions
      // e.preventDefault();
      
      // Block all refresh attempts
      if (
        e.key === 'F5' || 
        (e.ctrlKey && e.key === 'r') || 
        (e.metaKey && e.key === 'r')
      ) {
        e.preventDefault();
        toast.error('Page refresh is disabled', {
          position: 'top-right',
          duration: 2000
        });
        return false;
      }
    };

    const preventBrowserRefresh = (e) => {
      e.preventDefault();
      e.returnValue = ''; // Required for Chrome
      return 'Page refresh is disabled';
    };

    // Add event listeners
    window.addEventListener('keydown', preventRefresh);
    window.addEventListener('beforeunload', preventBrowserRefresh);

    // Cleanup function
    return () => {
      window.removeEventListener('keydown', preventRefresh);
      window.removeEventListener('beforeunload', preventBrowserRefresh);
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
      <Routes>
        <Route 
          path="/" 
          element={<AppContent />} 
        />
        <Route 
          path="/watch" 
          element={<PlayVideo handleGlobalMiniPlayer={handleGlobalMiniPlayer} />} 
        />
      </Routes>

        {/* Global Mini Player */}
        {globalMiniPlayer && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#272727] p-2 flex items-center">
          <video 
            ref={videoRef}
            src={`${import.meta.env.VITE_API_BASE_URL}/videos/display/${globalMiniPlayer.video_id}`}
            className="w-16 h-16 object-cover rounded-lg mr-4"
            autoPlay
            onTimeUpdate={() => setVideoState(prev => ({ ...prev, currentTime: videoRef.current.currentTime }))}
            onDurationChange={() => setVideoState(prev => ({ ...prev, duration: videoRef.current.duration }))}
            onEnded={togglePlay}
            onVolumeChange={(e) => handleVolumeChange(e.target.value)}
            onClick={togglePlay}
          />
          <div className="flex-1 flex items-center justify-between text-white">
            <span className="text-sm truncate mr-2 max-w-[180px]">
              {globalMiniPlayer.video_name}
            </span>
            
            <input
              type="range"
              min="0"
              max={videoState.duration}
              step="0.1"
              value={videoState.currentTime}
              onChange={handleSeek}
              className="flex-1 mr-2 h-1 bg-[#383838]"
            />

            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={videoState.volume}
              onChange={(e) => handleVolumeChange(e.target.value)}
              className="w-16 mr-2 h-1 bg-[#383838] rounded-full"
            />

            <div>
              <button 
                onClick={togglePlay}
                className="mb:mr-0 hover:bg-[#383838] rounded-full p-1"
              >
                {videoState.isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button 
                onClick={() => {
                  setGlobalMiniPlayer(null);
                  setVideoState({ 
                    isPlaying: false, 
                    volume: 1, 
                    isMuted: false, 
                    currentTime: 0,
                    duration: 0 
                  });
                }}
                className="mr-6 mb:mr-0 hover:bg-[#383838] rounded-full p-1"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </BrowserRouter>
  );
}

export default App;