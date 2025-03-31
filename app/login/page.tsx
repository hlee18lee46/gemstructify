"use client";
import { useRouter } from "next/navigation"; // ✅ Make sure this is here

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function LoginPage() {
    const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("https://2110-70-126-30-23.ngrok-free.app/token", new URLSearchParams({
        username,
        password
      }));
      setMessage("✅ Login successful! Redirecting...");
      localStorage.setItem("access_token", res.data.access_token);
      setTimeout(() => router.push("/landing"), 1500);
    } catch (err: any) {
      setMessage("❌ Login failed: " + (err?.response?.data?.detail || "Unknown error"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
      <motion.div
        className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md space-y-4"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-center text-indigo-600">Login</h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
        >
          Log In
        </button>
        <p className="text-sm text-center mt-2">{message}</p>
      </motion.div>
    </div>
  );
}
