import { useState } from "react";
import { LayoutDashboard, Download, Music, Video } from "lucide-react";
import { BrowserRouter } from "react-router-dom";
import Sidebar, { SidebarItem, Submenu } from "./components/Sidebar";
import DownloadVideo from "./components/Download";
import Recommendation from "./components/Recommendation";
import Playlist from "./components/Playlist";
import VideoPlay from "./components/Video";

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
        return <Playlist />;
      case 'video':
        return <VideoPlay selectedVideo={selectedVideo} />;
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
    <main className="flex h-screen bg-[#0f0f0f] text-white">
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
            icon={<Video size={20} />} 
            text="Videos" 
            active={activeItem === 'video'}
            onClick={() => setActiveItem('video')}
          />
        </SidebarItem>
      </Sidebar>
      <div className="flex-1 overflow-auto">
        <div className="">
          {renderContent()}
        </div>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}