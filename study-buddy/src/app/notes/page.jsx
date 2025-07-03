'use client';

import { useEffect, useState } from 'react';
import { basePath } from '../config';
import axios from 'axios';
import { UserAuth } from '../context/AuthContext';

export default function AllPostsPage() {
  const [posts, setPosts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeText, setActiveText] = useState(null);
  const [activeImages, setActiveImages] = useState([]);
  const {user} = UserAuth();
  // Fetch all posts
  // useEffect(() => {
  //   fetch('http://localhost:5000/all-posts') // replace with your actual API
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setPosts(data);
  //       setFiltered(data);
  //     });
  // }, []);

  const getAllPost = async (hash) => {
    
    axios.post(basePath + "/api/allPost", {
      HASH : hash,
      
    })
      .then(res => {
        console.log("all post res", res.data.data)
        setPosts(res.data.data)
        setFiltered(res.data.data)
      })
      .catch(err => {
        console.log("errr", err)
      })
  }

  useEffect(() => {
    getAllPost("__all__")
    
  
    
  }, [])
    const handleSearch = () => {
    const search = searchTerm.toLowerCase();
    const result = posts.filter(
      (p) =>
        p.title?.toLowerCase().includes(search) ||
        p.hashtags?.toLowerCase().includes(search) ||
        p.summary?.toLowerCase().includes(search)
    );
    setFiltered(result);
  };

  const savePost = async (userID, postID) => {
    const params = {
      "userID": userID,
      "postID": postID
    }
    axios.post(basePath+"/api/savePost", params)
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }
  const handleSave = (post) => {
    console.log(post.id , user.email)
    savePost(user.email , post.id)
    
  };

  return (
    <div className="min-h-screen bg-[#0e1628] text-white p-6">
      <h1 className="text-3xl font-bold mb-4">All Posts</h1>

      {/* Search Bar */}
      <div className="flex gap-4 mb-6">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search posts by title, hashtags or summary..."
          className="flex-1 px-4 py-2 rounded bg-gray-800 border border-gray-700"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-400 text-lg">No posts available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((post, index) => (
            <div
              key={index}
              className="bg-[#19253e] p-4 rounded-lg shadow-md space-y-3"
            >
              <h2 className="text-lg font-semibold">{post.title}</h2>
              <p className="text-sm text-gray-300">{post.hashtags}</p>
              <p className="text-xs text-gray-500">
                {new Date(post.date).toLocaleString()}
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={() => setActiveText(post.summary)}
                  disabled={!post.summary}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm disabled:opacity-50"
                >
                  View Text
                </button>

                <button
                  onClick={() => window.open(post.pdfUrl, '_blank')}
                  disabled={!post.pdfUrl}
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm disabled:opacity-50"
                >
                  View PDF
                </button>

                <button
                  onClick={() => setActiveImages(post.imageUrls || [])}
                  disabled={!post.imageUrls || post.imageUrls.length === 0}
                  className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm disabled:opacity-50"
                >
                  View Images
                </button>

                <button
                  onClick={() => handleSave(post)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                >
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Text Modal */}
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

      {/* Images Modal */}
      {activeImages && activeImages.length > 0 && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-lg max-w-4xl w-full">
            <h2 className="text-lg font-semibold mb-4">Images</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
              {activeImages.map((img, i) => (
                <img key={i} src={img} alt={`img-${i}`} className="rounded border" />
              ))}
            </div>
            <button
              onClick={() => setActiveImages([])}
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