import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
    FaSearch, 
    FaSpinner, 
    FaExclamationCircle 
} from 'react-icons/fa';

export default function Playlist({ id }) {
    const navigate = useNavigate();
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        pages: 1,
        limit: 50,
        hasNextPage: false,
        total: 0
    });
    const [searchQuery, setSearchQuery] = useState('');
    const lastVideoElementRef = useRef();

    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");

    const fetchVideos = useCallback(async (page = 1) => {
        if (isLoading) return;
        
        setIsLoading(true);
        setError(null);
        try {
            console.log(`Fetching videos for playlist ${id}, page ${page}`);
            
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/playlists/${id}/videos`, {
                params: { 
                    page, 
                    limit: pagination.limit,
                },
                // headers: {
                //     'username': username,
                //     'email': email
                // }
            });

            console.log('Full API Response:', response.data);

            // Destructure with specific handling for this response structure
            const { 
                success, 
                videos: newVideos, 
                pagination: newPagination 
            } = response.data;

            if (!success) {
                throw new Error('Failed to fetch videos');
            }

            console.log('Videos to set:', newVideos);

            setVideos(prevVideos => 
                page === 1 
                    ? newVideos 
                    : [...prevVideos, ...newVideos]
            );

            setPagination(prevPagination => ({
                ...prevPagination,
                ...newPagination,
                total: newPagination.total || newVideos.length
            }));

        } catch (err) {
            console.error('Detailed Fetch Error:', err);
            setError(
                err.response?.data?.message || 
                err.message || 
                'Failed to fetch videos'
            );
        } finally {
            setIsLoading(false);
        }
    }, [id, pagination.limit, username, email]);

    // Infinite scroll implementation
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && pagination.hasNextPage && !isLoading) {
                    fetchVideos(pagination.page + 1);
                }
            },
            { threshold: 0.1 }
        );

        if (lastVideoElementRef.current) {
            observer.observe(lastVideoElementRef.current);
        }

        return () => {
            if (lastVideoElementRef.current) {
                observer.unobserve(lastVideoElementRef.current);
            }
        };
    }, [fetchVideos, pagination.hasNextPage, isLoading]);

    // Initial fetch
    useEffect(() => {
        fetchVideos(1);
    }, [id, fetchVideos]);

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

    const renderVideoItem = (video, isLast) => (
        <div 
            key={video.video_id}
            ref={isLast ? lastVideoElementRef : null}
            className="flex items-center p-2 hover:bg-[#272727] rounded cursor-pointer group transition-colors duration-200"
            onClick={() => handleVideoClick(video)}
        >
            <div className="flex-shrink-0 mr-4">
                {/* <div className="w-24 h-16 bg-[#1a1a1a] rounded overflow-hidden">
                    {video.thumbnail ? (
                        <img 
                            src={video.thumbnail} 
                            alt={video.video_name} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#666]">
                            No Preview
                        </div>
                    )}
                </div> */}
            </div>
            <div className="flex-grow">
                <h3 className="font-semibold text-[#f1f1f1] mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {video.video_name}
                </h3>
                <div className="text-[#aaa] text-sm flex items-center space-x-2">
                    <span>{video.views ? video.views : '0'} views</span>
                    <span className="text-xs">•</span>
                    <span>{new Date(video.created_at).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-[#0f0f0f] text-[#f1f1f1] min-h-screen">
            <div className="container mx-auto px-4 py-6">
            
            {/* Search Bar */}
            <div className="mb-6 relative">
                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder="Search videos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-full 
                            bg-[#272727] text-[#f1f1f1] 
                            focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FaSearch className="absolute left-3 text-[#aaa]" />
                </div>
            </div>

            {/* Videos List with Search Filtering */}
            <div className="space-y-2">
                {error ? (
                    <div className="flex items-center justify-center text-red-500 space-x-2">
                        <FaExclamationCircle />
                        <p>{error}</p>
                    </div>
                ) : (
                    <>
                        {/* Filtered Videos */}
                        {searchQuery ? (
                            <div>
                                {videos
                                    .filter(video => 
                                        video.video_name.toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                    .map((video, index) => 
                                        renderVideoItem(video, index === videos.length - 1)
                                    )
                                }
                                {videos.filter(video => 
                                    video.video_name.toLowerCase().includes(searchQuery.toLowerCase())
                                ).length === 0 && (
                                    <div className="text-center text-[#aaa] py-10">
                                        No videos match your search
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Original video rendering logic
                            videos.length > 0 ? (
                                videos.map((video, index) => 
                                    renderVideoItem(video, index === videos.length - 1)
                                )
                            ) : (
                                <div className="text-center text-[#aaa] py-10">
                                    {isLoading ? 'Loading videos...' : 'No videos found'}
                                </div>
                            )
                        )}

                        {/* Loading Indicator */}
                        {isLoading && (
                            <div className="flex justify-center items-center py-4">
                                <FaSpinner className="animate-spin text-2xl text-[#aaa]" />
                            </div>
                        )}

                        {/* End of List Indicator */}
                        {!pagination.hasNextPage && videos.length > 0 && (
                            <div className="text-center text-[#aaa] py-4">
                                No more videos to load
                            </div>
                        )}
                    </>
                )}
            </div>
            </div>
        </div>
    );
}