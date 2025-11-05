"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center 
                 bg-linear-to-br from-[#000000] via-[#200053] to-[#000000]
                 text-white"
    >
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-xl bg-white/10 border border-white/20
                   p-8 rounded-2xl shadow-2xl w-96 transition-transform
                   duration-300 hover:scale-[1.02]"
      >
        <h1
          className="text-3xl font-bold mb-6 text-center 
                     bg-linear-to-r from-purple-300 to-violet-500 bg-clip-text text-transparent"
        >
          Admin Login
        </h1>

        <div className="flex flex-col">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full mb-4 p-3 rounded-md border border-white/30 
                       bg-white/10 text-white placeholder-gray-300
                       focus:outline-none focus:ring-2 focus:ring-violet-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full mb-4 p-3 rounded-md border border-white/30 
                       bg-white/10 text-white placeholder-gray-300
                       focus:outline-none focus:ring-2 focus:ring-violet-400"
          />

          {error && (
            <p className="text-red-400 mb-3 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-md font-semibold
                       bg-linear-to-r from-violet-600 to-purple-500
                       hover:from-purple-700 hover:to-violet-600
                       transition-all duration-300"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
