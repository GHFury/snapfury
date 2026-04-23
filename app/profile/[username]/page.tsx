"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

type ProfileClip = {
  id: string;
  title: string;
  views: number;
  createdAt: string;
  tags: { tag: string }[];
  _count: { likes: number };
};

type Profile = {
  id: string;
  username: string;
  avatar: string | null;
  displayName: string | null;
  bio: string | null;
  snapId: string | null;
  twitter: string | null;
  discord: string | null;
  twitch: string | null;
  youtube: string | null;
  createdAt: string;
  _count: { clips: number; followers: number; following: number };
  clips: ProfileClip[];
};

const BG_GRADIENTS = [
  "135deg,#1a1040,#4A3DC8", "135deg,#2d0a14,#8B2035",
  "135deg,#0a1a2d,#1a4d6e", "135deg,#1a0a30,#6b2fa0",
  "135deg,#1a1400,#6b5200", "135deg,#1a1040,#4A3DC8",
];

export default function ProfilePage() {
  const { username }       = useParams<{ username: string }>();
  const { data: session }  = useSession();

  const [profile,   setProfile]   = useState<Profile | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [notFound,  setNotFound]  = useState(false);
  const [following, setFollowing] = useState(false);
  const [follCount, setFollCount] = useState(0);
  const [tab,       setTab]       = useState<"clips" | "saved">("clips");

  const isOwn = session?.user?.username === username;

  useEffect(() => {
    if (!username) return;
    fetch(`/api/users/${username}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data: Profile) => {
        setProfile(data);
        setFollCount(data._count.followers);
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [username]);

  const handleFollow = async () => {
    if (!session) return;
    setFollowing(f => !f);
    setFollCount(n => following ? n - 1 : n + 1);
    await fetch(`/api/users/${username}`, { method: "POST" });
  };

  const fmt = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + "K" : String(n);
  const joinDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f0e6c8" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Anton&display=swap'); @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}`}</style>
      <div style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", fontSize: "3rem", color: "#4A3DC8", animation: "pulse 1s infinite", letterSpacing: 3 }}>LOADING...</div>
    </div>
  );

  if (notFound || !profile) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f0e6c8", gap: 20 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Anton&family=Special+Elite&display=swap');`}</style>
      <div style={{ border: "5px solid #111", boxShadow: "10px 10px 0 #111", background: "white", padding: "40px 48px", textAlign: "center", maxWidth: 400 }}>
        <div style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", fontSize: "4rem", color: "#8B2035", lineHeight: 1 }}>404</div>
        <div style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", fontSize: "2rem", color: "#111", marginBottom: 12 }}>SNAPPER NOT FOUND!</div>
        <p style={{ fontFamily: "'Special Elite',serif", color: "#666", marginBottom: 24 }}>This profile doesn't exist or was deleted.</p>
        <Link href="/"><button style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", background: "#4A3DC8", color: "white", border: "3px solid #111", padding: "10px 28px", fontSize: "1.2rem", cursor: "pointer", boxShadow: "4px 4px 0 #111" }}>← GO HOME</button></Link>
      </div>
    </div>
  );

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
        .btn:active{ transform: translate(2px,2px); }
        .nav-item  { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 1rem; letter-spacing: 2px; color: #C8952A; text-transform: uppercase; transition: color 0.1s; text-decoration: none; }
        .nav-item:hover { color: white; }
        .clip-card { border: 3px solid #111; box-shadow: 5px 5px 0 #111; background: white; cursor: pointer; overflow: hidden; transition: transform 0.15s, box-shadow 0.15s; text-decoration: none; display: block; }
        .clip-card:hover { transform: translate(-3px,-3px) rotate(-1deg); box-shadow: 8px 8px 0 #111; z-index: 5; }
        .tab-btn   { font-family: 'Anton', sans-serif; font-style: italic; font-size: 1.1rem; letter-spacing: 2px; border: 3px solid #111; padding: 10px 28px; cursor: pointer; transition: all 0.15s; flex: 1; text-align: center; }
        .tab-active{ background: #4A3DC8; color: white; box-shadow: 4px 4px 0 #111; transform: translate(-2px,-2px); }
        .tab-idle  { background: #f8f0d8; color: #888; }
        .tab-idle:hover { background: #e8ddb8; }
        .stat-box  { border: 3px solid #111; background: white; padding: 14px 10px; text-align: center; box-shadow: 4px 4px 0 #111; flex: 1; }
        @keyframes snapIn { 0%{transform:scale(0.85) rotate(-3deg);opacity:0;} 70%{transform:scale(1.05);} 100%{transform:scale(1);opacity:1;} }
        @keyframes bob    { 0%,100%{transform:translateY(0) rotate(-1deg);} 50%{transform:translateY(-6px) rotate(1deg);} }
        .snap-in { animation: snapIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .bob     { animation: bob 3.5s ease-in-out infinite; }
        .tag-badge { font-family: 'Anton', sans-serif; font-style: italic; font-size: 0.75rem; border: 2px solid #111; padding: 2px 8px; display: inline-block; box-shadow: 2px 2px 0 #111; color: white; }
      `}</style>

      <Navbar />

      {/* PROFILE HEADER */}
      <div style={{ background: "#4A3DC8", borderBottom: "5px solid #111", position: "relative", overflow: "hidden" }}>
        <div className="halftone" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />
        {/* BG ghost text */}
        <div style={{ position: "absolute", bottom: -20, right: 20, fontFamily: "'Anton',sans-serif", fontStyle: "italic", fontSize: "8rem", color: "rgba(255,255,255,0.04)", lineHeight: 1, letterSpacing: 4 }}>FURY</div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 28px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", gap: 28, alignItems: "flex-end", flexWrap: "wrap" }}>

            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div className="bob" style={{ width: 130, height: 130, borderRadius: "50%", border: "5px solid #C8952A", background: "#111", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "8px 8px 0 #111", outline: "3px solid #111", outlineOffset: 5, overflow: "hidden" }}>
                {profile.avatar
                  ? <img src={profile.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <span style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", color: "#C8952A", fontSize: "3.5rem" }}>{profile.username[0].toUpperCase()}</span>
                }
              </div>

            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 8 }}>
                <div className="spidey-lg" style={{ fontSize: "2.8rem", color: "#C8952A" }}>@{profile.username}</div>
                {isOwn ? (
                  <span style={{ background: "#C8952A", fontFamily: "'Special Elite',serif", fontSize: "0.7rem", letterSpacing: 3, color: "#111", padding: "2px 10px", border: "2px solid #111" }}>YOUR PROFILE</span>
                ) : session && (
                  <button className="btn" onClick={handleFollow}
                    style={{ background: following ? "#f0e6c8" : "#C8952A", color: following ? "#111" : "#111", padding: "8px 20px", fontSize: "1rem", boxShadow: "4px 4px 0 #111", borderRadius: 3 }}>
                    {following ? "✓ FOLLOWING" : "+ FOLLOW FURY"}
                  </button>
                )}
              </div>
              {/* Display name */}
              {profile.displayName && (
                <div style={{ fontFamily: "'Special Elite',serif", color: "rgba(255,255,255,0.9)", fontSize: "1rem", marginBottom: 6 }}>{profile.displayName}</div>
              )}
              {profile.bio && (
                <p style={{ fontFamily: "'Special Elite',serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", lineHeight: 1.6, maxWidth: 500, marginBottom: 8 }}>{profile.bio}</p>
              )}
              {/* Snap ID */}
              {profile.snapId && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.3)", border: "2px solid #C8952A", padding: "3px 12px", marginBottom: 8 }}>
                  <span style={{ fontSize: "0.9rem" }}>⚡</span>
                  <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, color: "#C8952A", fontSize: "0.85rem", letterSpacing: 1 }}>SNAP ID:</span>
                  <span style={{ fontFamily: "'Special Elite',serif", color: "white", fontSize: "0.85rem" }}>{profile.snapId}</span>
                </div>
              )}
              {/* Social links */}
              {(profile.twitter || profile.discord || profile.twitch || profile.youtube) && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                  {[
                    { key: profile.twitter,  icon: "🐦", label: "Twitter",  url: `https://x.com/${profile.twitter}`             },
                    { key: profile.discord,  icon: "💬", label: "Discord",  url: `https://discord.gg/${profile.discord}`         },
                    { key: profile.twitch,   icon: "🟣", label: "Twitch",   url: `https://twitch.tv/${profile.twitch}`           },
                    { key: profile.youtube,  icon: "▶️",  label: "YouTube",  url: `https://youtube.com/${profile.youtube}`        },
                  ].filter(s => s.key).map(s => (
                    <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                      style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(0,0,0,0.3)", border: "2px solid rgba(255,255,255,0.2)", padding: "4px 12px", textDecoration: "none", transition: "border-color 0.1s" }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = "#C8952A")}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}>
                      <span style={{ fontSize: "0.85rem" }}>{s.icon}</span>
                      <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, color: "white", fontSize: "0.8rem" }}>@{s.key}</span>
                    </a>
                  ))}
                </div>
              )}
              <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", letterSpacing: 2 }}>
                MEMBER SINCE {joinDate(profile.createdAt).toUpperCase()}
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
              {[
                [String(profile._count.clips),     "CLIPS",     "#C8952A"],
                [fmt(follCount),                   "FOLLOWERS", "#4A3DC8"],
                [String(profile._count.following), "FOLLOWING", "#8B2035"],
              ].map(([v, l, bg]) => (
                <div key={l} style={{ border: "4px solid #111", background: "rgba(0,0,0,0.3)", padding: "12px 16px", textAlign: "center", boxShadow: "4px 4px 0 #111", minWidth: 80 }}>
                  <div className="spidey" style={{ color: bg as string, fontSize: "1.8rem" }}>{v}</div>
                  <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.65rem", color: "rgba(255,255,255,0.7)", letterSpacing: 2, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RED BAND */}
      <div style={{ background: "#8B2035", borderBottom: "3px solid #111", padding: "7px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="spidey" style={{ color: "white", fontSize: "0.9rem" }}>SNAP FURY CREATOR PROFILE</span>
        <span style={{ fontFamily: "'Special Elite',serif", color: "rgba(255,255,255,0.7)", fontSize: "0.75rem", letterSpacing: 2 }}>★ SPECIAL EDITION ★</span>
        <span className="spidey" style={{ color: "#C8952A", fontSize: "0.9rem" }}>{profile._count.clips} CLIPS UPLOADED</span>
      </div>

      {/* MAIN */}
      <div className="newsprint" style={{ flex: 1, padding: "28px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>

          {/* Own profile actions */}
          {isOwn && (
            <div className="snap-in" style={{ display: "flex", gap: 14, marginBottom: 24, padding: "16px 20px", border: "4px solid #111", background: "#f8f0d8", boxShadow: "6px 6px 0 #111", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.9rem", color: "#555", flex: 1 }}>Welcome back! Ready to drop another snap?</span>
              <Link href="/upload">
                <button className="btn" style={{ background: "#4A3DC8", color: "white", padding: "10px 24px", fontSize: "1.1rem", boxShadow: "4px 4px 0 #111", borderRadius: 3 }}>⬆ UPLOAD NEW SNAP</button>
              </Link>
              <Link href="/profile/edit">
                <button className="btn" style={{ background: "#C8952A", color: "#111", padding: "10px 20px", fontSize: "1rem", boxShadow: "3px 3px 0 #111", borderRadius: 3 }}>✏️ EDIT PROFILE</button>
              </Link>

            </div>
          )}

          {/* Tabs */}
          <div style={{ display: "flex", marginBottom: 24, maxWidth: 400 }}>
            <button className={`tab-btn ${tab === "clips" ? "tab-active" : "tab-idle"}`}
              onClick={() => setTab("clips")} style={{ borderRight: "none", borderRadius: "3px 0 0 3px" }}>
              🎬 CLIPS ({profile._count.clips})
            </button>
            <button className={`tab-btn ${tab === "saved" ? "tab-active" : "tab-idle"}`}
              onClick={() => setTab("saved")} style={{ borderLeft: "2px solid #111", borderRadius: "0 3px 3px 0" }}>
              ★ SAVED
            </button>
          </div>

          {/* CLIPS GRID */}
          {tab === "clips" && (
            profile.clips.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", border: "4px dashed #ccc" }}>
                <div className="spidey" style={{ color: "#ccc", fontSize: "2rem", display: "block", marginBottom: 8 }}>NO SNAPS YET!</div>
                <p style={{ fontFamily: "'Special Elite',serif", color: "#aaa", marginBottom: isOwn ? 20 : 0 }}>
                  {isOwn ? "You haven't uploaded any clips yet." : `@${profile.username} hasn't uploaded any clips yet.`}
                </p>
                {isOwn && (
                  <Link href="/upload">
                    <button className="btn" style={{ background: "#4A3DC8", color: "white", padding: "10px 24px", fontSize: "1.1rem", boxShadow: "4px 4px 0 #111", borderRadius: 3, marginTop: 12 }}>⬆ UPLOAD YOUR FIRST SNAP</button>
                  </Link>
                )}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 22 }}>
                {profile.clips.map((clip, i) => (
                  <Link key={clip.id} href={`/clips/${clip.id}`} className="clip-card"
                    style={{ transform: `rotate(${i % 2 === 0 ? "-0.5deg" : "0.5deg"})` }}>
                    {/* Thumbnail */}
                    <div style={{ height: 155, background: `linear-gradient(${BG_GRADIENTS[i % 6]})`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                      <div className="halftone" style={{ position: "absolute", inset: 0, opacity: 0.2 }} />
                      {clip.tags[0] && (
                        <div style={{ position: "absolute", top: 8, left: 8 }}>
                          <span className="tag-badge" style={{ background: ["#C8952A", "#4A3DC8", "#8B2035"][i % 3], transform: "rotate(-3deg)" }}>{clip.tags[0].tag}</span>
                        </div>
                      )}
                      <div style={{ width: 44, height: 44, background: "#C8952A", border: "3px solid #111", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "3px 3px 0 #111", zIndex: 2 }}>
                        <span style={{ fontSize: "1.1rem", marginLeft: 3 }}>▶</span>
                      </div>
                    </div>
                    {/* Info */}
                    <div style={{ padding: "12px 14px", borderTop: "3px solid #111" }}>
                      <div className="spidey" style={{ fontSize: "1rem", color: "#111", display: "block", marginBottom: 6 }}>{clip.title}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: 12 }}>
                          <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.78rem", color: "#888" }}>❤️ {clip._count.likes}</span>
                          <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.78rem", color: "#888" }}>👁 {fmt(clip.views)}</span>
                        </div>
                        <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.72rem", color: "#aaa" }}>
                          {new Date(clip.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )
          )}

          {/* SAVED TAB */}
          {tab === "saved" && (
            <div style={{ textAlign: "center", padding: "60px 20px", border: "4px dashed #ccc" }}>
              <div className="spidey" style={{ color: "#ccc", fontSize: "2rem", display: "block", marginBottom: 8 }}>COMING SOON!</div>
              <p style={{ fontFamily: "'Special Elite',serif", color: "#aaa" }}>Saved clips feature coming in the next update.</p>
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
