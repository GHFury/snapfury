"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

const STEPS = [
  {
    number: "01",
    title: "DOWNLOAD & INSTALL",
    color: "#4A3DC8",
    content: "Download the ClipFury installer and run it. Windows may show a security prompt — click \"More info\" then \"Run anyway\". ClipFury will appear in your system tray when ready.",
  },
  {
    number: "02",
    title: "CALIBRATE YOUR SNAP BUTTON",
    color: "#C8952A",
    content: "Open Marvel Snap and go to Proving Grounds (free practice mode — snapping costs no cubes). Right-click the ClipFury tray icon → Settings → click \"Calibrate Snap Button\" → then click the Snap button in the game within 5 seconds.",
  },
  {
    number: "03",
    title: "CONNECT TO SNAPFURY (OPTIONAL)",
    color: "#8B2035",
    content: "In Settings → SnapFury tab, sign in with your SnapFury account. Enable \"Auto-upload\" to have every clip automatically posted to the community the moment you snap.",
  },
  {
    number: "04",
    title: "PLAY & SNAP",
    color: "#4A3DC8",
    content: "That's it. Play Marvel Snap normally. Every time you snap, ClipFury captures the moment automatically. Check your clips from the tray icon, upload to SnapFury, or save locally.",
  },
];

const REQUIREMENTS = [
  ["OS", "Windows 10 or later (64-bit)"],
  ["RAM", "4GB minimum, 8GB recommended"],
  ["Storage", "500MB for app + clips folder"],
  ["Game", "Marvel Snap (Steam)"],
  ["Other", "Run Marvel Snap in windowed mode"],
];

