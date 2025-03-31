"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-500 to-emerald-600 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="mb-6">
          <Image
            src="/logo.png" // 🧠 place logo in /public folder
            alt="Gemstructify Logo"
            width={120}
            height={120}
            className="mx-auto"
          />
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-2">Welcome to Gemstructify</h1>
        <p className="text-lg text-white mb-8">Your AI-powered construction analysis assistant</p>

        <div className="space-x-4">
          <button
            onClick={() => router.push("/login")}
            className="bg-white text-emerald-600 font-bold py-2 px-6 rounded-xl shadow hover:bg-gray-100 transition"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/register")}
            className="bg-emerald-800 text-white font-bold py-2 px-6 rounded-xl shadow hover:bg-emerald-900 transition"
          >
            Create Account
          </button>
        </div>
      </motion.div>
    </main>
  );
}
