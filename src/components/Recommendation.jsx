import { useState } from "react";
import { Plus } from 'react-feather';

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
        <div className="bg-[#0f0f0f] text-[#f1f1f1] p-4">
            <h1 className="text-2xl font-bold mb-4">Recommendations</h1>
            <div className="space-y-2">
                {recommendedVideos.map((video) => (
                    <div 
                        key={video.id}
                        className="flex items-center p-2 hover:bg-[#272727] rounded"
                    >
                        <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-24 h-16 object-cover rounded"
                        />
                        <div className="ml-3">
                            <h3 className="font-medium line-clamp-2 text-[#f1f1f1]">{video.title}</h3>
                            <p className="text-sm text-[#aaa]">{video.views}</p>
                            <p className="text-sm text-[#aaa]">last_watched</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}