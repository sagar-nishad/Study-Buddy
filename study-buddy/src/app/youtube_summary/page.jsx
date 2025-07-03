'use client';

import { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import axios from "axios";
import { basePath } from "../config";

export default function YouTubeSummaryPage() {
    const {user}  = UserAuth() ; 
    const [link, setLink] = useState("");
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Modal input states
    const [title, setTitle] = useState("");
    const [hashtags, setHashtags] = useState("");
    const [editableSummary, setEditableSummary] = useState("");

    const fetchSummary = async () => {
        setLoading(true);
        setSummary("");
        try {

            // ! commented out for now
            axios.post(basePath + "/api/summary" , {link : link})
            .then(res => {
                console.log(res)
                setSummary(res.data.summary)
            })
            .catch( errr =>{
                console.log(errr)
            })


            // setSummary("long summary--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- ");
        } catch (err) {
            setSummary("Failed to fetch summary.");
        }
        setLoading(false);
    };

    const savePost = () => {

        //  const newPost = {
        //     id: Date.now().toString() + user.email,
        //     title,
        //     hashtags,
        //     date: new Date().toISOString(),
        //     fileIds: fileIds,
        //     pdfUrl: pdfUrl,
        //     imageUrls: imageUrls,
        //     userID: user.email,
        //     summary: null,
        // };
        const post = {
            title,
            hashtags,
            id : Date.now().toString() + user.email   , 
            fileIds: [] , 
            userID : user.email ,  
            summary: editableSummary,
            pdfUrl: null,
            imageUrls: null ,
            date: new Date().toISOString(),
        };
        console.log("creating post : " ,post)
        axios
            .post("http://localhost:5000/api/createPost", post)
            .then((res) => {
                console.log("res : createPost ", res);
            })
            .catch((errr) => {
                console.log(errr);
            });

        setShowModal(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-3xl font-bold mb-6">YouTube Summary</h1>

            <div className="mb-6 flex gap-4 flex-wrap">
                <input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Paste YouTube link..."
                    className="w-full md:w-[400px] px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
                />
                <button
                    onClick={fetchSummary}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                >
                    Get Summary
                </button>
            </div>

            {loading && <p className="text-gray-400">Loading summary...</p>}

            {summary && (
                <div className="bg-gray-800 p-4 rounded-lg shadow max-w-3xl whitespace-pre-wrap">
                    {summary}
                    <div className="mt-4">
                        <button
                            onClick={() => {
                                setEditableSummary(summary);
                                setShowModal(true);
                            }}
                            className="mt-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                        >
                            Post Summary
                        </button>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white text-black p-6 rounded-lg w-full max-w-xl">
                        <h2 className="text-xl font-semibold mb-4">Save Summary</h2>

                        <label className="block mb-2 text-sm">Title</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 mb-4 border rounded bg-gray-100"
                        />

                        <label className="block mb-2 text-sm">Hashtags</label>
                        <input
                            value={hashtags}
                            onChange={(e) => setHashtags(e.target.value)}
                            className="w-full p-2 mb-4 border rounded bg-gray-100"
                            placeholder="CS101"
                        />

                        <label className="block mb-2 text-sm">Edit Summary</label>
                        <textarea
                            value={editableSummary}
                            onChange={(e) => setEditableSummary(e.target.value)}
                            rows={6}
                            className="w-full p-2 mb-4 border rounded bg-gray-100"
                        />

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={savePost}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
