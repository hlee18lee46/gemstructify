"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";

type TokenPayload = {
  sub: string;
  exp: number;
};

export default function LandingPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded: TokenPayload = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem("access_token");
        router.push("/login");
        return;
      }
      setUsername(decoded.sub);
    } catch (err) {
      router.push("/login");
    }
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) return alert("Please upload an image.");
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("https://2110-70-126-30-23.ngrok-free.app/analyze_image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const clean = data.analysis.trim().replace(/```json|```/g, "");
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (err) {
      setResult({ error: "Failed to analyze image." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-6 flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">🎉 Welcome, {username}!</h1>
        <p className="text-lg mt-2">Upload a photo for analysis below.</p>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file:bg-purple-600 file:text-white file:rounded file:px-4 file:py-2 file:border-none"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl shadow transition disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze Image"}
        </button>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full bg-white text-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-4 text-purple-800">📊 Analysis Result</h3>
              {result.error ? (
                <p className="text-red-600">{result.error}</p>
              ) : (
                <div className="space-y-4">
                  <Category title="🏗️ Structural Components" items={result.structural_components} />
                  <Category title="🧱 Building Materials" items={result.building_materials} />
                  <Category title="🧰 Construction Equipment" items={result.construction_equipment} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function Category({ title, items }: { title: string; items: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h4 className="text-lg font-bold text-indigo-700">{title}</h4>
      {items && items.length > 0 ? (
        <ul className="list-disc list-inside pl-2 text-sm text-gray-700">
          {items.map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {item}
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No items found.</p>
      )}
    </motion.div>
  );
}
