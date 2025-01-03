import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Recommendation() {
    const navigate = useNavigate();
const [recommendedVideos, setVideos] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const username = localStorage.getItem("username");
const email = localStorage.getItem("email");

    useEffect(() => {
        const fetchVideos = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/videos/retrieve-old`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email }),
            });
            
            const data = await response.json();

                if(data.success) { 
                    setVideos(data.info || []);
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
    }, []);

    const handleVideoClick = async (video) => {
        try {
            const change = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/videos/${video.video_id}/increment-view`);
            
            if(!change) {
                console.error("Failed to increment view count:", error);
            }

            navigate(`/watch/?v=${video.v_random_id}`, { state: { selectedVideo: video } });
        } catch (error) {
            console.error("Failed to increment view count:", error);
            navigate(`/watch/?v=${video.v_random_id}`, { state: { selectedVideo: video } });
        }
    };

    return (
        <div className="bg-[#0f0f0f] text-[#f1f1f1] p-4">
            <h1 className="text-2xl font-bold mb-4">Unwatched last 30 days</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : recommendedVideos.length === 0 ? (
                <p>No videos available.</p>
            ) : (
                <div className="space-y-2 overflow-y-scroll scrollbar-thin 
                            scrollbar-track-[#0f0f0f] 
                            scrollbar-thumb-[#272727] 
                            hover:scrollbar-thumb-[#3a3a3a] max-h-[76vh]">
                    {recommendedVideos.map((video) => (
                        <div 
                            key={video.id}
                            className="flex items-center p-2 hover:bg-[#272727] rounded"
                            onClick={() => handleVideoClick(video)}
                        >
                            {/* <video
                                src={`${import.meta.env.VITE_API_BASE_URL}/videos/display/${video?.video_id}`} 
                                alt={video.title}
                                className="w-24 h-16 object-cover rounded"
                            /> */}
                            <div className="ml-3">
                                <h3 className="font-medium line-clamp-2 text-[#f1f1f1]">{video.title}</h3>
                                <p className="text-sm font-bold text-[#aaa]">{video.video_name}</p>
                                <p className="text-sm text-[#aaa]">Last watched: {video.last_watched.split("T")[0]}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}