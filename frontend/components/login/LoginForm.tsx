"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  UserCircle2,
  Lock,
  Eye,
  EyeOff,
  Building2,
  Phone,
  Mail,
} from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [ntid, setNtid] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!ntid.trim() || !password.trim()) {
      setError("Please enter your NTID and password.");
      return;
    }

    // TODO: replace with a real authentication call.
    // On success, send the user straight to the dashboard.
    setError("");
    router.push("/dashboard");
  }

  return (
    <div className="w-full max-w-sm bg-white rounded-card shadow-card border border-gray-100 p-6 sm:p-8">
      <div className="flex flex-col items-center text-center mb-6">
        <span className="w-14 h-14 rounded-full bg-emerald-50 text-primary flex items-center justify-center mb-3">
          <UserCircle2 size={30} />
        </span>
        <h2 className="text-lg font-bold text-brand-dark">Welcome Back!</h2>
        <p className="text-xs text-brand-gray mt-1">
          Sign in to access your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-brand-dark mb-1.5">
            Enter your NTID
          </label>
          <div className="relative">
            <UserCircle2
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={ntid}
              onChange={(e) => setNtid(e.target.value)}
              placeholder="Enter your NTID"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 text-sm pl-9 pr-3 py-2.5 outline-none focus:border-primary focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-brand-dark">
              Password
            </label>
            <a href="#" className="text-xs text-primary hover:underline">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 text-sm pl-9 pr-9 py-2.5 outline-none focus:border-primary focus:bg-white transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-gray"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs text-brand-gray">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          Remember me
        </label>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg py-2.5 transition-colors"
        >
          <Lock size={15} />
          SIGN IN
        </button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <div className="h-px bg-gray-100 flex-1" />
        <span className="text-[11px] text-brand-gray">OR</span>
        <div className="h-px bg-gray-100 flex-1" />
      </div>

      <button
        onClick={() => router.push("/dashboard")}
        className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-brand-dark text-sm font-medium rounded-lg py-2.5 transition-colors"
      >
        <Building2 size={16} />
        Sign in with Corporate Account (SSO)
      </button>

      <div className="mt-6 pt-5 border-t border-gray-100">
        <p className="text-xs font-medium text-brand-dark mb-2">
          Need help logging in?
        </p>
        <p className="text-xs text-brand-gray mb-1.5">
          Contact Castrol Customer Care
        </p>
        <div className="space-y-1.5">
          <a
            href="tel:18002091100"
            className="flex items-center gap-2 text-xs text-brand-gray hover:text-primary"
          >
            <Phone size={14} />
            1800 209 1100 (Toll Free)
          </a>
          <a
            href="mailto:customercare.india@castrol.com"
            className="flex items-center gap-2 text-xs text-brand-gray hover:text-primary"
          >
            <Mail size={14} />
            customercare.india@castrol.com
          </a>
        </div>
      </div>
    </div>
  );
}
