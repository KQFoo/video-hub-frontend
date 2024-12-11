import { useState } from "react";

export default function Playlist() {
    // Sample videos data
    const [videos] = useState([
        {
            id: 1,
            thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
            title: "Never Gonna Give You Up",
            channel: "Rick Astley",
            views: "1.2B views",
            duration: "3:32"
        },
        {
            id: 2,
            thumbnail: "https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg",
            title: "Shape of You",
            channel: "Ed Sheeran",
            views: "5.8B views",
            duration: "4:23"
        },
        {
            id: 3,
            thumbnail: "https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg",
            title: "Despacito",
            channel: "Luis Fonsi",
            views: "8B views",
            duration: "4:41"
        },
        {
            id:4,
            thumbnail: "https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg",
            title: "Despacito",
            channel: "Luis Fonsi",
            views: "8B views",
            duration: "4:41"
        },
        {
            id:5,
            thumbnail: "https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg",
            title: "She",
            channel: "Luis Fonsi",
            views: "8B views",
            duration: "4:41"
        }
    ]);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredVideos = videos.filter(video =>
        video.title.toLowerCase().startsWith(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-[#0f0f0f] text-[#f1f1f1] p-6">
            <div className="flex justify-center mb-6 relative">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-3/4 max-w-md px-4 py-2 rounded border border-[#272727] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[#f1f1f1] bg-[#0f0f0f]"
                />
                {searchQuery && filteredVideos.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-[#0f0f0f] border border-[#272727] rounded-md shadow-lg">
                        {filteredVideos.map((video) => (
                            <div 
                                key={video.id} 
                                className="px-4 py-2 hover:bg-[#272727] cursor-pointer flex items-center gap-2 text-[#f1f1f1]"
                                onClick={() => setSearchQuery(video.title)}
                            >
                                <div>
                                    <p className="text-sm font-medium text-[#f1f1f1]">{video.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {/* {searchQuery && (
                    <p className="mt-2 text-sm text-gray-600">
                        Showing videos that start with "{searchQuery}"
                    </p>
                )} */}
            </div>
            <div onClick={() => setSearchQuery("")}>
                <h2 className="text-xl font-bold mb-4 text-[#f1f1f1]">Playlist 
                    <span className="ml-2 italic text-sm font-medium text-[#aaa]">
                        (Total: {filteredVideos.length} {filteredVideos.length === 1 ? "video" : "videos"})
                    </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {filteredVideos.map((video) => (
                        <div key={video.id} className="rounded overflow-hidden hover:bg-[#272727] transition-shadow duration-300">
                            <div className="relative">
                                <img 
                                    src={video.thumbnail} 
                                    alt={video.title}
                                    className="w-full h-48 object-cover"
                                />
                                <span className="absolute bottom-2 right-2 bg-[#0f0f0f] bg-opacity-55 text-[#f1f1f1] text-sm px-2 py-1 rounded">
                                    {video.duration}
                                </span>
                            </div>
                            <div className="p-2.5">
                                <h3 className="font-semibold text-[#f1f1f1] mb-1 line-clamp-2">
                                    {video.title}
                                </h3>
                                <p className="text-[#aaa] text-sm">
                                    {video.views}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}