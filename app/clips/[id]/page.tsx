"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

type Clip = {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  views: number;
  visibility: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    avatar: string | null;
    bio: string | null;
    _count: { followers: number; clips: number };
  };
  tags: { tag: string }[];
  comments: {
    id: string;
    text: string;
    createdAt: string;
    user: { id: string; username: string; avatar: string | null };
  }[];
  _count: { likes: number; comments: number; saves: number };
};

const BG_GRADIENTS = [
  "135deg,#1a1040,#4A3DC8",
  "135deg,#2d0a14,#8B2035",
  "135deg,#0a1a2d,#1a4d6e",
  "135deg,#1a0a30,#6b2fa0",
];

export default function ClipDetailPage() {
  const { id }              = useParams<{ id: string }>();
  const { data: session }   = useSession();
  const router              = useRouter();

  const [clip,      setClip]      = useState<Clip | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [notFound,  setNotFound]  = useState(false);
  const [liked,     setLiked]     = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [likes,     setLikes]     = useState(0);
  const [playing,   setPlaying]   = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [comment,   setComment]   = useState("");
  const [comments,  setComments]  = useState<Clip["comments"]>([]);
  const [posting,   setPosting]   = useState(false);
  const [showPow,   setShowPow]   = useState(false);
  const [copied,    setCopied]    = useState(false);
  const [related,   setRelated]   = useState<Clip[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef    = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/clips/${id}`)
      .then(r => { if (!r.ok) throw new Error("not found"); return r.json(); })
      .then((data: Clip) => {
        setClip(data);
        setLikes(data._count.likes);
        setComments(data.comments);
        setLoading(false);
        // Fetch related clips
        return fetch(`/api/clips?limit=4&sort=trending`);
      })
      .then(r => r?.json())
      .then(d => setRelated((d?.clips ?? []).filter((c: Clip) => c.id !== id).slice(0, 4)))
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [id]);

  const togglePlay = () => {
    const vid = videoRef.current;
    if (vid) {
      if (playing) { vid.pause(); clearInterval(intervalRef.current!); }
      else {
        vid.play().catch(() => {});
        intervalRef.current = setInterval(() => {
          if (!vid.duration) return;
          setProgress((vid.currentTime / vid.duration) * 100);
          if (vid.ended) { setPlaying(false); setProgress(0); clearInterval(intervalRef.current!); }
        }, 100);
      }
      setPlaying(p => !p);
    } else {
      // fallback for mock
      if (playing) { clearInterval(intervalRef.current!); setPlaying(false); }
      else {
        setPlaying(true);
        intervalRef.current = setInterval(() => setProgress(p => { if (p >= 100) { clearInterval(intervalRef.current!); setPlaying(false); return 0; } return p + 0.5; }), 100);
      }
    }
  };

  useEffect(() => () => clearInterval(intervalRef.current!), []);

  const handleLike = async () => {
    if (!session) { router.push("/signin"); return; }
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikes(n => wasLiked ? n - 1 : n + 1);
    if (!wasLiked) { setShowPow(true); setTimeout(() => setShowPow(false), 900); }
    await fetch(`/api/clips/${id}/like`, { method: "POST" });
  };

  const handleComment = async () => {
    if (!session) { router.push("/signin"); return; }
    if (!comment.trim()) return;
    setPosting(true);
    const res = await fetch(`/api/clips/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: comment }),
    });
    if (res.ok) {
      const newComment = await res.json();
      setComments(c => [newComment, ...c]);
      setComment("");
    }
    setPosting(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fmt     = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + "K" : String(n);
  const timeAgo = (d: string) => {
    const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
    if (s < 60)   return "just now";
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400)return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f0e6c8" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
      `}</style>
      <div style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", fontSize: "3rem", color: "#4A3DC8", animation: "pulse 1s infinite", letterSpacing: 3 }}>
        LOADING...
      </div>
    </div>
  );

  if (notFound) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f0e6c8", gap: 20 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Anton&family=Special+Elite&display=swap');`}</style>
      <div style={{ border: "5px solid #111", boxShadow: "10px 10px 0 #111", background: "white", padding: "40px 48px", textAlign: "center", maxWidth: 400 }}>
        <div style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", fontSize: "5rem", color: "#8B2035", lineHeight: 1 }}>404</div>
        <div style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", fontSize: "2rem", color: "#111", marginBottom: 12 }}>SNAP NOT FOUND!</div>
        <p style={{ fontFamily: "'Special Elite',serif", color: "#666", marginBottom: 24 }}>This clip may have been deleted or never existed.</p>
        <Link href="/"><button style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", background: "#4A3DC8", color: "white", border: "3px solid #111", padding: "10px 28px", fontSize: "1.2rem", cursor: "pointer", boxShadow: "4px 4px 0 #111" }}>← GO HOME</button></Link>
      </div>
    </div>
  );

  if (!clip) return null;

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
        .btn       { font-family: 'Anton', sans-serif; font-style: italic; letter-spacing: 1px; border: 3px solid #111; cursor: pointer; text-transform: uppercase; transition: transform 0.12s, box-shadow 0.12s; }
        .btn:hover { transform: translate(-2px,-2px); }
        .btn:active{ transform: translate(2px,2px); }
        .nav-item  { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 1rem; letter-spacing: 2px; color: #C8952A; text-transform: uppercase; transition: color 0.1s; text-decoration: none; }
        .nav-item:hover { color: white; }
        .prog-track { height: 8px; background: #222; cursor: pointer; position: relative; }
        .prog-fill  { height: 100%; background: repeating-linear-gradient(90deg,#C8952A 0,#C8952A 8px,#d4a530 8px,#d4a530 16px); transition: width 0.1s linear; }
        .prog-thumb { position: absolute; top: 50%; width: 14px; height: 14px; background: #C8952A; border: 2px solid #111; border-radius: 50%; transform: translate(-50%,-50%); box-shadow: 2px 2px 0 #111; }
        .ctrl-btn  { background: none; border: 2px solid #555; color: #C8952A; cursor: pointer; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; font-size: 1rem; transition: all 0.1s; flex-shrink: 0; }
        .ctrl-btn:hover { border-color: #C8952A; background: #1a1a1a; }
        .like-btn  { display: flex; align-items: center; gap: 8px; border: 3px solid #111; padding: 10px 18px; cursor: pointer; transition: transform 0.12s, box-shadow 0.12s; font-family: 'Anton', sans-serif; font-style: italic; font-size: 1rem; letter-spacing: 1px; }
        .like-btn:hover { transform: translate(-2px,-2px); }
        .like-liked   { background: #8B2035; color: white; box-shadow: 4px 4px 0 #111; }
        .like-unliked { background: white; color: #111; box-shadow: 4px 4px 0 #111; }
        .bubble-left  { background: white; border: 3px solid #111; border-radius: 0 16px 16px 16px; padding: 12px 14px; position: relative; box-shadow: 4px 4px 0 #111; max-width: 85%; }
        .bubble-left::before  { content:''; position:absolute; top:0; left:-14px; border-top:14px solid #111; border-left:14px solid transparent; }
        .bubble-left::after   { content:''; position:absolute; top:3px; left:-8px; border-top:10px solid white; border-left:10px solid transparent; }
        .bubble-right { background: #4A3DC8; border: 3px solid #111; border-radius: 16px 0 16px 16px; padding: 12px 14px; position: relative; box-shadow: 4px 4px 0 #111; max-width: 85%; margin-left: auto; }
        .bubble-right::before { content:''; position:absolute; top:0; right:-14px; border-top:14px solid #111; border-right:14px solid transparent; }
        .bubble-right::after  { content:''; position:absolute; top:3px; right:-8px; border-top:10px solid #4A3DC8; border-right:10px solid transparent; }
        .rel-clip { border: 3px solid #111; box-shadow: 5px 5px 0 #111; background: white; cursor: pointer; overflow: hidden; transition: transform 0.15s, box-shadow 0.15s; display: flex; text-decoration: none; }
        .rel-clip:hover { transform: translate(-3px,-3px); box-shadow: 8px 8px 0 #111; }
        .snap-input { width: 100%; border: 3px solid #111; background: #fdf8ec; font-family: 'Special Elite', serif; font-size: 0.95rem; padding: 10px 13px; outline: none; box-shadow: 3px 3px 0 #111; transition: box-shadow 0.1s; color: #111; resize: none; }
        .snap-input:focus { box-shadow: 5px 5px 0 #4A3DC8; }
        .snap-input::placeholder { color: #aaa; }
        .tag-badge { font-family: 'Anton', sans-serif; font-style: italic; font-size: 0.82rem; border: 2px solid #111; padding: 3px 10px; display: inline-block; box-shadow: 2px 2px 0 #111; color: white; }
        @keyframes snapIn  { 0%{transform:scale(0.85) rotate(-3deg);opacity:0;} 70%{transform:scale(1.05);} 100%{transform:scale(1);opacity:1;} }
        @keyframes bob     { 0%,100%{transform:translateY(0) rotate(-1deg);} 50%{transform:translateY(-6px) rotate(1deg);} }
        @keyframes powPop  { 0%{transform:scale(0) rotate(-20deg);opacity:0;} 50%{transform:scale(1.3) rotate(5deg);opacity:1;} 100%{transform:scale(0) rotate(20deg);opacity:0;} }
        @keyframes slideUp { from{transform:translateY(16px);opacity:0;} to{transform:translateY(0);opacity:1;} }
        .snap-in  { animation: snapIn  0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .bob      { animation: bob     3.5s ease-in-out infinite; }
        .pow-pop  { animation: powPop  0.9s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .slide-up { animation: slideUp 0.35s ease forwards; }
      `}</style>

      <Navbar />

      {/* MASTHEAD STRIP */}
      <div style={{ background: "#8B2035", borderBottom: "3px solid #111", padding: "6px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="spidey" style={{ color: "white", fontSize: "0.9rem" }}>NOW PLAYING — {clip.title}</span>
        <span style={{ fontFamily: "'Special Elite',serif", color: "rgba(255,255,255,0.7)", fontSize: "0.75rem", letterSpacing: 2 }}>★ SNAP FURY · SPECIAL EDITION ★</span>
        <span className="spidey" style={{ color: "#C8952A", fontSize: "0.9rem" }}>👁 {fmt(clip.views)} VIEWS</span>
      </div>

      {/* MAIN */}
      <div className="newsprint" style={{ flex: 1, padding: "24px 28px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>

          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* VIDEO PLAYER */}
            <div className="panel snap-in" style={{ background: "#0d0920", transform: "rotate(-0.3deg)" }}>
              <div style={{ background: "#4A3DC8", borderBottom: "4px solid #111", padding: "7px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="spidey" style={{ color: "#C8952A", fontSize: "0.95rem" }}>★ NOW PLAYING</span>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  {clip.tags.slice(0, 2).map(t => (
                    <span key={t.tag} className="tag-badge" style={{ background: "#8B2035", transform: "rotate(-3deg)" }}>{t.tag}</span>
                  ))}
                </div>
              </div>

              {/* Video */}
              <div style={{ position: "relative", background: "#0d0920", cursor: "pointer" }} onClick={togglePlay}>
                <div className="halftone" style={{ position: "absolute", inset: 0, opacity: 0.1, zIndex: 1 }} />
                {clip.videoUrl && clip.videoUrl.includes("sample") ? (
                  /* Mock for seed data */
                  <div style={{ height: 400, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(${BG_GRADIENTS[0]})`, position: "relative" }}>
                    <div className="spidey-lg" style={{ fontSize: "2.5rem", color: "#C8952A", opacity: 0.2 }}>{clip.title}</div>
                  </div>
                ) : (
                  <video ref={videoRef} src={clip.videoUrl} style={{ width: "100%", maxHeight: 420, display: "block", background: "#000" }} />
                )}
                {!playing && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3 }}>
                    <div style={{ width: 72, height: 72, background: "#C8952A", border: "4px solid #111", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "5px 5px 0 #111" }}>
                      <span style={{ fontSize: "1.8rem", marginLeft: 5 }}>▶</span>
                    </div>
                  </div>
                )}
                {showPow && (
                  <div className="pow-pop starburst" style={{ position: "absolute", top: "15%", right: "12%", width: 90, height: 90, background: "#C8952A", border: "3px solid #111", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
                    <span className="spidey" style={{ color: "#111", fontSize: "1.2rem" }}>POW!</span>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div className="prog-track" onClick={e => { const r = e.currentTarget.getBoundingClientRect(); setProgress(((e.clientX - r.left) / r.width) * 100); }}>
                <div className="prog-fill" style={{ width: `${progress}%` }} />
                {progress > 0 && <div className="prog-thumb" style={{ left: `${progress}%` }} />}
              </div>

              {/* Controls */}
              <div style={{ background: "#111", padding: "10px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <button className="ctrl-btn" onClick={togglePlay}>{playing ? "⏸" : "▶"}</button>
                <button className="ctrl-btn" onClick={() => { setProgress(0); setPlaying(false); clearInterval(intervalRef.current!); }}>⏮</button>
                <div style={{ flex: 1, fontFamily: "'Special Elite',serif", fontSize: "0.8rem", color: "#888" }}>
                  {clip.title}
                </div>
                <button className="ctrl-btn" title="Volume (coming soon)" style={{ opacity: 0.5, cursor: "not-allowed" }}>🔊</button>
                <button className="ctrl-btn" title="Fullscreen (coming soon)" style={{ opacity: 0.5, cursor: "not-allowed" }}>⛶</button>
              </div>
            </div>

            {/* CLIP INFO */}
            <div className="panel" style={{ transform: "rotate(0.2deg)" }}>
              <div style={{ background: "#C8952A", borderBottom: "4px solid #111", padding: "7px 16px", display: "flex", justifyContent: "space-between" }}>
                <span className="spidey" style={{ color: "#111", fontSize: "0.95rem" }}>CLIP INTELLIGENCE REPORT</span>
                <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.75rem", color: "#111" }}>{timeAgo(clip.createdAt)}</span>
              </div>
              <div style={{ padding: "18px 20px" }}>
                <div className="spidey-lg" style={{ fontSize: "2.2rem", color: "#111", display: "block", marginBottom: 12 }}>{clip.title}</div>

                {/* Creator row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <Link href={`/profile/${clip.user.username}`} style={{ display: "flex", gap: 8, alignItems: "center", textDecoration: "none" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #4A3DC8", background: "#4A3DC8", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                        {clip.user.avatar
                          ? <img src={clip.user.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : <span style={{ fontFamily: "'Anton',sans-serif", color: "#C8952A", fontSize: "0.9rem", fontStyle: "italic" }}>{clip.user.username[0].toUpperCase()}</span>
                        }
                      </div>
                      <div>
                        <div className="spidey" style={{ color: "#4A3DC8", fontSize: "0.95rem" }}>@{clip.user.username}</div>
                        <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.7rem", color: "#888" }}>{clip.user._count.followers} followers</div>
                      </div>
                    </Link>
                    {session?.user?.id !== clip.user.id && session && (
                      <button className="btn" onClick={async () => { setFollowing(f => !f); await fetch(`/api/users/${clip.user.username}`, { method: "POST" }); }}
                        style={{ background: following ? "#f0e6c8" : "#4A3DC8", color: following ? "#111" : "white", padding: "6px 14px", fontSize: "0.85rem", boxShadow: "3px 3px 0 #111", borderRadius: 3 }}>
                        {following ? "✓ FOLLOWING" : "+ FOLLOW"}
                      </button>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 16 }}>
                    {[
                      [fmt(clip.views),         "VIEWS"],
                      [fmt(likes),              "LIKES"],
                      [String(comments.length), "COMMENTS"],
                    ].map(([v, l]) => (
                      <div key={l} style={{ textAlign: "center" }}>
                        <div className="spidey" style={{ color: "#111", fontSize: "1.2rem" }}>{v}</div>
                        <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.6rem", color: "#888", letterSpacing: 2 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ height: 3, background: "repeating-linear-gradient(90deg,#111 0,#111 8px,transparent 8px,transparent 16px)", marginBottom: 14 }} />

                {/* Tags */}
                {clip.tags.length > 0 && (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                    {clip.tags.map((t, i) => (
                      <span key={t.tag} className="tag-badge" style={{ background: ["#4A3DC8", "#8B2035", "#C8952A"][i % 3], transform: `rotate(${i % 2 === 0 ? "-2" : "2"}deg)` }}>{t.tag}</span>
                    ))}
                  </div>
                )}

                {/* Description */}
                {clip.description && (
                  <p style={{ fontFamily: "'Special Elite',serif", fontSize: "0.9rem", color: "#444", lineHeight: 1.8, marginBottom: 18 }}>{clip.description}</p>
                )}

                {/* Action buttons */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button className={`like-btn ${liked ? "like-liked" : "like-unliked"}`} onClick={handleLike}>
                    <span style={{ fontSize: "1.1rem" }}>{liked ? "❤️" : "🤍"}</span>
                    {liked ? "FURY'D!" : "FURY IT"} · {fmt(likes)}
                  </button>
                  <button className="btn" onClick={handleCopy}
                    style={{ background: copied ? "#2a6e2a" : "#f8f0d8", color: copied ? "white" : "#111", padding: "10px 16px", fontSize: "0.95rem", boxShadow: "4px 4px 0 #111", borderRadius: 3 }}>
                    {copied ? "✓ COPIED!" : "🔗 SHARE"}
                  </button>
                  <button className="btn" onClick={() => setSaved(s => !s)}
                    style={{ background: saved ? "#C8952A" : "#f8f0d8", color: "#111", padding: "10px 16px", fontSize: "0.95rem", boxShadow: "4px 4px 0 #111", borderRadius: 3 }}>
                    {saved ? "★ SAVED" : "☆ SAVE"}
                  </button>
                  {session?.user?.id === clip.user.id && (
                    <button className="btn" style={{ background: "#8B2035", color: "white", padding: "10px 16px", fontSize: "0.95rem", boxShadow: "4px 4px 0 #111", borderRadius: 3 }}>
                      ✏️ EDIT
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* COMMENTS */}
            <div className="panel" style={{ transform: "rotate(-0.2deg)" }}>
              <div style={{ background: "#111", borderBottom: "4px solid #111", padding: "7px 16px", display: "flex", justifyContent: "space-between" }}>
                <span className="spidey" style={{ color: "#C8952A", fontSize: "0.95rem" }}>💬 READER REACTIONS</span>
                <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.75rem", color: "#888" }}>{comments.length} COMMENTS</span>
              </div>

              {/* Comment input */}
              <div style={{ padding: "14px 18px", borderBottom: "3px solid #111", background: "#f8f0d8" }}>
                {session ? (
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #4A3DC8", background: "#4A3DC8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", color: "#C8952A", fontSize: "0.9rem" }}>{session.user.username?.[0]?.toUpperCase()}</span>
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                      <textarea className="snap-input" rows={2} placeholder="Add your reaction to the fury..."
                        value={comment} onChange={e => setComment(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleComment(); } }} />
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button className="btn" onClick={handleComment} disabled={!comment.trim() || posting}
                          style={{ background: comment.trim() ? "#4A3DC8" : "#ccc", color: "white", padding: "8px 18px", fontSize: "0.9rem", boxShadow: comment.trim() ? "4px 4px 0 #111" : "2px 2px 0 #999", borderRadius: 3, opacity: posting ? 0.7 : 1 }}>
                          {posting ? "POSTING..." : "POST ⚡"}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "8px 0" }}>
                    <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.9rem", color: "#666" }}>
                      <Link href="/signin" style={{ color: "#4A3DC8", fontFamily: "'Anton',sans-serif", fontStyle: "italic" }}>SIGN IN</Link> to join the conversation
                    </span>
                  </div>
                )}
              </div>

              {/* Comments list */}
              <div style={{ padding: "18px", display: "flex", flexDirection: "column", gap: 18 }}>
                {comments.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <div className="spidey" style={{ color: "#ccc", fontSize: "1.2rem", display: "block", marginBottom: 6 }}>NO REACTIONS YET!</div>
                    <div style={{ fontFamily: "'Special Elite',serif", color: "#aaa", fontSize: "0.85rem" }}>Be the first to react to this snap.</div>
                  </div>
                ) : comments.map((c, i) => {
                  const isOwn = c.user.id === session?.user?.id;
                  return (
                    <div key={c.id} className="slide-up" style={{ display: "flex", flexDirection: "column", gap: 5, animationDelay: `${i * 0.04}s` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: isOwn ? "flex-end" : "flex-start" }}>
                        <span className="spidey" style={{ color: "#4A3DC8", fontSize: "0.85rem" }}>{c.user.username}</span>
                        <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.7rem", color: "#aaa" }}>{timeAgo(c.createdAt)}</span>
                      </div>
                      <div className={isOwn ? "bubble-right" : "bubble-left"}>
                        <p style={{ fontFamily: "'Special Elite',serif", fontSize: "0.88rem", color: isOwn ? "white" : "#111", lineHeight: 1.6 }}>{c.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Creator card */}
            <div className="panel snap-in" style={{ background: "#f8f0d8", transform: "rotate(0.8deg)" }}>
              <div style={{ background: "#111", borderBottom: "3px solid #111", padding: "6px 14px", display: "flex", justifyContent: "space-between" }}>
                <span className="spidey" style={{ color: "#C8952A", fontSize: "0.9rem" }}>CREATOR FILE</span>
                <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.7rem", color: "#888" }}>PANEL #3</span>
              </div>
              <div style={{ padding: "18px 14px" }}>
                <div style={{ border: "4px double #111", outline: "2px solid #111", outlineOffset: 4, padding: "16px 12px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.65rem", letterSpacing: 4, color: "#666", marginBottom: 10 }}>★ SNAP FURY CREATOR ★</div>
                  <div style={{ width: 90, height: 90, borderRadius: "50%", border: "4px solid #C8952A", background: "#4A3DC8", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "5px 5px 0 #111", margin: "0 auto 12px", overflow: "hidden" }} className="bob">
                    {clip.user.avatar
                      ? <img src={clip.user.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <span style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", color: "#C8952A", fontSize: "2rem" }}>{clip.user.username[0].toUpperCase()}</span>
                    }
                  </div>
                  <div className="spidey-lg" style={{ fontSize: "1.6rem", color: "#4A3DC8", display: "block", marginBottom: 4 }}>@{clip.user.username}</div>
                  {clip.user.bio && <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.8rem", color: "#666", marginBottom: 14, lineHeight: 1.5 }}>{clip.user.bio}</div>}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                    {[
                      [String(clip.user._count.clips),     "CLIPS"],
                      [String(clip.user._count.followers), "FANS"],
                    ].map(([v, l]) => (
                      <div key={l} style={{ background: "white", border: "2px solid #111", padding: "6px 4px", boxShadow: "2px 2px 0 #111", textAlign: "center" }}>
                        <div className="spidey" style={{ color: "#4A3DC8", fontSize: "1.2rem" }}>{v}</div>
                        <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.6rem", color: "#888", letterSpacing: 1 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                  {session?.user?.id !== clip.user.id && session && (
                    <button className="btn" onClick={async () => { setFollowing(f => !f); await fetch(`/api/users/${clip.user.username}`, { method: "POST" }); }}
                      style={{ width: "100%", background: following ? "#f0e6c8" : "#4A3DC8", color: following ? "#111" : "white", padding: 10, fontSize: "0.95rem", boxShadow: "4px 4px 0 #111", borderRadius: 3 }}>
                      {following ? "✓ FOLLOWING" : "+ FOLLOW FURY"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Related clips */}
            {related.length > 0 && (
              <div className="panel" style={{ transform: "rotate(-0.6deg)" }}>
                <div style={{ background: "#8B2035", borderBottom: "3px solid #111", padding: "6px 14px", display: "flex", justifyContent: "space-between" }}>
                  <span className="spidey" style={{ color: "white", fontSize: "0.9rem" }}>MORE FURY</span>
                  <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.7rem", color: "rgba(255,255,255,0.7)" }}>PANEL #4</span>
                </div>
                <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                  {related.map((r, i) => (
                    <Link key={r.id} href={`/clips/${r.id}`} className="rel-clip"
                      style={{ transform: `rotate(${i % 2 === 0 ? "-0.5deg" : "0.5deg"})` }}>
                      <div style={{ width: 80, height: 64, background: `linear-gradient(${BG_GRADIENTS[i % 4]})`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRight: "3px solid #111", position: "relative", overflow: "hidden" }}>
                        <div className="halftone" style={{ position: "absolute", inset: 0, opacity: 0.15 }} />
                        <div style={{ width: 26, height: 26, background: "#C8952A", border: "2px solid #111", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
                          <span style={{ fontSize: "0.75rem", marginLeft: 2 }}>▶</span>
                        </div>
                      </div>
                      <div style={{ padding: "8px 10px", flex: 1, minWidth: 0 }}>
                        <div className="spidey" style={{ fontSize: "0.82rem", color: "#111", display: "block", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.title}</div>
                        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, color: "#4A3DC8", fontSize: "0.75rem" }}>@{r.user.username}</div>
                        <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                          <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.7rem", color: "#888" }}>👁 {fmt(r.views)}</span>
                          <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.7rem", color: "#888" }}>❤ {r._count.likes}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Share panel */}
            <div className="panel" style={{ background: "#4A3DC8", transform: "rotate(0.5deg)" }}>
              <div className="halftone" style={{ position: "absolute", inset: 0, opacity: 0.2 }} />
              <div style={{ padding: "16px", position: "relative", zIndex: 2, textAlign: "center" }}>
                <div className="spidey-lg" style={{ fontSize: "1.6rem", color: "#C8952A", display: "block", marginBottom: 8 }}>SPREAD THE FURY!</div>
                <p style={{ fontFamily: "'Special Elite',serif", color: "rgba(255,255,255,0.85)", fontSize: "0.82rem", lineHeight: 1.6, marginBottom: 12 }}>
                  Think this snap deserves a bigger audience?
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { label: copied ? "✓ COPIED!" : "📋 COPY LINK", bg: "white",   color: "#111",   onClick: handleCopy },
                    { label: "🐦 SHARE ON X",        bg: "#1DA1F2", color: "white", onClick: () => window.open(`https://twitter.com/intent/tweet?text=Check out this snap on SnapFury!&url=${encodeURIComponent(window.location.href)}`) },
                    { label: "💬 JOIN DISCORD",      bg: "#5865F2", color: "white", onClick: () => window.open("https://discord.gg/snapfury") },
                    { label: "💬 SEND TO DISCORD",   bg: "#5865F2", color: "white", onClick: () => {} },
                  ].map(b => (
                    <button key={b.label} className="btn" onClick={b.onClick}
                      style={{ width: "100%", background: b.bg, color: b.color, padding: 9, fontSize: "0.85rem", boxShadow: "3px 3px 0 #111", borderRadius: 3, borderColor: "#111" }}>
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: "#111", borderTop: "4px solid #C8952A", padding: "12px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, flexShrink: 0 }}>
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
