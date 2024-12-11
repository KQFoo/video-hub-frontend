import { useState } from "react";

export default function DownloadVideo() {
    const [youtubeLink, setYoutubeLink] = useState("");

    return (
        <div className="flex flex-col items-center justify-top bg-[#0f0f0f] p-4">
            <div className="w-full max-w-2xl p-6 text-[#f1f1f1]">
                {/* <h2 className="text-2xl font-bold text-[#f1f1f1] mb-4 text-center">Download YouTube Video</h2> */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        name="link"
                        value={youtubeLink}
                        onChange={(e) => setYoutubeLink(e.target.value)}
                        placeholder="Paste your video link here"
                        className="flex-1 px-4 py-2 border border-[#272727] focus:outline-none focus:ring-2 focus:ring-[#383838] focus:border-transparent text-black"
                    />
                    <button 
                        className="bg-[#383838] hover:bg-[#434343] text-[#f1f1f1] font-semibold py-2 px-6 transition duration-200 ease-in-out"
                        onClick={() => console.log("Download clicked:", youtubeLink)}
                    >
                        Download
                    </button>
                </div>
            </div>
        </div>
    );
}