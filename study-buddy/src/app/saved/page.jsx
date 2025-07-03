'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { UserAuth } from '../context/AuthContext';

export default function SavedPage() {
  const [posts, setPosts] = useState([]);
  const [activeText, setActiveText] = useState(null);
  const [activeImages, setActiveImages] = useState(null);
  const { user } = UserAuth();
  const get_user_post = async (type) => {
        axios
            .get("http://localhost:5000/api/get_created_post", {
                params: { userID: user.email , type: type },
            })
            .then((res) => {
                console.log("res -> ", res.data.all_post)
                setPosts(res.data.all_post)
            })
            .catch((err) => console.error(err));
    };

  useEffect(() => {
    // const saved = JSON.parse(localStorage.getItem('savedSummaries') || '[]');
    // setPosts(saved);
    if (user != null){

      get_user_post("saved")
    }
    console.log(posts)
    
    
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Saved Posts</h1>

      {posts.length === 0 && (
        <p className="text-gray-400">No saved posts found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-sm text-gray-400 mb-2">{post.hashtags}</p>
            <p className="text-xs text-gray-500 mb-4">{new Date(post.date).toLocaleString()}</p>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveText(post.summary)}
                className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 text-sm disabled:opacity-50"
                disabled={!post.summary }
                // disabled={false}
              >
                View Text
              </button>

              <button
                onClick={() => window.open(post.pdfLink, '_blank')}
                className="px-3 py-1 bg-green-600 rounded hover:bg-green-700 text-sm disabled:opacity-50"
                disabled={!post.pdfUrl}
              >
                View PDF
              </button>

              <button
                onClick={() => setActiveImages(post.imageUrls || [])}
                className="px-3 py-1 bg-purple-600 rounded hover:bg-purple-700 text-sm disabled:opacity-50"
                disabled={!post.imageUrls || post.imageUrls.length === 0}
              >
                View Images
              </button>
            </div>
          </div>
        ))}
      </div>

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
      {activeImages && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-lg max-w-4xl w-full">
            <h2 className="text-lg font-semibold mb-4">Images</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
              {activeImages.map((img, i) => (
                <img key={i} src={img} alt={`img-${i}`} className="rounded border" />
              ))}
            </div>
            <button
              onClick={() => setActiveImages(null)}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
