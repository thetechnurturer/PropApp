"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 justify-center">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg"
          style={{ background: "#c9622f" }}
        >
          P
        </div>
        <span className="text-xl font-semibold text-gray-800">PropApp</span>
      </div>

      {/* Card */}
      <div
        className="bg-white rounded-2xl p-8 shadow-sm"
        style={{ border: "1px solid #e4dfd2" }}
      >
        <h1 className="text-xl font-semibold text-gray-800 mb-1">Sign in</h1>
        <p className="text-sm text-gray-500 mb-6">Welcome back to PropApp</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@company.com"
              className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none transition-colors"
              style={{ borderColor: "#e4dfd2", background: "#faf9f6" }}
              onFocus={(e) => (e.target.style.borderColor = "#c9622f")}
              onBlur={(e) => (e.target.style.borderColor = "#e4dfd2")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none transition-colors"
              style={{ borderColor: "#e4dfd2", background: "#faf9f6" }}
              onFocus={(e) => (e.target.style.borderColor = "#c9622f")}
              onBlur={(e) => (e.target.style.borderColor = "#e4dfd2")}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition-opacity disabled:opacity-60 mt-1"
            style={{ background: "#c9622f" }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-gray-500 mt-5">
        Need an account?{" "}
        <Link
          href="/register"
          className="font-medium"
          style={{ color: "#c9622f" }}
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
