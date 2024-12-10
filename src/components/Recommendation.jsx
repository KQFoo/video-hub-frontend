import { useState } from "react";

export default function Recommendation() {
    // Sample recommended videos data
    const [recommendedVideos] = useState([
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
            title: "Despacito",
            channel: "Luis Fonsi",
            views: "8B views",
            duration: "4:41"
        }
    ]);

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Recommended Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {recommendedVideos.map((video) => (
                    <div key={video.id} className="rounded overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="relative">
                            <img 
                                src={video.thumbnail} 
                                alt={video.title}
                                className="w-full h-48 object-cover"
                            />
                            <span className="absolute bottom-2 right-2 bg-black bg-opacity-55 text-white text-sm px-2 py-1 rounded">
                                {video.duration}
                            </span>
                        </div>
                        <div className="p-2.5">
                            <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                                {video.title}
                            </h3>
                            <p className="text-gray-500 text-sm">
                                {video.views}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}