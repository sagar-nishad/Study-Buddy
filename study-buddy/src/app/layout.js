"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { AuthContextProvider , UserAuth } from "./context/AuthContext";
import { usePathname , useRouter } from "next/navigation";
import { useEffect } from "react";
import { basePath } from "./config";
import axios from "axios";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metadata = {
  title: " Study-Buddy",
  description: "A tool for resource sharing ",
};

export default function RootLayout({ children }) {
  // const {user } = UserAuth() ; 
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <AuthContextProvider>

        <AuthGate>
        

        {children}
        </AuthGate>
        </AuthContextProvider>
      </body>
    </html>
  );
}

function AuthGate({ children }) {
  const { user, initializing } = UserAuth();
  const pathname = usePathname();
  const router = useRouter();

  const createUser = async (userName, userId) => {
    axios.post(basePath + "/api/createUser", {
      name: userName,
      id: userId
    })
    .then(res => console.log("res", res))
    .catch(err => console.log("errr", err));
  };

  useEffect(() => {
    if (initializing) return; // 🚫 wait until Firebase is ready

    if (user) {
      createUser(user.displayName, user.email);
      if (pathname === "/login") {
        router.push("/");
      }
    } else {
      if (pathname !== "/login") {
        router.push("/login");
      }
    }
  }, [user, initializing, pathname]);

  // ⏳ Don't render anything while waiting for auth
  if (initializing) return null;

  return (
    <>
      {user ? <Navbar /> : null}
      {children}
    </>
  );
}
