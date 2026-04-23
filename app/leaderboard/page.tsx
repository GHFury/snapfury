"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

type LeaderUser = {
  id: string;
  username: string;
  avatar: string | null;
  _count: { clips: number; followers: number };
  totalLikes: number;
  totalViews: number;
};

type TopClip = {
  id: string;
  title: string;
  views: number;
  createdAt: string;
  user: { username: string };
  tags: { tag: string }[];
  _count: { likes: number };
};

const MEDAL = ["🥇", "🥈", "🥉"];
const BG = ["#C8952A", "#aaa", "#CD7F32", "#4A3DC8"];

export default function LeaderboardPage() {
  const [tab,      setTab]      = useState<"snappers" | "clips">("snappers");
  const [users,    setUsers]    = useState<LeaderUser[]>([]);
  const [clips,    setClips]    = useState<TopClip[]>([]);
  const { data: session } = useSession();
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/leaderboard/snappers").then(r => r.json()),
      fetch("/api/clips?sort=top&limit=10").then(r => r.json()),
    ]).then(([snappers, clipsData]) => {
      setUsers(snappers.users ?? []);
      setClips(clipsData.clips ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const fmt = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + "K" : String(n);

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
        .btn       { font-family: 'Anton', sans-serif; font-style: italic; letter-spacing: 2px; border: 3px solid #111; cursor: pointer; text-transform: uppercase; transition: transform 0.1s, box-shadow 0.1s; }
        .btn:hover { transform: translate(-2px,-2px); }
        .tab-btn   { font-family: 'Anton', sans-serif; font-style: italic; font-size: 1.2rem; letter-spacing: 2px; border: 3px solid #111; padding: 12px 32px; cursor: pointer; transition: all 0.15s; flex: 1; text-align: center; }
        .tab-on    { background: #4A3DC8; color: white; box-shadow: 5px 5px 0 #111; transform: translate(-2px,-2px); }
        .tab-off   { background: #f8f0d8; color: #888; }
        .tab-off:hover { background: #e8ddb8; }
        .row       { display: flex; align-items: center; gap: 16px; padding: 14px 18px; border-bottom: 2px solid #eee; transition: background 0.1s; cursor: pointer; text-decoration: none; }
        .row:hover { background: #f8f0d8; }
        .row:last-child { border-bottom: none; }
        .row-top   { background: linear-gradient(90deg, rgba(200,149,42,0.08) 0%, transparent 60%); }
        .skeleton  { background: linear-gradient(90deg,#e8ddb8 25%,#f5f0e0 50%,#e8ddb8 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
        @keyframes shimmer { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }
        @keyframes snapIn { 0%{transform:scale(0.85) rotate(-2deg);opacity:0;} 70%{transform:scale(1.04);} 100%{transform:scale(1);opacity:1;} }
        .snap-in { animation: snapIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
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
          <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.75rem", letterSpacing: 3, color: "#555" }}>"THE HALL OF FURY" · COMMUNITY LEADERBOARD</div>
        </div>
        <div style={{ background: "#8B2035", padding: "7px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "3px solid #111" }}>
          <span className="spidey" style={{ color: "white", fontSize: "0.9rem" }}>WHO RULES THE SNAP FURY UNIVERSE?</span>
          <span style={{ fontFamily: "'Special Elite',serif", color: "rgba(255,255,255,0.8)", fontSize: "0.75rem", letterSpacing: 2 }}>★ UPDATED IN REAL TIME ★</span>
          <span className="spidey" style={{ color: "#C8952A", fontSize: "0.9rem" }}>ISSUE #001 · LIMITED PRINT</span>
        </div>
      </div>

      {/* MAIN */}
      <div className="newsprint" style={{ flex: 1, padding: "28px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>

          {/* PAGE TITLE */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div className="spidey-lg" style={{ fontSize: "clamp(2.5rem,5vw,4rem)", color: "#4A3DC8", display: "block" }}>🏆 HALL OF FURY</div>
            <div style={{ fontFamily: "'Special Elite',serif", color: "#666", fontSize: "0.9rem", marginTop: 8, letterSpacing: 2 }}>
              The greatest snappers and clips in the community
            </div>
          </div>

          {/* TABS */}
          <div style={{ display: "flex", marginBottom: 28, gap: 0 }}>
            <button className={`tab-btn ${tab === "snappers" ? "tab-on" : "tab-off"}`}
              onClick={() => setTab("snappers")}
              style={{ borderRight: "none", borderRadius: "3px 0 0 3px" }}>
              👑 TOP SNAPPERS
            </button>
            <button className={`tab-btn ${tab === "clips" ? "tab-on" : "tab-off"}`}
              onClick={() => setTab("clips")}
              style={{ borderLeft: "2px solid #111", borderRadius: "0 3px 3px 0" }}>
              🎬 TOP CLIPS
            </button>
          </div>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 72, border: "3px solid #ddd" }} />
              ))}
            </div>
          ) : tab === "snappers" ? (
            /* ── TOP SNAPPERS ── */
            <div className="panel snap-in">
              <div style={{ background: "#C8952A", borderBottom: "4px solid #111", padding: "8px 18px", display: "flex", justifyContent: "space-between" }}>
                <span className="spidey" style={{ color: "#111", fontSize: "1rem" }}>★ TOP SNAPPERS BY TOTAL LIKES</span>
                <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.75rem", color: "#111" }}>ALL TIME</span>
              </div>

              {users.length === 0 ? (
                <div style={{ padding: "40px", textAlign: "center" }}>
                  <div className="spidey" style={{ color: "#ccc", fontSize: "1.5rem", display: "block", marginBottom: 8 }}>NO SNAPPERS YET!</div>
                  <p style={{ fontFamily: "'Special Elite',serif", color: "#aaa" }}>Be the first to upload clips and claim the #1 spot.</p>
                </div>
              ) : users.map((user, i) => (
                <Link key={user.id} href={`/profile/${user.username}`} className={`row ${i < 3 ? "row-top" : ""}`}>
                  {/* Rank */}
                  <div style={{ width: 52, flexShrink: 0, textAlign: "center" }}>
                    {i < 3 ? (
                      <span style={{ fontSize: "1.8rem" }}>{MEDAL[i]}</span>
                    ) : (
                      <div className="starburst" style={{ width: 38, height: 38, background: BG[Math.min(i, 3)], border: "2px solid #111", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                        <span className="spidey" style={{ color: "#111", fontSize: "0.85rem" }}>#{i + 1}</span>
                      </div>
                    )}
                  </div>

                  {/* Avatar */}
                  <div style={{ width: 44, height: 44, borderRadius: "50%", border: `3px solid ${i === 0 ? "#C8952A" : i === 1 ? "#aaa" : i === 2 ? "#CD7F32" : "#111"}`, background: "#4A3DC8", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0, boxShadow: "3px 3px 0 #111" }}>
                    {user.avatar ? <img src={user.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", color: "#C8952A", fontSize: "1.1rem" }}>{user.username[0].toUpperCase()}</span>}
                  </div>

                  {/* Name + stats */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="spidey" style={{ color: "#4A3DC8", fontSize: "1.1rem", display: "block" }}>@{user.username}</div>
                    <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.78rem", color: "#888" }}>
                      {user._count.clips} clips · {user._count.followers} followers
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: "flex", gap: 24, flexShrink: 0 }}>
                    <div style={{ textAlign: "center" }}>
                      <div className="spidey" style={{ color: "#8B2035", fontSize: "1.3rem" }}>{fmt(user.totalLikes)}</div>
                      <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.65rem", color: "#aaa", letterSpacing: 1 }}>TOTAL LIKES</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div className="spidey" style={{ color: "#4A3DC8", fontSize: "1.3rem" }}>{fmt(user.totalViews)}</div>
                      <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.65rem", color: "#aaa", letterSpacing: 1 }}>TOTAL VIEWS</div>
                    </div>
                  </div>

                  {/* Your rank badge */}
                  {session?.user?.username === user.username && (
                    <span style={{ background: "#C8952A", fontFamily: "'Special Elite',serif", fontSize: "0.65rem", letterSpacing: 2, color: "#111", padding: "2px 8px", border: "2px solid #111", flexShrink: 0 }}>YOU</span>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            /* ── TOP CLIPS ── */
            <div className="panel snap-in">
              <div style={{ background: "#8B2035", borderBottom: "4px solid #111", padding: "8px 18px", display: "flex", justifyContent: "space-between" }}>
                <span className="spidey" style={{ color: "white", fontSize: "1rem" }}>★ TOP CLIPS BY TOTAL LIKES</span>
                <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>ALL TIME</span>
              </div>

              {clips.length === 0 ? (
                <div style={{ padding: "40px", textAlign: "center" }}>
                  <div className="spidey" style={{ color: "#ccc", fontSize: "1.5rem", display: "block", marginBottom: 8 }}>NO CLIPS YET!</div>
                  <Link href="/upload"><button className="btn" style={{ background: "#4A3DC8", color: "white", padding: "10px 24px", fontSize: "1.1rem", boxShadow: "4px 4px 0 #111", borderRadius: 3, marginTop: 8 }}>⬆ UPLOAD FIRST</button></Link>
                </div>
              ) : clips.map((clip, i) => (
                <Link key={clip.id} href={`/clips/${clip.id}`} className={`row ${i < 3 ? "row-top" : ""}`}>
                  {/* Rank */}
                  <div style={{ width: 52, flexShrink: 0, textAlign: "center" }}>
                    {i < 3 ? (
                      <span style={{ fontSize: "1.8rem" }}>{MEDAL[i]}</span>
                    ) : (
                      <div className="starburst" style={{ width: 38, height: 38, background: "#4A3DC8", border: "2px solid #111", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                        <span className="spidey" style={{ color: "white", fontSize: "0.85rem" }}>#{i + 1}</span>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail */}
                  <div style={{ width: 80, height: 52, background: `linear-gradient(135deg,#1a1040,#4A3DC8)`, border: "2px solid #111", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", boxShadow: "3px 3px 0 #111" }}>
                    <span style={{ fontSize: "1.3rem" }}>▶</span>
                  </div>

                  {/* Title + user */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="spidey" style={{ color: "#111", fontSize: "1rem", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{clip.title}</div>
                    <div style={{ display: "flex", gap: 10, marginTop: 3 }}>
                      <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, color: "#4A3DC8", fontSize: "0.8rem" }}>@{clip.user.username}</span>
                      {clip.tags[0] && <span style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", fontSize: "0.72rem", border: "1px solid #C8952A", padding: "0 6px", color: "#C8952A" }}>{clip.tags[0].tag}</span>}
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: "flex", gap: 20, flexShrink: 0 }}>
                    <div style={{ textAlign: "center" }}>
                      <div className="spidey" style={{ color: "#8B2035", fontSize: "1.2rem" }}>{fmt(clip._count.likes)}</div>
                      <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.65rem", color: "#aaa", letterSpacing: 1 }}>LIKES</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div className="spidey" style={{ color: "#4A3DC8", fontSize: "1.2rem" }}>{fmt(clip.views)}</div>
                      <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.65rem", color: "#aaa", letterSpacing: 1 }}>VIEWS</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* CTA for signed-out users */}
          {!session && (
            <div style={{ marginTop: 28, padding: "24px", border: "4px solid #111", background: "#4A3DC8", boxShadow: "8px 8px 0 #111", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div className="halftone" style={{ position: "absolute", inset: 0, opacity: 0.2 }} />
              <div style={{ position: "relative", zIndex: 2 }}>
                <div className="spidey-lg" style={{ fontSize: "2rem", color: "#C8952A", display: "block", marginBottom: 8 }}>WANT TO CLIMB THE RANKS?</div>
                <p style={{ fontFamily: "'Special Elite',serif", color: "rgba(255,255,255,0.85)", marginBottom: 16 }}>Join SnapFury, upload your best snaps, and earn your spot on the leaderboard.</p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                  <Link href="/signup"><button className="btn" style={{ background: "#C8952A", color: "#111", padding: "10px 28px", fontSize: "1.2rem", boxShadow: "4px 4px 0 #111", borderRadius: 3 }}>⚡ JOIN THE FURY</button></Link>
                  <Link href="/upload"><button className="btn" style={{ background: "white", color: "#111", padding: "10px 24px", fontSize: "1.2rem", boxShadow: "4px 4px 0 #111", borderRadius: 3 }}>⬆ UPLOAD A SNAP</button></Link>
                </div>
              </div>
            </div>
          )}
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
