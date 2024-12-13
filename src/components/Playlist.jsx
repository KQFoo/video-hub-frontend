import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export default function Playlist() {
    const navigate = useNavigate();
  
    const [videos, setVideos] = useState([]);

    // const Str_Random = (length) => {
    //     let result = '';
    //     const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        
    //     for (let i = 0; i < length; i++) {
    //         const randomInd = Math.floor(Math.random() * characters.length);
    //         result += characters.charAt(randomInd);
    //     }
    //     return result;
    // }

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/playlists/1/find-all-videos?filter=default`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }});
                
                const data = await response.json();

                // console.log(data);

                if(data.success) { 
                    setVideos(data.data); 
                } else {
                    console.log("No videos found"); 
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        fetchVideos();
    }, []);

    const handleVideoClick = async (video) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/videos/${video.video_id}/increment-view`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                }});

            const data = await response.json();

            if (data.success) {
                console.log("View count updated successfully");
            } else {
                console.error("Failed to update view count");
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }

        navigate(`/watch/?v=${video.video_id}`, { state: { selectedVideo: video } });
    };


    const [searchQuery, setSearchQuery] = useState('');

    const filteredVideos = videos.filter(video =>
        video.video_name.toLowerCase().startsWith(searchQuery.toLowerCase())
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
                    <div className="absolute z-10 w-3/4 max-w-md mt-11 bg-[#0f0f0f] border border-[#272727] rounded-md shadow-lg">
                        {filteredVideos.map((video) => (
                            <div 
                                key={video.video_id} 
                                className="px-4 py-2 hover:bg-[#272727] cursor-pointer flex items-center gap-2 text-[#f1f1f1]"
                                onClick={() => setSearchQuery(video.video_name)}
                            >
                                <div>
                                    <p className="text-sm font-medium text-[#f1f1f1]">{video.video_name}</p>
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
                        (Total: {filteredVideos.length} {filteredVideos.length === 1 || filteredVideos.length === 0 ? "video" : "videos"})
                    </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {filteredVideos.map((video) => (
                        <div key={video.video_id}
                             className="rounded overflow-hidden hover:bg-[#272727] transition-shadow duration-300"
                             onClick={() => handleVideoClick(video)}
                            >

                            <div className="relative">
                                <img 
                                    src={video.thumbnail} 
                                    alt={video.video_name}
                                    className="w-full h-48"
                                />
                                {/* <span className="absolute bottom-2 right-2 bg-[#0f0f0f] bg-opacity-55 text-[#f1f1f1] text-sm px-2 py-1 rounded">
                                    {video.duration}
                                </span> */}
                            </div>
                            <div className="p-2.5">
                                <h3 className="font-semibold text-[#f1f1f1] mb-1 line-clamp-2">
                                    {video.video_name}
                                </h3>
                                <p className="text-[#aaa] text-sm">
                                    {video.views} views
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}