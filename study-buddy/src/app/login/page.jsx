// pages/login.js
"use client"
import { UserAuth } from "../context/AuthContext";

export default function login() {
  const { googleSignIn } = UserAuth();

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-10 rounded shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
          onClick={googleSignIn}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
