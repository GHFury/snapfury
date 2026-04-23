"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

const SNAP_TAGS = ["SNAP", "RETREAT", "DOUBLE SNAP", "LAST SECOND", "CUBE FLEX", "COMEBACK", "PERFECT GAME"];

type Clip = {
  id: string;
  title: string;
  views: number;
  createdAt: string;
  user: { username: string; avatar: string | null };
  tags: { tag: string }[];
  _count: { likes: number; comments: number };
};

const TAG_COLORS = ["#C8952A", "#4A3DC8", "#8B2035"];
const TAG_WORDS  = ["POW!", "ZAP!", "BAM!", "KA-POW!", "WHAM!", "BOOM!"];

export default function HomePage() {
  const [activeNav, setActiveNav] = useState("HOME");
  const [clips,     setClips]     = useState<Clip[]>([]);
  const [sort,      setSort]      = useState("latest");
  const [loading,   setLoading]   = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/clips?sort=${sort}&limit=6`)
      .then(r => r.json())
      .then(d => { setClips(d.clips ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [sort]);

  const fmtViews = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + "K" : String(n);

  return (
    <div style={{ fontFamily: "'Special Elite', serif", background: "#f0e6c8", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,900&family=Special+Elite&family=Permanent+Marker&family=Anton&family=Barlow+Condensed:wght@400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .newsprint { background-color: #f0e6c8; background-image: repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(0,0,0,0.04) 28px); }
        .halftone  { background-image: radial-gradient(circle, #11111120 1px, transparent 1px); background-size: 7px 7px; }
        .spidey    { font-family: 'Anton', sans-serif; font-style: italic; transform: skewX(-6deg); display: inline-block; letter-spacing: 1px; }
        .spidey-lg { font-family: 'Anton', sans-serif; font-style: italic; transform: skewX(-8deg); display: inline-block; -webkit-text-stroke: 2px #111; text-shadow: 4px 4px 0 #111, 7px 7px 0 rgba(0,0,0,0.12); letter-spacing: 2px; line-height: 0.88; }
        .panel     { border: 4px solid #111; box-shadow: 8px 8px 0 #111; background: white; position: relative; overflow: hidden; }
        .hrule-double { height: 7px; background: linear-gradient(#111 2px, transparent 2px, transparent 4px, #111 4px); }
        .starburst { clip-path: polygon(50% 0%,56% 18%,73% 5%,65% 22%,85% 18%,73% 32%,95% 35%,78% 43%,95% 55%,76% 57%,88% 74%,70% 70%,72% 90%,58% 80%,50% 100%,42% 80%,28% 90%,30% 70%,12% 74%,24% 57%,5% 55%,22% 43%,5% 35%,27% 32%,15% 18%,35% 22%,27% 5%,44% 18%); }
        .btn { font-family: 'Anton', sans-serif; font-style: italic; letter-spacing: 2px; border: 3px solid #111; cursor: pointer; text-transform: uppercase; transition: transform 0.1s, box-shadow 0.1s; }
        .btn:hover { transform: translate(-2px,-2px); }
        .btn:active { transform: translate(2px,2px); }
        .nav-item { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 1rem; letter-spacing: 2px; color: #C8952A; cursor: pointer; text-transform: uppercase; transition: color 0.1s; text-decoration: none; }
        .nav-item:hover, .nav-item.active { color: white; }
        .clip-card { border: 4px solid #111; box-shadow: 6px 6px 0 #111; background: white; cursor: pointer; overflow: hidden; transition: transform 0.15s, box-shadow 0.15s; text-decoration: none; display: block; }
        .clip-card:hover { transform: translate(-3px,-3px) rotate(-1deg); box-shadow: 9px 9px 0 #111; z-index: 10; }
        .tag-badge { font-family: 'Anton', sans-serif; font-style: italic; font-size: 0.85rem; border: 2px solid #111; padding: 3px 10px; display: inline-block; box-shadow: 2px 2px 0 #111; color: white; transform: rotate(-3deg); }
        .col-rule  { width: 1px; background: repeating-linear-gradient(#333 0, #333 6px, transparent 6px, transparent 12px); margin: 0 6px; align-self: stretch; flex-shrink: 0; }
        .zigzag    { width: 100%; height: 22px; background: #111; clip-path: polygon(0 0,2.5% 100%,5% 0,7.5% 100%,10% 0,12.5% 100%,15% 0,17.5% 100%,20% 0,22.5% 100%,25% 0,27.5% 100%,30% 0,32.5% 100%,35% 0,37.5% 100%,40% 0,42.5% 100%,45% 0,47.5% 100%,50% 0,52.5% 100%,55% 0,57.5% 100%,60% 0,62.5% 100%,65% 0,67.5% 100%,70% 0,72.5% 100%,75% 0,77.5% 100%,80% 0,82.5% 100%,85% 0,87.5% 100%,90% 0,92.5% 100%,95% 0,97.5% 100%,100% 0,100% 0,0 0); }
        .sort-btn  { font-family: 'Anton', sans-serif; font-style: italic; font-size: 0.9rem; letter-spacing: 1px; border: 2px solid #111; padding: 6px 14px; cursor: pointer; transition: all 0.1s; }
        .sort-btn.active { background: #4A3DC8; color: white; box-shadow: 3px 3px 0 #111; transform: translate(-1px,-1px); }
        .sort-btn.idle   { background: #f8f0d8; color: #555; }
        .sort-btn.idle:hover { background: #e8ddb8; }
        @keyframes snapIn { 0%{transform:scale(0.8) rotate(-5deg);opacity:0;} 70%{transform:scale(1.06);} 100%{transform:scale(1);opacity:1;} }
        @keyframes bob    { 0%,100%{transform:translateY(0) rotate(-1.5deg);} 50%{transform:translateY(-8px) rotate(1.5deg);} }
        @keyframes pulse  { 0%,100%{box-shadow:5px 5px 0 #111,0 0 0 0 rgba(200,149,42,0.4);} 50%{box-shadow:5px 5px 0 #111,0 0 0 10px rgba(200,149,42,0);} }
        .snap-in { animation: snapIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .bob     { animation: bob 3.5s ease-in-out infinite; }
        .pulse   { animation: pulse 2s infinite; }
        .skeleton { background: linear-gradient(90deg, #e8ddb8 25%, #f5f0e0 50%, #e8ddb8 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
        @keyframes shimmer { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }
      `}</style>

      <Navbar />

      {/* ── MASTHEAD ── */}
      <div className="newsprint" style={{ borderBottom: "5px solid #111" }}>
        <div style={{ background: "#111", padding: "5px 32px", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'Special Elite',serif", color: "#C8952A", fontSize: "0.7rem", letterSpacing: 2 }}>EST. 2025 · MARVEL SNAP'S PREMIER CLIP COMMUNITY</span>
          <span style={{ fontFamily: "'Special Elite',serif", color: "#888", fontSize: "0.7rem" }}>COLLECTOR'S SPECIAL EDITION · ISSUE #001</span>
          <span style={{ fontFamily: "'Special Elite',serif", color: "#C8952A", fontSize: "0.7rem", letterSpacing: 2 }}>FREE · SNAPFURY.COM</span>
        </div>
        <div style={{ padding: "12px 32px 10px", textAlign: "center", background: "white", borderBottom: "3px solid #111", position: "relative" }}>
          <svg style={{ position: "absolute", top: 0, left: 0, opacity: 0.07 }} width="70" height="70" viewBox="0 0 80 80"><path d="M0,0 Q40,40 0,80 M0,0 Q80,40 80,0 M0,0 L80,80 M0,40 Q40,40 80,40 M40,0 Q40,40 40,80" stroke="#111" strokeWidth="1.5" fill="none" /></svg>
          <svg style={{ position: "absolute", top: 0, right: 0, opacity: 0.07, transform: "scaleX(-1)" }} width="70" height="70" viewBox="0 0 80 80"><path d="M0,0 Q40,40 0,80 M0,0 Q80,40 80,0 M0,0 L80,80 M0,40 Q40,40 80,40 M40,0 Q40,40 40,80" stroke="#111" strokeWidth="1.5" fill="none" /></svg>
          <div className="spidey-lg snap-in" style={{ fontSize: "clamp(2.5rem,6vw,5rem)", color: "#C8952A", display: "block" }}>SNAP FURY</div>
          <div style={{ height: 5, background: "linear-gradient(#111 2px,transparent 2px,transparent 3px,#111 3px)", maxWidth: 400, margin: "5px auto" }} />
          <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.8rem", letterSpacing: 3, color: "#555" }}>"ALL THE SNAPS FIT TO PRINT" · MARVEL SNAP'S #1 CLIP SOURCE · SPECIAL EDITION</div>
        </div>
        <div style={{ background: "#8B2035", borderBottom: "3px solid #111", padding: "7px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="spidey" style={{ color: "white", fontSize: "0.95rem" }}>LATEST ISSUE — FURY STRIKES AGAIN</span>
          <span style={{ fontFamily: "'Special Elite',serif", color: "rgba(255,255,255,0.8)", fontSize: "0.75rem", letterSpacing: 2 }}>★ COLLECTOR'S SPECIAL EDITION ★</span>
          <span className="spidey" style={{ color: "#C8952A", fontSize: "0.95rem" }}>10,000+ CLIPS CAPTURED</span>
        </div>
        {/* Special Edition Band */}
        <div style={{ background: "#8B2035", borderBottom: "3px solid #111", padding: "8px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="starburst" style={{ width: 44, height: 44, background: "#C8952A", border: "2px solid #111", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", color: "#111", fontSize: "0.6rem", textAlign: "center", lineHeight: 1 }}>SPEC<br />ED</span>
            </div>
            <span style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontWeight: 900, color: "white", fontSize: "1.2rem", letterSpacing: 3 }}>★ COLLECTOR'S SPECIAL EDITION ★</span>
          </div>
          <span style={{ fontFamily: "'Special Elite',serif", color: "rgba(255,255,255,0.8)", fontSize: "0.8rem", letterSpacing: 2 }}>ISSUE #001 · LIMITED PRINT</span>
          <div className="spidey" style={{ color: "#C8952A", fontSize: "1.1rem", letterSpacing: 2 }}>SNAP FURY</div>
        </div>
      </div>

      {/* ── HERO COLLAGE ── */}
      <main className="newsprint" style={{ padding: "28px 28px 0", maxWidth: 1280, margin: "0 auto" }}>

        {/* TOP ROW */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 3px 1fr 3px 1fr", gap: 0, alignItems: "start", marginBottom: 0 }}>

          {/* BIG HERO PANEL */}
          <div className="panel" style={{ background: "#4A3DC8", position: "relative", minHeight: 480, display: "flex", flexDirection: "column", zIndex: 10, transform: "rotate(-1deg)" }}>
            <div className="halftone" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />
            <div style={{ background: "#C8952A", borderBottom: "4px solid #111", padding: "6px 16px", display: "flex", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
              <span className="spidey" style={{ color: "#111", fontSize: "1rem" }}>BREAKING NEWS</span>
              <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.8rem", color: "#111" }}>PANEL ONE</span>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 24px", position: "relative", zIndex: 2, gap: 16 }}>
              <div style={{ background: "white", border: "3px solid #111", borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%", padding: "10px 18px", display: "inline-block", boxShadow: "3px 3px 0 #111", position: "relative" }}>
                <span style={{ fontFamily: "'Permanent Marker',cursive", fontSize: "0.95rem", color: "#111" }}>The fury is REAL! 💥</span>
              </div>
              <img src="/logo.jpg" alt="SnapFury" className="bob"
                style={{ width: 200, height: 200, borderRadius: "50%", objectFit: "cover", border: "6px solid #C8952A", boxShadow: "10px 10px 0 #111", outline: "3px solid #111", outlineOffset: 6 }} />
              <div style={{ textAlign: "center" }}>
                <div className="spidey-lg" style={{ fontSize: "4.5rem", color: "#C8952A", display: "block" }}>SNAP</div>
                <div className="spidey-lg" style={{ fontSize: "4.5rem", color: "white", display: "block" }}>FURY!</div>
              </div>
              <p style={{ fontFamily: "'Special Elite',serif", color: "rgba(255,255,255,0.85)", fontSize: "0.9rem", textAlign: "center", lineHeight: 1.6, maxWidth: 280 }}>
                Share your greatest Marvel Snap moments. The community demands your best plays!
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                <Link href="/upload">
                  <button className="btn pulse" style={{ background: "#C8952A", color: "#111", padding: "10px 24px", borderRadius: 3, fontSize: "1.2rem", boxShadow: "5px 5px 0 #111" }}>⬆ UPLOAD A SNAP</button>
                </Link>
                <Link href="/clips">
                  <button className="btn" style={{ background: "transparent", color: "white", padding: "10px 24px", borderRadius: 3, fontSize: "1.2rem", borderColor: "white", boxShadow: "5px 5px 0 white" }}>🎬 WATCH CLIPS</button>
                </Link>
              </div>
            </div>
            <div className="starburst" style={{ position: "absolute", bottom: -35, right: -35, width: 100, height: 100, background: "#C8952A", border: "3px solid #111", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", color: "#111", fontSize: "1.1rem" }}>POW!</span>
            </div>
          </div>

          <div className="col-rule" />

          {/* MIDDLE COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {loading ? (
              <div style={{ height: 320, border: "4px solid #111", background: "#f8f0d8" }} className="skeleton" />
            ) : clips.slice(0, 2).map((clip, i) => (
              <Link key={clip.id} href={`/clips/${clip.id}`} className="clip-card" style={{ marginBottom: 18, transform: `rotate(${i === 0 ? "1deg" : "-2deg"})` }}>
                <div style={{ height: 130, background: `linear-gradient(135deg, ${i === 0 ? "#1a1040,#4A3DC8" : "#2d0a14,#8B2035"})`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  <div className="halftone" style={{ position: "absolute", inset: 0, opacity: 0.2 }} />
                  <div style={{ position: "absolute", top: 6, left: 6 }}>
                    <span className="tag-badge" style={{ background: TAG_COLORS[i] }}>{clip.tags[0]?.tag ?? TAG_WORDS[i]}</span>
                  </div>
                  <div style={{ width: 42, height: 42, background: "#C8952A", border: "3px solid #111", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "3px 3px 0 #111", zIndex: 2 }}>
                    <span style={{ fontSize: "1.1rem", marginLeft: 3 }}>▶</span>
                  </div>
                </div>
                <div style={{ padding: "10px 12px", borderTop: "3px solid #111" }}>
                  <div className="spidey" style={{ fontSize: "1.1rem", color: "#111" }}>{clip.title}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, color: "#4A3DC8", fontSize: "0.8rem" }}>@{clip.user.username}</span>
                    <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.75rem", color: "#666" }}>❤ {clip._count.likes}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="col-rule" />

          {/* RIGHT COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Stats box */}
            <div style={{ border: "6px double #111", outline: "2px solid #111", outlineOffset: 4, background: "#f8f0d8", textAlign: "center", padding: 16, transform: "rotate(1.5deg)" }}>
              <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.7rem", letterSpacing: 4, borderBottom: "1px solid #111", marginBottom: 8, paddingBottom: 4 }}>COMMUNITY STATS</div>
              <div className="spidey-lg" style={{ fontSize: "2.8rem", color: "#8B2035" }}>10K+</div>
              <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.75rem", letterSpacing: 3, marginTop: 4 }}>SNAPS CAPTURED</div>
              <div style={{ margin: "10px 0", height: 1, background: "#111" }} />
              {[["2.4K", "SNAPPERS"], ["890K", "VIEWS"], ["142", "TODAY"]].map(([v, l]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span className="spidey" style={{ color: "#4A3DC8", fontSize: "1.1rem" }}>{v}</span>
                  <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.75rem", color: "#555", letterSpacing: 2, paddingTop: 3 }}>{l}</span>
                </div>
              ))}
            </div>
            {/* Third clip */}
            {!loading && clips[2] && (
              <Link href={`/clips/${clips[2].id}`} className="clip-card" style={{ transform: "rotate(-1.5deg)" }}>
                <div style={{ height: 110, background: "linear-gradient(135deg,#0a1a2d,#1a4d6e)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  <div className="halftone" style={{ position: "absolute", inset: 0, opacity: 0.2 }} />
                  <div style={{ position: "absolute", top: 6, left: 6 }}>
                    <span className="tag-badge" style={{ background: "#4A3DC8" }}>{clips[2].tags[0]?.tag ?? "BAM!"}</span>
                  </div>
                  <div style={{ width: 38, height: 38, background: "#C8952A", border: "3px solid #111", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "3px 3px 0 #111" }}>
                    <span style={{ fontSize: "1rem", marginLeft: 2 }}>▶</span>
                  </div>
                </div>
                <div style={{ padding: "8px 10px", borderTop: "3px solid #111" }}>
                  <div className="spidey" style={{ fontSize: "0.95rem", color: "#111" }}>{clips[2].title}</div>
                  <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, color: "#4A3DC8", fontSize: "0.75rem" }}>@{clips[2].user.username}</span>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* BANNER STRIP */}
        <div className="panel" style={{ background: "#111", position: "relative", zIndex: 8, marginTop: -20, border: "5px solid #111", boxShadow: "none" }}>
          <img src="/banner.jpg" alt="SnapFury Banner" style={{ width: "100%", height: 190, objectFit: "cover", objectPosition: "center 20%", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(74,61,200,0.75) 0%,transparent 35%,transparent 65%,rgba(17,17,17,0.85) 100%)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px" }}>
            <div>
              <div className="spidey-lg" style={{ fontSize: "2.8rem", color: "#C8952A", display: "block" }}>THE FURY IS REAL.</div>
              <div style={{ fontFamily: "'Special Elite',serif", color: "white", fontSize: "0.9rem", marginTop: 6, letterSpacing: 2 }}>@FuryMSnap on YouTube — Shorts of All Things Marvel Snap</div>
            </div>
            <div className="starburst" style={{ width: 110, height: 110, background: "#C8952A", border: "4px solid #111", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", color: "#111", fontSize: "1.6rem", textAlign: "center", lineHeight: 1 }}>OH<br />SNAP!</span>
            </div>
          </div>
        </div>

        {/* HEADLINE RULE */}
        <div style={{ margin: "20px 0 16px" }}>
          <div className="hrule-double" />
          <div style={{ textAlign: "center", padding: "6px 0", borderBottom: "3px solid #111", background: "#f8f0d8", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 24px" } as React.CSSProperties}>
            <span className="spidey-lg" style={{ fontSize: "clamp(1.4rem,3vw,2.4rem)", color: "#111" }}>⚡ LATEST SNAPS FROM THE COMMUNITY ⚡</span>
            <div style={{ display: "flex", gap: 8 }}>
              {[["LATEST", "latest"], ["TRENDING", "trending"], ["TOP", "top"]].map(([label, val]) => (
                <button key={val} className={`sort-btn ${sort === val ? "active" : "idle"}`} onClick={() => setSort(val)}>{label}</button>
              ))}
            </div>
          </div>
          <div className="hrule-double" />
        </div>

        {/* CLIPS GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, marginBottom: 28 }}>
          {loading ? Array(6).fill(0).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 260, border: "4px solid #ddd" }} />
          )) : clips.map((clip, i) => (
            <Link key={clip.id} href={`/clips/${clip.id}`} className="clip-card" style={{ transform: `rotate(${i % 2 === 0 ? "-0.6deg" : "0.6deg"})` }}>
              <div style={{ height: 160, background: `linear-gradient(135deg, ${["#1a1040,#4A3DC8", "#2d0a14,#8B2035", "#1a1400,#6b5200", "#0a1a2d,#1a4d6e", "#1a0a30,#6b2fa0", "#2d0a14,#8B2035"][i % 6]})`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <div className="halftone" style={{ position: "absolute", inset: 0, opacity: 0.2 }} />
                <div style={{ position: "absolute", top: 8, left: 8 }}>
                  <span className="tag-badge" style={{ background: TAG_COLORS[i % 3] }}>{clip.tags[0]?.tag ?? TAG_WORDS[i % 6]}</span>
                </div>
                <div style={{ width: 50, height: 50, background: "#C8952A", border: "3px solid #111", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "3px 3px 0 #111", zIndex: 2 }}>
                  <span style={{ fontSize: "1.3rem", marginLeft: 3 }}>▶</span>
                </div>
              </div>
              <div style={{ padding: "12px 14px", borderTop: "3px solid #111" }}>
                <div className="spidey" style={{ fontSize: "1.1rem", color: "#111", marginBottom: 6 }}>{clip.title}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, color: "#4A3DC8", fontSize: "0.85rem" }}>@{clip.user.username}</span>
                  <div style={{ display: "flex", gap: 10 }}>
                    <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.8rem", color: "#666" }}>❤️ {clip._count.likes}</span>
                    <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.8rem", color: "#666" }}>👁 {fmtViews(clip.views)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/clips">
            <button className="btn" style={{ background: "#4A3DC8", color: "white", padding: "12px 40px", fontSize: "1.3rem", boxShadow: "5px 5px 0 #111", borderRadius: 3 }}>VIEW ALL CLIPS →</button>
          </Link>
        </div>

        {/* UPLOAD CTA */}
        <div className="hrule-double" />
        <div style={{ background: "#C8952A", border: "5px solid #111", boxShadow: "8px 8px 0 #111", padding: "32px 40px", position: "relative", overflow: "hidden", textAlign: "center", margin: "20px 0", transform: "rotate(-0.3deg)" }}>
          <div className="halftone" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />
          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{ fontFamily: "'Special Elite',serif", background: "#111", color: "#C8952A", display: "inline-block", padding: "3px 20px", marginBottom: 12, letterSpacing: 4, fontSize: "0.85rem" }}>★ SPECIAL BULLETIN ★</div>
            <div style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", fontSize: "clamp(2.5rem,5vw,4.5rem)", color: "#111", display: "block", marginBottom: 8, letterSpacing: 2, lineHeight: 0.9, textShadow: "3px 3px 0 rgba(0,0,0,0.15)" }}>DID YOU SNAP?<br />SHARE IT!</div>
            <p style={{ fontFamily: "'Special Elite',serif", fontSize: "1rem", color: "#111", maxWidth: 520, margin: "16px auto 24px", lineHeight: 1.6 }}>
              Upload your best Marvel Snap moments and let the community feel your fury. Every great snap deserves an audience.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/upload">
                <button className="btn" style={{ background: "#4A3DC8", color: "white", padding: "12px 36px", borderRadius: 3, fontSize: "1.5rem", boxShadow: "5px 5px 0 #111" }}>⬆ UPLOAD YOUR SNAP</button>
              </Link>
            </div>
          </div>
        </div>
        <div className="hrule-double" />
      </main>

      {/* FOOTER */}
      <footer style={{ background: "#111", borderTop: "5px solid #C8952A", padding: "32px 32px 16px", marginTop: 32 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <img src="/logo.jpg" alt="SnapFury" style={{ width: 64, height: 64, borderRadius: "50%", border: "3px solid #C8952A", objectFit: "cover" }} />
              <div>
                <div className="spidey" style={{ color: "#C8952A", fontSize: "2rem", letterSpacing: 3 }}>SNAP FURY</div>
                <div style={{ fontFamily: "'Special Elite',serif", color: "#666", fontSize: "0.8rem", marginTop: 4 }}>"All The Snaps Fit To Print"</div>
              </div>
            </div>
            {[
              { title: "EXPLORE",   links: [["Latest Clips", "/clips"], ["Leaderboard", "/leaderboard"], ["Upload a Snap", "/upload"]] },
              { title: "COMMUNITY", links: [["YouTube", "https://youtube.com/@fury-msnap"], ["Discord", "https://discord.gg/snapfury"], ["Twitch", "https://twitch.tv/snap_fury"], ["X / Twitter", "https://x.com/M_SnapFury"], ["Submit a Clip", "/upload"]] },
              { title: "ACCOUNT",   links: [["Sign In", "/signin"], ["Join the Fury", "/signup"]] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="spidey" style={{ color: "#C8952A", fontSize: "1.1rem", marginBottom: 10, borderBottom: "2px solid #C8952A", paddingBottom: 5 }}>{col.title}</h4>
                {col.links.map(([label, href]) => (
                  <Link key={label} href={href} style={{ fontFamily: "'Special Elite',serif", color: "#888", fontSize: "0.85rem", marginBottom: 5, cursor: "pointer", display: "block", textDecoration: "none" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "white")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#888")}
                  >{label}</Link>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #333", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontFamily: "'Special Elite',serif", color: "#444", fontSize: "0.8rem" }}>© 2025 SnapFury · Not affiliated with Marvel or Second Dinner</span>
            <div style={{ display: "flex", gap: 16 }}>
              {[["YouTube", "https://youtube.com/@fury-msnap"], ["Discord", "https://discord.gg/snapfury"], ["Twitch", "https://twitch.tv/snap_fury"], ["𝕏", "https://x.com/M_SnapFury"]].map(([s, href]) => (
                <Link key={s} href={href} className="spidey" style={{ color: "#C8952A", fontSize: "0.85rem", cursor: "pointer", textDecoration: "none" }}>{s}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
