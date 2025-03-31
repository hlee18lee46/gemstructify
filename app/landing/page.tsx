"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

type TokenPayload = {
  sub: string;
  exp: number;
};

export default function LandingPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    console.log("Access token:", token);

    if (!token) {
      console.warn("No token found, redirecting to login...");
      router.push("/login");
      return;
    }

    try {
        const decoded: TokenPayload = jwtDecode(token);
        console.log("Decoded token:", decoded);

      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        console.warn("Token expired. Redirecting...");
        localStorage.removeItem("access_token");
        router.push("/login");
        return;
      }

      setUsername(decoded.sub);
    } catch (err) {
      console.error("Failed to decode token:", err);
      router.push("/login");
    }
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-6">
      <h1 className="text-4xl font-bold mb-4">🎉 Welcome, {username}!</h1>
      <p className="text-lg">You’ve successfully logged in to your account.</p>
    </main>
  );
}
