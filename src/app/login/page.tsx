"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Mail, ArrowRight, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();
  const isConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project") &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("dummy");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!isConfigured) {
      setErrorMsg(
        "Supabase belum dikonfigurasi. Silakan isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di file .env.local atau dashboard Vercel."
      );
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username || email.split("@")[0],
            },
          },
        });
        if (error) throw error;
        setSuccessMsg("Pendaftaran berhasil! Silakan cek email Anda untuk konfirmasi.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/profile");
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat masuk.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12">
      <div className="rounded-3xl bg-[#131b2a] border border-[#1e2c40] p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#38bdf8] flex items-center justify-center text-white mx-auto shadow-lg shadow-[#6366f1]/20">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#f1f5f9]">
            {isSignUp ? "Buat Akun Baru" : "Masuk ke Akun Anda"}
          </h1>
          <p className="text-xs text-[#94a3b8]">
            Simpan bookmark anime dan riwayat tontonan Anda di semua perangkat
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-xl bg-[#0d1422] border border-[#1e2c40]">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              !isSignUp ? "bg-[#1e293b] text-[#38bdf8] shadow" : "text-[#94a3b8] hover:text-[#f1f5f9]"
            }`}
          >
            Masuk (Sign In)
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              isSignUp ? "bg-[#1e293b] text-[#38bdf8] shadow" : "text-[#94a3b8] hover:text-[#f1f5f9]"
            }`}
          >
            Daftar (Sign Up)
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#cbd5e1]">Nama Pengguna (Username)</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#64748b] absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="anime_lover99"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0d1422] border border-[#1e2c40] text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#6366f1]"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#cbd5e1]">Alamat Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#64748b] absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0d1422] border border-[#1e2c40] text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#6366f1]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#cbd5e1]">Kata Sandi (Password)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#64748b] absolute left-3.5 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0d1422] border border-[#1e2c40] text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#6366f1]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-semibold text-sm shadow-lg shadow-[#6366f1]/30 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            <span>{isLoading ? "Memproses..." : isSignUp ? "Buat Akun Sekarang" : "Masuk"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
