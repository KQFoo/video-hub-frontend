import { useState } from "react";
import { LayoutDashboard, Download, Music, Video } from "lucide-react";
import Sidebar, { SidebarItem, Submenu } from "./components/Sidebar";
import DownloadVideo from "./components/Download";
import Recommendation from "./components/Recommendation";
import Playlist from "./components/Playlist";

export default function App() { 
  const [activeItem, setActiveItem] = useState('home');

  const renderContent = () => {
    switch (activeItem) {
      case 'home':
        return (
          <>
            <DownloadVideo />
            <Recommendation />
          </>
        );
      case 'music':
      case 'video':
        return <Playlist />;
      default:
        return (
          <>
            <DownloadVideo />
            <Recommendation />
          </>
        );
    }
  };

  return (
    <main className="flex h-screen bg-gray-100">
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
        <div className="p-4">
          {renderContent()}
        </div>
      </div>
    </main>
  );
}