export default function DownloadPage() {
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
        .btn { font-family: 'Anton', sans-serif; font-style: italic; letter-spacing: 2px; border: 3px solid #111; cursor: pointer; text-transform: uppercase; transition: transform 0.1s, box-shadow 0.1s; text-decoration: none; display: inline-block; }
        .btn:hover { transform: translate(-2px,-2px); }
        @keyframes bob    { 0%,100%{transform:translateY(0) rotate(-1deg);} 50%{transform:translateY(-8px) rotate(1deg);} }
        @keyframes pulse  { 0%,100%{box-shadow:6px 6px 0 #111,0 0 0 0 rgba(200,149,42,0.5);} 50%{box-shadow:6px 6px 0 #111,0 0 0 12px rgba(200,149,42,0);} }
        @keyframes snapIn { 0%{transform:scale(0.85) rotate(-3deg);opacity:0;} 70%{transform:scale(1.05);} 100%{transform:scale(1);opacity:1;} }
        .bob     { animation: bob 3.5s ease-in-out infinite; }
        .pulse   { animation: pulse 2s infinite; }
        .snap-in { animation: snapIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .step-card { border: 4px solid #111; box-shadow: 7px 7px 0 #111; background: white; overflow: hidden; }
        .req-row { display: flex; gap: 0; border-bottom: 2px solid #eee; padding: 10px 16px; }
        .req-row:last-child { border-bottom: none; }
        .hrule-double { height: 7px; background: linear-gradient(#111 2px, transparent 2px, transparent 4px, #111 4px); }
      `}</style>

      <Navbar />

      {/* MASTHEAD */}
      <div style={{ borderBottom: "5px solid #111" }}>
        <div style={{ background: "#111", padding: "5px 32px", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'Special Elite',serif", color: "#C8952A", fontSize: "0.7rem", letterSpacing: 2 }}>EST. 2025 · MARVEL SNAP'S PREMIER CLIP COMMUNITY</span>
          <span style={{ fontFamily: "'Special Elite',serif", color: "#888", fontSize: "0.7rem" }}>COLLECTOR'S SPECIAL EDITION · ISSUE #001</span>
          <span style={{ fontFamily: "'Special Elite',serif", color: "#C8952A", fontSize: "0.7rem", letterSpacing: 2 }}>FREE · SNAPFURY.COM</span>
        </div>
        <div style={{ padding: "12px 32px 10px", textAlign: "center", background: "white", borderBottom: "3px solid #111", position: "relative" }}>
          <svg style={{ position: "absolute", top: 0, left: 0, opacity: 0.07 }} width="70" height="70" viewBox="0 0 80 80"><path d="M0,0 Q40,40 0,80 M0,0 Q80,40 80,0 M0,0 L80,80 M0,40 Q40,40 80,40 M40,0 Q40,40 40,80" stroke="#111" strokeWidth="1.5" fill="none" /></svg>
          <div className="spidey-lg" style={{ fontSize: "clamp(2rem,5vw,4rem)", color: "#C8952A", display: "block" }}>SNAP FURY</div>
          <div style={{ height: 5, background: "linear-gradient(#111 2px,transparent 2px,transparent 3px,#111 3px)", maxWidth: 400, margin: "5px auto" }} />
          <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.75rem", letterSpacing: 3, color: "#555" }}>"NEVER MISS A SNAP" · DOWNLOAD CLIPFURY</div>
        </div>
        <div style={{ background: "#8B2035", padding: "7px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "3px solid #111" }}>
          <span className="spidey" style={{ color: "white", fontSize: "0.9rem" }}>FREE DOWNLOAD · WINDOWS 10+</span>
          <span style={{ fontFamily: "'Special Elite',serif", color: "rgba(255,255,255,0.8)", fontSize: "0.75rem", letterSpacing: 2 }}>★ COLLECTOR'S SPECIAL EDITION ★</span>
          <span className="spidey" style={{ color: "#C8952A", fontSize: "0.9rem" }}>VERSION 0.1.0-BETA</span>
        </div>
      </div>

      <div className="newsprint" style={{ flex: 1, padding: "36px 28px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* HERO SECTION */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, marginBottom: 40, alignItems: "center" }}>
            <div>
              <div className="spidey-lg snap-in" style={{ fontSize: "clamp(3rem,6vw,5.5rem)", color: "#4A3DC8", display: "block", marginBottom: 8 }}>CLIPFURY</div>
              <div className="spidey-lg" style={{ fontSize: "clamp(1.5rem,3vw,2.5rem)", color: "#111", display: "block", marginBottom: 20 }}>AUTOMATIC SNAP CAPTURE</div>
              <p style={{ fontFamily: "'Special Elite',serif", fontSize: "1.1rem", color: "#444", lineHeight: 1.8, maxWidth: 520, marginBottom: 28 }}>
                ClipFury runs silently in your system tray while you play Marvel Snap. Every time you snap, it captures the moment automatically — no manual recording, no missed clips.
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
                {/* Download button — points to GitHub releases */}
                <a
                  href="https://github.com/GHFury/clipfury/releases/latest/download/ClipFury-Setup-0.1.0-beta.exe"
                  className="btn pulse"
                  style={{ background: "#C8952A", color: "#111", padding: "14px 36px", fontSize: "1.6rem", boxShadow: "6px 6px 0 #111", borderRadius: 3 }}
                >
                  ⬇ DOWNLOAD FOR WINDOWS
                </a>
                <div>
                  <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.8rem", color: "#888" }}>Version 0.1.0-beta · Free</div>
                  <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.8rem", color: "#888" }}>Windows 10 or later · 64-bit</div>
                </div>
              </div>

              {/* SmartScreen note */}
              <div style={{ marginTop: 14, padding: "10px 14px", border: "2px dashed #C8952A", background: "#fff8e6", maxWidth: 500 }}>
                <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.8rem", color: "#666", lineHeight: 1.6 }}>
                  <strong style={{ color: "#C8952A" }}>Windows SmartScreen notice:</strong> As a new app, Windows may show a security warning. Click <strong>"More info"</strong> then <strong>"Run anyway"</strong> to install.
                </span>
              </div>
            </div>

            {/* App preview panel */}
            <div className="panel bob" style={{ background: "#4A3DC8", transform: "rotate(1deg)" }}>
              <div className="halftone" style={{ position: "absolute", inset: 0, opacity: 0.25 }} />
              <div style={{ background: "#C8952A", borderBottom: "4px solid #111", padding: "7px 16px", display: "flex", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
                <span className="spidey" style={{ color: "#111", fontSize: "0.9rem" }}>CLIPFURY IN ACTION</span>
                <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.75rem", color: "#111" }}>v0.1.0-beta</span>
              </div>
              <div style={{ padding: "20px", position: "relative", zIndex: 2 }}>
                {["Snap detected — saving clip...", "Clip saved! (47MB)", "Uploading to SnapFury...", "Upload complete!"].map((msg, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                    <div className="starburst" style={{ width: 28, height: 28, background: i === 3 ? "#2a6e2a" : "#C8952A", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: "'Anton',sans-serif", color: "#111", fontSize: "0.6rem" }}>{i + 1}</span>
                    </div>
                    <span style={{ fontFamily: "'Special Elite',serif", color: "white", fontSize: "0.85rem" }}>{msg}</span>
                  </div>
                ))}
                <div style={{ marginTop: 16, padding: "10px 12px", border: "2px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.2)" }}>
                  <div style={{ fontFamily: "'Special Elite',serif", color: "#C8952A", fontSize: "0.75rem", letterSpacing: 2, marginBottom: 4 }}>CLIP SAVED TO</div>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", color: "white", fontSize: "0.85rem", fontWeight: 600 }}>Videos\ClipFury\ClipFury_2025-04-24.mp4</div>
                </div>
              </div>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="hrule-double" style={{ marginBottom: 32 }} />

          {/* SETUP STEPS */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <div style={{ background: "#111", border: "4px solid #C8952A", padding: "6px 20px", boxShadow: "4px 4px 0 #C8952A", transform: "rotate(-1deg)" }}>
                <span className="spidey" style={{ color: "#C8952A", fontSize: "1.6rem" }}>GETTING STARTED</span>
              </div>
              <div style={{ flex: 1, height: 3, background: "repeating-linear-gradient(90deg,#111 0,#111 8px,transparent 8px,transparent 16px)" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {STEPS.map((step, i) => (
                <div key={i} className="step-card" style={{ transform: `rotate(${i % 2 === 0 ? "-0.5deg" : "0.5deg"})` }}>
                  <div style={{ background: step.color, borderBottom: "4px solid #111", padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="spidey" style={{ color: i === 1 ? "#111" : "white", fontSize: "1rem" }}>{step.title}</span>
                    <div className="starburst" style={{ width: 36, height: 36, background: i === 1 ? "#111" : "#C8952A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", color: i === 1 ? "#C8952A" : "#111", fontSize: "0.85rem" }}>{step.number}</span>
                    </div>
                  </div>
                  <div style={{ padding: "16px" }}>
                    <p style={{ fontFamily: "'Special Elite',serif", fontSize: "0.9rem", color: "#444", lineHeight: 1.7 }}>{step.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DIVIDER */}
          <div className="hrule-double" style={{ marginBottom: 32 }} />

          {/* TWO COLUMN — requirements + features */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 40 }}>

            {/* System requirements */}
            <div className="panel" style={{ transform: "rotate(-0.5deg)" }}>
              <div style={{ background: "#4A3DC8", borderBottom: "4px solid #111", padding: "7px 16px" }}>
                <span className="spidey" style={{ color: "#C8952A", fontSize: "1rem" }}>SYSTEM REQUIREMENTS</span>
              </div>
              <div>
                {REQUIREMENTS.map(([label, value]) => (
                  <div key={label} className="req-row">
                    <div style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", fontSize: "0.85rem", color: "#4A3DC8", letterSpacing: 1, width: 80, flexShrink: 0 }}>{label}</div>
                    <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.85rem", color: "#444" }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="panel" style={{ transform: "rotate(0.5deg)" }}>
              <div style={{ background: "#8B2035", borderBottom: "4px solid #111", padding: "7px 16px" }}>
                <span className="spidey" style={{ color: "white", fontSize: "1rem" }}>WHAT YOU GET</span>
              </div>
              <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { icon: "⚡", text: "Automatic snap detection — no manual recording" },
                  { icon: "🎬", text: "Captures only the Marvel Snap window" },
                  { icon: "📁", text: "Saves clips to your Videos folder" },
                  { icon: "⬆", text: "One-click upload to SnapFury" },
                  { icon: "🔒", text: "OBS integration for power users" },
                  { icon: "🔕", text: "Runs silently in the system tray" },
                  { icon: "💾", text: "Save locally without uploading" },
                  { icon: "🆓", text: "Completely free" },
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{f.icon}</span>
                    <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.85rem", color: "#444", lineHeight: 1.5 }}>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM CTA */}
          <div className="hrule-double" />
          <div style={{ background: "#4A3DC8", border: "5px solid #111", boxShadow: "8px 8px 0 #111", padding: "32px 40px", margin: "20px 0", textAlign: "center", position: "relative", overflow: "hidden", transform: "rotate(-0.2deg)" }}>
            <div className="halftone" style={{ position: "absolute", inset: 0, opacity: 0.2 }} />
            <div style={{ position: "relative", zIndex: 2 }}>
              <div className="spidey-lg" style={{ fontSize: "clamp(2rem,4vw,3.5rem)", color: "#C8952A", display: "block", marginBottom: 12 }}>READY TO NEVER MISS A SNAP?</div>
              <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                <a
                  href="https://github.com/YOUR_GITHUB_USERNAME/clipfury/releases/latest/download/ClipFury-Setup-0.1.0-beta.exe"
                  className="btn"
                  style={{ background: "#C8952A", color: "#111", padding: "13px 36px", fontSize: "1.5rem", boxShadow: "5px 5px 0 #111", borderRadius: 3 }}
                >
                  ⬇ DOWNLOAD CLIPFURY FREE
                </a>
                <Link href="/signup" className="btn"
                  style={{ background: "white", color: "#111", padding: "13px 28px", fontSize: "1.3rem", boxShadow: "5px 5px 0 #111", borderRadius: 3 }}>
                  CREATE SNAPFURY ACCOUNT
                </Link>
              </div>
            </div>
          </div>
          <div className="hrule-double" />
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: "#111", borderTop: "4px solid #C8952A", padding: "12px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo.jpg" alt="sf" style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid #C8952A", objectFit: "cover" }} />
          <span className="spidey" style={{ color: "#C8952A", fontSize: "1rem" }}>SNAP FURY</span>
        </div>
        <span style={{ fontFamily: "'Special Elite',serif", color: "#444", fontSize: "0.75rem" }}>© 2025 SnapFury · Not affiliated with Marvel or Second Dinner</span>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span className="spidey" style={{ color: "#C8952A", fontSize: "0.85rem", cursor: "pointer" }}>← BACK TO HOME</span>
        </Link>
      </footer>
    </div>
  );
}
