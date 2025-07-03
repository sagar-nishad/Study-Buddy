"use client"
import { UserAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user, logOut } = UserAuth();
  const router = useRouter();

  const features = [
    {
      title: "YouTube Summary",
      description: "Summarize YouTube videos instantly using AI.",
      route: "/youtube_summary",
      color: "bg-red-900",
    },
    {
      title: "Search Notes",
      description: "Find and retrieve your study notes quickly.",
      route: "/notes",
      color: "bg-blue-900",
    },
    {
      title: "Chat With PDF",
      description: "Interact with any PDF file using chat AI.",
      route: "/chat-pdf",
      color: "bg-green-900",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">
          Welcome, {user?.displayName || "User"}!
        </h1>
        
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            onClick={() => router.push(feature.route)}
            className={`cursor-pointer p-6 rounded-xl shadow-md hover:scale-105 transform transition-all duration-300 ${feature.color}`}
          >
            <h2 className="text-2xl font-bold mb-2">{feature.title}</h2>
            <p className="text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
