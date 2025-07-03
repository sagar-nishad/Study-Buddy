"use client";

import { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import axios from "axios";
import { basePath } from "../config";

export default function PostsPage() {
    const [posts, setPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [imagesPreview, setImagesPreview] = useState(null);
    const [imageFiles, setImageFiles] = useState([]);
    const [pdfFile, setPdfFile] = useState(null);
    const [fileIds, setFileIds] = useState([]);
    const [activeText, setActiveText] = useState(null);

    const { user } = UserAuth();

    // Form fields
    const [title, setTitle] = useState("");
    const [hashtags, setHashtags] = useState("");

    const get_user_post = async (mail, type) => {
        console.log(mail, type)
        axios
            .get("http://localhost:5000/api/get_created_post", {
                // params: { userID: "data.mining.project.iitg@gmail.com", type: type },
                params: { userID: mail, type: type },
            })
            .then((res) => {
                console.log("res -> ", res.data.all_post)
                setPosts(res.data.all_post)
            })
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        if (user !== null) {


            get_user_post(user.email, "created")
        }
    }, [user]);

    // const uploadFileToFlask = async (file) => {
    //     const formData = new FormData();
    //     formData.append('file', file);

    //     try {
    //         const response = await fetch('http://localhost:5000/api/upload', {
    //             method: 'POST',
    //             body: formData,
    //         });

    //         if (!response.ok) {
    //             throw new Error('Upload failed');
    //         }

    //         const data = await response.json();
    //         console.log('Uploaded URL:', data.url);
    //         return data.url; // use this in your post object
    //     } catch (error) {
    //         console.error('Upload error:', error);
    //         return null;
    //     }
    // };

    const uploadFileToFlask = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("Uploaded URL:", response.data.url);
            console.log("Uploaded ID:", response.data.id);
            return [response.data.url, response.data.id];
        } catch (error) {
            console.error("Upload error:", error);
            return null;
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setImageFiles(files);

        const previews = files.map((file) => URL.createObjectURL(file));
        setImagesPreview(previews);
    };

    const handlePdfUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setPdfFile(file);
        }
    };

    const handleCreatePost = async () => {
        let fileIds = [];

        let pdfUrl = null;
        let pdfID = null;
        if (pdfFile) {
            const res = await uploadFileToFlask(pdfFile);
            if (res) {
                pdfID = res[1];
                pdfUrl = res[0];
                fileIds.push(pdfID);
            }
        }

        let imageUrls = [];
        let imgUrl = null;
        let img_id = null;
        for (const image of imageFiles) {
            imgUrl = null;
            img_id = null;
            const res = await uploadFileToFlask(image);
            if (res) {
                imageUrls.push(res[0]);
                fileIds.push(res[1]);
            }
        }

        const newPost = {
            id: Date.now().toString() + user.email,
            title,
            hashtags,
            date: new Date().toISOString(),
            fileIds: fileIds,
            pdfUrl: pdfUrl,
            imageUrls: imageUrls,
            userID: user.email,
            summary: null,
        };
        console.log("Creating Post", newPost);
        setShowModal(false);
        // ! making a call to create a post
        axios
            .post("http://localhost:5000/api/createPost", newPost)
            .then((res) => {
                console.log("res : createPost ", res);
            })
            .catch((errr) => {
                console.log(errr);
            });

        // ! Fetch All Post
        get_user_post(user.email, "created")

        // Clear and close

        setTitle("");
        setHashtags("");
        setPdfFile(null);
        setImageFiles([]);
        setImagesPreview([]);
    };

    const handleDelete = (id, hashtags) => {
        console.log(id)
        axios.post(basePath+"/api/delete", { id: id, hashtags })
        

            .then(res => {
                console.log("deleting", res)


            }).then(
                get_user_post(user.email ,  "created")
            )
            .catch(err => {
                console.log(err)
            })
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Your Posts</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                >
                    + New Post
                </button>
            </div>

            {posts.length === 0 ? (
                <p className="text-gray-400">No posts created yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-gray-800 p-4 rounded-lg shadow-lg relative"
                        >
                            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                            <p className="text-sm text-gray-400">{post.hashtags}</p>
                            <p className="text-xs text-gray-500 mb-4">
                                {new Date(post.date).toLocaleString()}
                            </p>

                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => setActiveText(post.summary)}
                                    className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 text-sm disabled:opacity-50"
                                    disabled={!post.summary}
                                >
                                    View Text
                                </button>
                                <button
                                    onClick={() => window.open(post.pdfUrl, "_blank")}
                                    disabled={!post.pdfUrl
                                    }
                                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm disabled:opacity-50"
                                >
                                    View PDF
                                </button>
                                <button
                                    onClick={() => setImagesPreview(post.imageUrls || [])}
                                    disabled={!post.imageUrls || post.imageUrls.length === 0}
                                    className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm disabled:opacity-50"
                                >
                                    View Images
                                </button>
                                <button
                                    onClick={() => handleDelete(post.id, post.hashtags)}
                                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for New Post */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white text-black p-6 rounded-lg w-full max-w-lg">
                        <h2 className="text-xl font-semibold mb-4">Create Post</h2>

                        <label className="block text-sm mb-1">Title</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 mb-4 border rounded bg-gray-100"
                        />

                        <label className="block text-sm mb-1">Hashtags</label>
                        <input
                            value={hashtags}
                            onChange={(e) => setHashtags(e.target.value)}
                            className="w-full p-2 mb-4 border rounded bg-gray-100"
                        />

                        <label className="block text-sm mb-1">PDF (optional)</label>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handlePdfUpload}
                            className="w-full p-2 mb-4 border rounded bg-gray-100"
                        />

                        <label className="block text-sm mb-1">Images (optional)</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full p-2 mb-4 border rounded bg-gray-100"
                        />

                        {imagesPreview?.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {imagesPreview.map((src, idx) => (
                                    <img
                                        key={idx}
                                        src={src}
                                        alt="preview"
                                        className="rounded border object-cover h-20"
                                    />
                                ))}
                            </div>
                        )}

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreatePost}
                                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/*  */}
            {activeText && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-white text-black p-6 max-w-2xl w-full rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Summary</h2>
                        <pre className="whitespace-pre-wrap text-sm max-h-[400px] overflow-y-auto">{activeText}</pre>
                        <button
                            onClick={() => setActiveText(null)}
                            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            {/* Modal for viewing images */}
            {imagesPreview &&
                imagesPreview.length > 0 &&
                typeof imagesPreview[0] === "string" && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                        <div className="bg-white text-black p-6 rounded-lg max-w-4xl w-full">
                            <h2 className="text-lg font-semibold mb-4">Images</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
                                {imagesPreview.map((img, i) => (
                                    <img
                                        key={i}
                                        src={img}
                                        alt={`img-${i}`}
                                        className="rounded border"
                                    />
                                ))}
                            </div>
                            <button
                                onClick={() => setImagesPreview(null)}
                                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
        </div>
    );
}
