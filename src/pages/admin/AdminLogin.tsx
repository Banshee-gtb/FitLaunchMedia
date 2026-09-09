import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Shield } from "lucide-react";
import { verifyPasscode, setAdminSession } from "@/lib/adminAuth";
import { FitLaunchMark } from "@/components/features/Logo";

export default function AdminLogin() {
  const [passcode, setPasscode] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (verifyPasscode(passcode)) {
        setAdminSession();
        navigate("/admin/dashboard", { replace: true });
      } else {
        setError("Incorrect passcode. Please try again.");
        setPasscode("");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center relative">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(0,245,160,0.04) 0%, transparent 70%)" }} />

      <div className="w-full max-w-md px-6 relative z-10">
        <div className="glass-panel rounded-3xl p-10">
          <div className="text-center mb-10">
            <FitLaunchMark size="lg" className="mx-auto mb-4" />
            <h1 className="font-display font-black text-lg text-off-white tracking-widest uppercase mb-1">ADMIN ACCESS</h1>
            <p className="text-muted-slate text-xs">FitLaunch Media CMS</p>
          </div>

          <div className="flex items-center gap-2 justify-center mb-8">
            <Shield className="w-3.5 h-3.5 text-mint" />
            <span className="text-[10px] font-display font-bold tracking-wider text-muted-slate uppercase">Secured area</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="section-label text-[10px] block mb-2" htmlFor="passcode">ADMIN PASSCODE</label>
              <div className="relative">
                <input
                  id="passcode"
                  type={show ? "text" : "password"}
                  value={passcode}
                  onChange={e => setPasscode(e.target.value)}
                  placeholder="Enter passcode"
                  className="w-full bg-elevated border border-white/8 rounded-xl px-4 py-3.5 text-off-white text-sm placeholder-muted-slate/40 focus:border-mint/30 focus:outline-none transition-colors pr-12"
                  autoComplete="current-password"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-slate hover:text-off-white transition-colors"
                  aria-label={show ? "Hide passcode" : "Show passcode"}
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && <p className="text-red-400 text-xs mt-2 font-body">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading || !passcode}
              className="btn-primary w-full justify-center py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "VERIFYING..." : "ACCESS ADMIN"}
            </button>
          </form>

          <p className="text-center text-muted-slate/40 text-xs mt-8 font-body">
            Authorised access only. All activity is logged.
          </p>
        </div>
      </div>
    </div>
  );
}
