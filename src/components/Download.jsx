import { useState } from "react";
import { toast } from "react-hot-toast";

export default function DownloadVideo() {
    const [youtubeLink, setYoutubeLink] = useState("");
    const [isDownloading, setIsDownloading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [playlistId, setPlaylistId] = useState(0);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");

    const handleDownload = async () => {
        setIsDownloading(true);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v/download`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': `${import.meta.env.VITE_API_BASE_URL}`,
                },
                body: JSON.stringify({ 
                    url: youtubeLink,
                    playlist_id: playlistId,
                    username,
                    email
                }),
            });

            const data = await response.json();

            if (!data.success) {
                setError(data.message || "Download failed");
                setIsDownloading(false);
                return;
            }

            setIsDownloading(false);
            setYoutubeLink("");
            setIsEditing(false);
            setPlaylistId(0);
            setError(null);
            setSuccess("Video downloaded successfully!");
        } catch (err) {
            setError("Network error. Please try again.");
            setIsDownloading(false);
            console.error('Detailed Download Error:', {
                // message: error,
                // stack: error.stack,
                fullError: err
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-top bg-[#0f0f0f] p-4">
            <div className="w-full max-w-2xl p-6 text-[#f1f1f1]">
                {error && (
                    <div className="text-red-500 p-3 flex items-center justify-center rounded mb-4">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="text-green-500 p-3 flex items-center justify-center rounded mb-4 duration-300">
                        {success}
                    </div>
                )}
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        name="link"
                        value={youtubeLink}
                        onChange={(e) => {
                            setYoutubeLink(e.target.value);
                            setError(null);
                            setIsEditing(true);
                            setSuccess(null);
                        }}
                        placeholder="Paste your video link here"
                        className="flex-1 px-4 py-2 border border-[#272727] rounded focus:outline-none focus:ring-2 focus:ring-[#383838] focus:border-transparent text-black"
                    />
                    <button 
                        onClick={() => handleDownload(playlistId)}
                        disabled={!youtubeLink || isDownloading}
                        className={`px-4 py-2 rounded ${
                            !youtubeLink || isDownloading 
                                ? 'bg-gray-500 cursor-not-allowed' 
                                : 'bg-[#3ea6ff] hover:bg-[#5cb6ff]'
                        }`}
                    >
                        {isDownloading ? 'Downloading...' : 'Download'}
                    </button>
                </div>
                {isEditing && youtubeLink !== "" && (
                    <select
                        value={playlistId}
                        disabled={isDownloading}
                        onChange={(e) => setPlaylistId(e.target.value)}
                        className="w-full p-2 mt-4 bg-[#121212] border border-[#272727] rounded text-[#f1f1f1] focus:outline-none focus:border-[#3ea6ff]"
                    >
                        <option value="0">Select Playlist</option>
                        <option value="1">Music</option>
                        <option value="3">Music (No Lyrics)</option>
                        <option value="2">Videos</option>
                    </select>
                )}
            </div>
        </div>
    );
}