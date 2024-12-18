import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export default function Playlist({id}) {
    const navigate = useNavigate();
  
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    
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
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/playlists/${id}/find-all-videos?filter=default`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, email }),
                });
                
                const data = await response.json();

                // console.log(data);

                if(data.success) { 
                    setVideos(data.data || []);
                } else {
                    console.log("No videos found"); 
                    setVideos([]);
                }
            } catch (error) {
                console.error("Fetch error:", error);
                setVideos([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVideos();
    }, [id]);

    const handleVideoClick = async (video) => {
        try {
            setIsLoading(true);
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

        navigate(`/watch/?v=${video.v_random_id}`, { state: { selectedVideo: video } });
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
                {isLoading ? (
                    <p className="text-[#f1f1f1]">Loading videos...</p>
                ) : (
                    <div className="space-y-2 overflow-y-scroll scrollbar-thin 
                            scrollbar-track-[#0f0f0f] 
                            scrollbar-thumb-[#272727] 
                            hover:scrollbar-thumb-[#3a3a3a] max-h-[76vh]">
                        {filteredVideos.length > 0 ? filteredVideos.map((video) => (
                            <div key={video.video_id}
                                className="flex items-center p-2 hover:bg-[#272727] rounded"
                                onContextMenu
                                onClick={() => handleVideoClick(video)}
                                >

                                <div className="relative">
                                    <video 
                                        src={`${import.meta.env.VITE_API_BASE_URL}/videos/display/${video?.video_id}`} 
                                        alt={video.video_name}
                                        className="w-24 h-16 object-cover rounded"
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
                        )) : (
                            <p className="text-[#f1f1f1] italic">No videos found</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}