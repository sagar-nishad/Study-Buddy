"use client"
import { UserAuth } from "../context/AuthContext";

export default function profile() {
  const { user, logOut } = UserAuth();

  return (
    <div className="h-screen flex items-center justify-center bg-green-900 text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">
          Welcome, {user?.displayName || "User"}!
        </h1>
        <button
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
          onClick={logOut}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
