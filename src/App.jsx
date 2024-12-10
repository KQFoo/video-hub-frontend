import { Download, LayoutDashboard, Music, Video } from "lucide-react";
import Sidebar, { SidebarItem, Submenu } from "./components/Sidebar";
import DownloadVideo from "./components/Download";
import Recommendation from "./components/Recommendation";

export default function App() { 
  return (
    <main className="flex h-screen bg-gray-100">
      <Sidebar>
        <hr className="my-3 border-none" />
        <SidebarItem icon={<LayoutDashboard size={20} />} text="Home" active />
        <hr className="my-1.5 border-none" />
        <SidebarItem icon={<Download size={20} />} text="Downloads">
          <Submenu icon={<Music size={20} />} text="Music" />
          <Submenu icon={<Video size={20} />} text="Videos" />
        </SidebarItem>
      </Sidebar>
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <DownloadVideo />
          <Recommendation />
        </div>
      </div>
    </main>
  );
}