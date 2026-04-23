"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export default function SignUpPage() {
  const router = useRouter();
  const { data: session } = useSession();
  useEffect(() => { if (session) router.replace("/"); }, [session, router]);
  const [form,     setForm]     = useState({ username: "", email: "", password: "", confirm: "" });
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!form.username || !form.email || !form.password) { setError("Please fill in all fields."); return; }
    if (form.password !== form.confirm) { setError("Passwords don't match!"); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }

    setLoading(true);
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: form.username, email: form.email, password: form.password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(typeof data.error === "string" ? data.error : "Something went wrong. Try again!");
      return;
    }

    // Auto sign in after registration
    await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    router.push("/");
  };

  const handleSocial = (provider: string) => signIn(provider, { callbackUrl: "/" });

  return (
    <div style={{ fontFamily: "'Special Elite',serif", background: "#f0e6c8", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,900&family=Special+Elite&family=Permanent+Marker&family=Anton&family=Barlow+Condensed:wght@400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .newsprint { background-color: #f0e6c8; background-image: repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(0,0,0,0.04) 28px); }
        .halftone  { background-image: radial-gradient(circle, #11111120 1px, transparent 1px); background-size: 7px 7px; }
        .spidey    { font-family: 'Anton', sans-serif; font-style: italic; transform: skewX(-6deg); display: inline-block; letter-spacing: 1px; }
        .spidey-lg { font-family: 'Anton', sans-serif; font-style: italic; transform: skewX(-8deg); display: inline-block; -webkit-text-stroke: 2px #111; text-shadow: 4px 4px 0 #111, 7px 7px 0 rgba(0,0,0,0.12); letter-spacing: 2px; line-height: 0.88; }
        .panel     { border: 4px solid #111; box-shadow: 8px 8px 0 #111; background: white; position: relative; overflow: hidden; }
        .starburst { clip-path: polygon(50% 0%,56% 18%,73% 5%,65% 22%,85% 18%,73% 32%,95% 35%,78% 43%,95% 55%,76% 57%,88% 74%,70% 70%,72% 90%,58% 80%,50% 100%,42% 80%,28% 90%,30% 70%,12% 74%,24% 57%,5% 55%,22% 43%,5% 35%,27% 32%,15% 18%,35% 22%,27% 5%,44% 18%); }
        .snap-input { width: 100%; border: 3px solid #111; background: #fdf8ec; font-family: 'Special Elite', serif; font-size: 1rem; padding: 11px 14px; outline: none; box-shadow: 3px 3px 0 #111; transition: box-shadow 0.1s, transform 0.1s; color: #111; }
        .snap-input:focus { box-shadow: 5px 5px 0 #8B2035; transform: translate(-1px,-1px); }
        .snap-input::placeholder { color: #aaa; }
        .snap-label { font-family: 'Anton', sans-serif; font-style: italic; font-size: 0.9rem; letter-spacing: 2px; color: #111; margin-bottom: 6px; display: block; transform: skewX(-4deg); }
        .btn { font-family: 'Anton', sans-serif; font-style: italic; letter-spacing: 2px; border: 3px solid #111; cursor: pointer; text-transform: uppercase; transition: transform 0.1s, box-shadow 0.1s; }
        .btn:hover { transform: translate(-2px,-2px); }
        .btn:active { transform: translate(2px,2px); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .btn-social { width: 100%; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 1rem; letter-spacing: 1px; border: 3px solid #111; box-shadow: 4px 4px 0 #111; cursor: pointer; padding: 11px 16px; transition: transform 0.1s, box-shadow 0.1s; display: flex; align-items: center; gap: 10px; text-transform: uppercase; }
        .btn-social:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 #111; }
        .nav-item { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 1rem; letter-spacing: 2px; color: #C8952A; cursor: pointer; text-transform: uppercase; transition: color 0.1s; text-decoration: none; }
        .nav-item:hover { color: white; }
        .error-box { background: #fff0f0; border: 3px solid #8B2035; padding: 10px 14px; box-shadow: 3px 3px 0 #8B2035; font-family: 'Special Elite', serif; font-size: 0.9rem; color: #8B2035; }
        @keyframes bob { 0%,100%{transform:translateY(0) rotate(-1.5deg);} 50%{transform:translateY(-7px) rotate(1.5deg);} }
        @keyframes popIn { 0%{transform:scale(0.85) rotate(-3deg);opacity:0;} 70%{transform:scale(1.05);} 100%{transform:scale(1);opacity:1;} }
        @keyframes pulse { 0%,100%{box-shadow:5px 5px 0 #111,0 0 0 0 rgba(139,32,53,0.4);} 50%{box-shadow:5px 5px 0 #111,0 0 0 10px rgba(139,32,53,0);} }
        .bob    { animation: bob 3.5s ease-in-out infinite; }
        .pop-in { animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .pulse  { animation: pulse 2s infinite; }
      `}</style>

      <Navbar />

      {/* MASTHEAD */}
      <div style={{ borderBottom: "5px solid #111" }}>
        <div style={{ background: "#111", padding: "5px 32px", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'Special Elite',serif", color: "#C8952A", fontSize: "0.7rem", letterSpacing: 2 }}>EST. 2025 · MARVEL SNAP'S PREMIER CLIP COMMUNITY</span>
          <span style={{ fontFamily: "'Special Elite',serif", color: "#888", fontSize: "0.7rem" }}>COLLECTOR'S SPECIAL EDITION · ISSUE #001</span>
          <span style={{ fontFamily: "'Special Elite',serif", color: "#C8952A", fontSize: "0.7rem", letterSpacing: 2 }}>FREE · SNAPFURY.COM</span>
        </div>
        <div style={{ padding: "10px 32px 8px", textAlign: "center", background: "white", borderBottom: "3px solid #111", position: "relative" }}>
          <svg style={{ position: "absolute", top: 0, left: 0, opacity: 0.07 }} width="60" height="60" viewBox="0 0 80 80"><path d="M0,0 Q40,40 0,80 M0,0 Q80,40 80,0 M0,0 L80,80 M0,40 Q40,40 80,40 M40,0 Q40,40 40,80" stroke="#111" strokeWidth="1.5" fill="none" /></svg>
          <svg style={{ position: "absolute", top: 0, right: 0, opacity: 0.07, transform: "scaleX(-1)" }} width="60" height="60" viewBox="0 0 80 80"><path d="M0,0 Q40,40 0,80 M0,0 Q80,40 80,0 M0,0 L80,80 M0,40 Q40,40 80,40 M40,0 Q40,40 40,80" stroke="#111" strokeWidth="1.5" fill="none" /></svg>
          <div className="spidey-lg" style={{ fontSize: "clamp(2rem,5vw,4rem)", color: "#C8952A", display: "block" }}>SNAP FURY</div>
          <div style={{ height: 5, background: "linear-gradient(#111 2px,transparent 2px,transparent 3px,#111 3px)", maxWidth: 400, margin: "5px auto" }} />
          <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.75rem", letterSpacing: 3, color: "#555" }}>"JOIN THE FURY TODAY" · ALL THE SNAPS FIT TO PRINT</div>
        </div>
        <div style={{ background: "#8B2035", padding: "7px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "3px solid #111" }}>
          <span className="spidey" style={{ color: "white", fontSize: "0.95rem" }}>NEW RECRUIT ENROLLMENT NOW OPEN</span>
          <span style={{ fontFamily: "'Special Elite',serif", color: "rgba(255,255,255,0.8)", fontSize: "0.75rem", letterSpacing: 2 }}>★ COLLECTOR'S SPECIAL EDITION ★</span>
          <span className="spidey" style={{ color: "#C8952A", fontSize: "0.95rem" }}>ISSUE #001 · LIMITED PRINT</span>
        </div>
      </div>

      {/* MAIN */}
      <div className="newsprint" style={{ flex: 1, padding: "40px 24px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 980, display: "grid", gridTemplateColumns: "1fr 400px", gap: 32, alignItems: "start" }}>

          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="panel pop-in" style={{ background: "#8B2035", transform: "rotate(-1deg)" }}>
              <div className="halftone" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />
              <div style={{ background: "#C8952A", borderBottom: "4px solid #111", padding: "7px 16px", display: "flex", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
                <span className="spidey" style={{ color: "#111", fontSize: "0.95rem" }}>NEW RECRUIT BRIEFING</span>
                <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.75rem", color: "#111" }}>PANEL #1</span>
              </div>
              <div style={{ padding: "28px 24px", position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                <img src="/logo.jpg" alt="SnapFury" className="bob"
                  style={{ width: 160, height: 160, borderRadius: "50%", objectFit: "cover", border: "5px solid #C8952A", boxShadow: "8px 8px 0 #111", outline: "3px solid #111", outlineOffset: 5 }} />
                <div style={{ textAlign: "center" }}>
                  <div className="spidey-lg" style={{ fontSize: "3.2rem", color: "#C8952A", display: "block" }}>JOIN THE</div>
                  <div className="spidey-lg" style={{ fontSize: "3.2rem", color: "white", display: "block" }}>FURY!</div>
                </div>
                <p style={{ fontFamily: "'Special Elite',serif", color: "rgba(255,255,255,0.85)", fontSize: "0.9rem", textAlign: "center", lineHeight: 1.7, maxWidth: 260 }}>
                  Upload your snaps. Build your reputation. Become a legend in the Marvel Snap community.
                </p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { label: "COMMUNITY SNAPPERS", val: "2,400+", tag: "WOW!", tc: "#C8952A", rot: "-1.5deg" },
                { label: "CLIPS UPLOADED",     val: "10,000+", tag: "POW!", tc: "#4A3DC8", rot: "1deg" },
              ].map(s => (
                <div key={s.label} className="panel" style={{ background: "#f8f0d8", transform: `rotate(${s.rot})`, padding: 16, textAlign: "center" }}>
                  <div className="starburst" style={{ width: 50, height: 50, background: s.tc, border: "2px solid #111", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                    <span style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", color: "#111", fontSize: "0.7rem" }}>{s.tag}</span>
                  </div>
                  <div className="spidey" style={{ color: "#4A3DC8", fontSize: "2rem" }}>{s.val}</div>
                  <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.7rem", letterSpacing: 2, color: "#666", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div className="panel" style={{ overflow: "hidden", transform: "rotate(0.5deg)" }}>
              <img src="/banner.jpg" alt="Banner" style={{ width: "100%", height: 130, objectFit: "cover", objectPosition: "center 20%", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(139,32,53,0.7) 0%,transparent 50%)", display: "flex", alignItems: "center", padding: "0 20px" }}>
                <div>
                  <div className="spidey" style={{ color: "#C8952A", fontSize: "1.4rem", display: "block" }}>YOUR SNAP STORY STARTS HERE.</div>
                  <div style={{ fontFamily: "'Special Elite',serif", color: "white", fontSize: "0.8rem", marginTop: 4 }}>Join thousands of Snappers today</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div>
            <div style={{ display: "flex", marginBottom: -4, position: "relative", zIndex: 5 }}>
              <Link href="/signin" style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", fontSize: "1.2rem", letterSpacing: 2, padding: "10px 28px", flex: 1, textAlign: "center", background: "#f0e6c8", color: "#555", border: "3px solid #111", borderRight: "none", borderBottom: "3px solid #111", textDecoration: "none", display: "block" }}>
                SIGN IN
              </Link>
              <div style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", fontSize: "1.2rem", letterSpacing: 2, padding: "10px 28px", flex: 1, textAlign: "center", background: "#8B2035", color: "white", border: "3px solid #111", borderBottom: "none", boxShadow: "4px 0 0 #111", transform: "translate(-2px,-2px)", zIndex: 2 }}>
                JOIN FURY
              </div>
            </div>

            <div className="panel" style={{ background: "white", position: "relative", zIndex: 3 }}>
              <div style={{ background: "#8B2035", borderBottom: "4px solid #111", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="spidey" style={{ color: "white", fontSize: "1.1rem" }}>★ NEW RECRUIT FORM ★</span>
                <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", letterSpacing: 2 }}>ISSUE #001</span>
              </div>

              <div style={{ padding: "24px" }}>
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <div className="spidey-lg" style={{ fontSize: "2.2rem", color: "#8B2035", display: "block" }}>JOIN THE FURY!</div>
                  <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.8rem", color: "#888", letterSpacing: 2, marginTop: 6 }}>Create your SnapFury identity</div>
                </div>

                {/* Social */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                  <button className="btn-social" style={{ background: "white", color: "#111" }} onClick={() => handleSocial("google")}>
                    <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                    Continue with Google
                  </button>
                  <button className="btn-social" style={{ background: "#5865F2", color: "white", borderColor: "#111" }} onClick={() => handleSocial("discord")}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.081.114 18.104.133 18.12a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" /></svg>
                    Continue with Discord
                  </button>
                  <button className="btn-social" style={{ background: "#9146FF", color: "white", borderColor: "#111" }} onClick={() => handleSocial("twitch")}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" /></svg>
                    Continue with Twitch
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "14px 0" }}>
                  <div style={{ flex: 1, height: 2, background: "repeating-linear-gradient(90deg,#333 0,#333 5px,transparent 5px,transparent 10px)" }} />
                  <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.85rem", color: "#888", letterSpacing: 2 }}>— OR —</span>
                  <div style={{ flex: 1, height: 2, background: "repeating-linear-gradient(90deg,#333 0,#333 5px,transparent 5px,transparent 10px)" }} />
                </div>

                {error && <div className="error-box" style={{ marginBottom: 14 }}>⚠️ {error}</div>}

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label className="snap-label">USERNAME</label>
                    <input className="snap-input" type="text" placeholder="e.g. FuryMSnap"
                      value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
                    <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.72rem", color: "#aaa", marginTop: 4 }}>Letters, numbers, underscores only</div>
                  </div>
                  <div>
                    <label className="snap-label">EMAIL ADDRESS</label>
                    <input className="snap-input" type="email" placeholder="you@snapfury.com"
                      value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div>
                    <label className="snap-label">PASSWORD</label>
                    <div style={{ position: "relative" }}>
                      <input className="snap-input" type={showPass ? "text" : "password"} placeholder="Min 8 characters"
                        value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                        style={{ paddingRight: 48 }} />
                      <button onClick={() => setShowPass(p => !p)}
                        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", color: "#888" }}>
                        {showPass ? "🙈" : "👁"}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="snap-label">CONFIRM PASSWORD</label>
                    <input className="snap-input" type="password" placeholder="••••••••"
                      value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                      onKeyDown={e => e.key === "Enter" && handleSubmit()} />
                  </div>
                </div>

                <button className="btn pulse" onClick={handleSubmit} disabled={loading}
                  style={{ width: "100%", marginTop: 20, background: "#8B2035", color: "white", padding: 14, fontSize: "1.5rem", boxShadow: "5px 5px 0 #111", borderRadius: 3 }}>
                  {loading ? "ENLISTING..." : "⚡ JOIN THE FURY"}
                </button>

                <div style={{ textAlign: "center", marginTop: 16, borderTop: "2px dashed #ddd", paddingTop: 14 }}>
                  <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.85rem", color: "#666" }}>Already a Snapper? </span>
                  <Link href="/signin" style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", color: "#4A3DC8", fontSize: "0.95rem", letterSpacing: 1, marginLeft: 4, textDecoration: "none" }}>
                    SIGN IN →
                  </Link>
                </div>
              </div>

              <div style={{ background: "#f8f0d8", borderTop: "3px solid #111", padding: "8px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.7rem", color: "#888", letterSpacing: 1 }}>SECURE · ENCRYPTED · FURY-APPROVED</span>
                <div className="starburst" style={{ width: 32, height: 32, background: "#C8952A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "'Anton',sans-serif", fontSize: "0.5rem", color: "#111", fontStyle: "italic" }}>SF</span>
                </div>
              </div>
            </div>

            <p style={{ fontFamily: "'Special Elite',serif", fontSize: "0.72rem", color: "#888", lineHeight: 1.6, textAlign: "center", marginTop: 12 }}>
              By joining, you agree to SnapFury's Terms of Service and Privacy Policy.<br />
              Not affiliated with Marvel Entertainment or Second Dinner.
            </p>
          </div>
        </div>
      </div>

      <div style={{ background: "#111", borderTop: "4px solid #C8952A", padding: "12px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo.jpg" alt="sf" style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid #C8952A", objectFit: "cover" }} />
          <span className="spidey" style={{ color: "#C8952A", fontSize: "1rem" }}>SNAP FURY</span>
        </div>
        <span style={{ fontFamily: "'Special Elite',serif", color: "#444", fontSize: "0.75rem" }}>© 2025 SnapFury · Not affiliated with Marvel or Second Dinner</span>
      </div>
    </div>
  );
}
