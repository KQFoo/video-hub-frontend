import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export default function Recommendation() {
    const navigate = useNavigate();
const [recommendedVideos, setVideos] = useState([]);
const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/videos/retrieve-old`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }});
            
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

    return (
        <div className="bg-[#0f0f0f] text-[#f1f1f1] p-4">
            <h1 className="text-2xl font-bold mb-4">Unwatched last 30 days</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : recommendedVideos.length === 0 ? (
                <p>No videos available.</p>
            ) : (
                <div className="space-y-2">
                    {recommendedVideos.map((video) => (
                        <div 
                            key={video.id}
                            className="flex items-center p-2 hover:bg-[#272727] rounded"
                            onClick={() => navigate(`/watch?v=${video.v_random_id}`, { state: { selectedVideo: video } })}
                        >
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-24 h-16 object-cover rounded"
                            />
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