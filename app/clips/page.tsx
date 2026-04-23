"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

type Clip = {
  id: string;
  title: string;
  views: number;
  createdAt: string;
  user: { username: string; avatar: string | null };
  tags: { tag: string }[];
  _count: { likes: number; comments: number };
};

const SORT_OPTIONS = [
  { label: "LATEST",   value: "latest"   },
  { label: "TRENDING", value: "trending" },
  { label: "TOP RATED",value: "top"      },
];

const TAG_FILTERS = ["ALL", "4 CUBES", "8 CUBES", "SNAP & RETREAT"];
const BG_GRADIENTS = [
  "135deg,#1a1040,#4A3DC8", "135deg,#2d0a14,#8B2035",
  "135deg,#0a1a2d,#1a4d6e", "135deg,#1a0a30,#6b2fa0",
  "135deg,#1a1400,#6b5200", "135deg,#2d1a00,#8B5200",
];

export default function ClipsPage() {
  const [clips,   setClips]   = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort,    setSort]    = useState("latest");
  const [tag,     setTag]     = useState("ALL");
  const [search,  setSearch]  = useState("");
  const [query,   setQuery]   = useState("");
  const [page,    setPage]    = useState(1);
  const [total,   setTotal]   = useState(0);
  const LIMIT = 12;

  const fetchClips = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ sort, limit: String(LIMIT), page: String(page) });
    if (tag !== "ALL") params.set("tag", tag);
    if (query)         params.set("q",   query);
    fetch(`/api/clips?${params}`)
      .then(r => r.json())
      .then(d => { setClips(d.clips ?? []); setTotal(d.total ?? 0); setLoading(false); })
      .catch(() => setLoading(false));
  }, [sort, tag, page, query]);

  useEffect(() => { fetchClips(); }, [fetchClips]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [sort, tag, query]);

  const fmt = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + "K" : String(n);
  const pages = Math.ceil(total / LIMIT);

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
        .clip-card { border: 4px solid #111; box-shadow: 6px 6px 0 #111; background: white; cursor: pointer; overflow: hidden; transition: transform 0.15s, box-shadow 0.15s; text-decoration: none; display: block; }
        .clip-card:hover { transform: translate(-3px,-3px) rotate(-0.8deg); box-shadow: 9px 9px 0 #111; z-index: 5; }
        .filter-btn { font-family: 'Anton', sans-serif; font-style: italic; font-size: 0.85rem; letter-spacing: 1px; border: 2px solid #111; padding: 6px 14px; cursor: pointer; transition: all 0.15s; box-shadow: 3px 3px 0 #111; }
        .filter-on  { background: #4A3DC8; color: white; transform: translate(-1px,-1px); box-shadow: 4px 4px 0 #111; }
        .filter-off { background: #f8f0d8; color: #555; }
        .filter-off:hover { background: #e8ddb8; }
        .sort-btn   { font-family: 'Anton', sans-serif; font-style: italic; font-size: 0.9rem; letter-spacing: 1px; border: 2px solid #111; padding: 7px 16px; cursor: pointer; transition: all 0.15s; }
        .sort-on    { background: #8B2035; color: white; box-shadow: 3px 3px 0 #111; transform: translate(-1px,-1px); }
        .sort-off   { background: #f8f0d8; color: #555; }
        .sort-off:hover { background: #e8ddb8; }
        .search-input { font-family: 'Special Elite', serif; font-size: 1rem; border: 3px solid #111; background: #fdf8ec; padding: 10px 16px; outline: none; box-shadow: 3px 3px 0 #111; color: #111; transition: box-shadow 0.1s; width: 100%; }
        .search-input:focus { box-shadow: 5px 5px 0 #4A3DC8; }
        .search-input::placeholder { color: #aaa; }
        .tag-badge { font-family: 'Anton', sans-serif; font-style: italic; font-size: 0.78rem; border: 2px solid #111; padding: 2px 8px; display: inline-block; box-shadow: 2px 2px 0 #111; color: white; }
        .page-btn  { font-family: 'Anton', sans-serif; font-style: italic; font-size: 1rem; letter-spacing: 1px; border: 3px solid #111; padding: 8px 18px; cursor: pointer; transition: all 0.1s; }
        .page-active { background: #4A3DC8; color: white; box-shadow: 3px 3px 0 #111; transform: translate(-1px,-1px); }
        .page-idle   { background: #f8f0d8; color: #555; }
        .page-idle:hover { background: #e8ddb8; }
        .skeleton { background: linear-gradient(90deg,#e8ddb8 25%,#f5f0e0 50%,#e8ddb8 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
        @keyframes shimmer { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
      `}</style>

      <Navbar />

      {/* MASTHEAD */}
      <div style={{ borderBottom: "5px solid #111" }}>
        <div style={{ background: "#111", padding: "5px 32px", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'Special Elite',serif", color: "#C8952A", fontSize: "0.7rem", letterSpacing: 2 }}>EST. 2025 · MARVEL SNAP'S PREMIER CLIP COMMUNITY</span>
          <span style={{ fontFamily: "'Special Elite',serif", color: "#888", fontSize: "0.7rem" }}>COLLECTOR'S SPECIAL EDITION · ISSUE #001</span>
          <span style={{ fontFamily: "'Special Elite',serif", color: "#C8952A", fontSize: "0.7rem", letterSpacing: 2 }}>FREE · SNAPFURY.COM</span>
        </div>
        <div style={{ padding: "10px 32px 8px", textAlign: "center", background: "white", borderBottom: "3px solid #111" }}>
          <div className="spidey-lg" style={{ fontSize: "clamp(2rem,5vw,4rem)", color: "#C8952A", display: "block" }}>SNAP FURY</div>
          <div style={{ height: 5, background: "linear-gradient(#111 2px,transparent 2px,transparent 3px,#111 3px)", maxWidth: 400, margin: "5px auto" }} />
          <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.75rem", letterSpacing: 3, color: "#555" }}>"ALL THE SNAPS FIT TO PRINT" · CLIP ARCHIVE</div>
        </div>
        <div style={{ background: "#8B2035", padding: "7px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "3px solid #111" }}>
          <span className="spidey" style={{ color: "white", fontSize: "0.9rem" }}>BROWSING ALL COMMUNITY SNAPS</span>
          <span style={{ fontFamily: "'Special Elite',serif", color: "rgba(255,255,255,0.8)", fontSize: "0.75rem", letterSpacing: 2 }}>★ COLLECTOR'S SPECIAL EDITION ★</span>
          <span className="spidey" style={{ color: "#C8952A", fontSize: "0.9rem" }}>{total > 0 ? `${total} CLIPS` : "LOADING..."}</span>
        </div>
      </div>

      {/* MAIN */}
      <div className="newsprint" style={{ flex: 1, padding: "28px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>

          {/* FILTER BAR */}
          <div className="panel" style={{ marginBottom: 28, transform: "rotate(-0.2deg)" }}>
            <div style={{ background: "#4A3DC8", borderBottom: "3px solid #111", padding: "7px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="spidey" style={{ color: "#C8952A", fontSize: "0.95rem" }}>★ FILTER THE FURY</span>
              <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>{total} results</span>
            </div>
            <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Search */}
              <div style={{ display: "flex", gap: 10 }}>
                <input className="search-input" placeholder="🔍  Search clips, players, tags..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") setQuery(search); }}
                  style={{ flex: 1 }} />
                <button className="btn" onClick={() => setQuery(search)}
                  style={{ background: "#4A3DC8", color: "white", padding: "10px 20px", fontSize: "1rem", boxShadow: "4px 4px 0 #111", borderRadius: 3, flexShrink: 0 }}>
                  SEARCH
                </button>
                {query && (
                  <button className="btn" onClick={() => { setSearch(""); setQuery(""); }}
                    style={{ background: "#f0e6c8", color: "#111", padding: "10px 16px", fontSize: "1rem", boxShadow: "3px 3px 0 #111", borderRadius: 3, flexShrink: 0 }}>
                    ✕ CLEAR
                  </button>
                )}
              </div>

              {/* Sort + Tags row */}
              <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 0 }}>
                  {SORT_OPTIONS.map((s, i) => (
                    <button key={s.value} className={`sort-btn ${sort === s.value ? "sort-on" : "sort-off"}`}
                      onClick={() => setSort(s.value)}
                      style={{ border: "2px solid #111", borderRight: i < SORT_OPTIONS.length - 1 ? "none" : "2px solid #111", borderRadius: i === 0 ? "3px 0 0 3px" : i === SORT_OPTIONS.length - 1 ? "0 3px 3px 0" : "0" }}>
                      {s.label}
                    </button>
                  ))}
                </div>

                <div style={{ width: 1, height: 32, background: "#ccc" }} />

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {TAG_FILTERS.map(t => (
                    <button key={t} className={`filter-btn ${tag === t ? "filter-on" : "filter-off"}`} onClick={() => setTag(t)}>{t}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RESULTS HEADLINE */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ height: 7, background: "linear-gradient(#111 2px,transparent 2px,transparent 4px,#111 4px)" }} />
            <div style={{ background: "#f8f0d8", borderBottom: "3px solid #111", padding: "7px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="spidey" style={{ color: "#111", fontSize: "1.2rem" }}>
                {query ? `RESULTS FOR "${query.toUpperCase()}"` : tag !== "ALL" ? `${tag} CLIPS` : `${sort.toUpperCase()} SNAPS`}
              </span>
              <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.8rem", color: "#888" }}>
                {total} clips · page {page} of {pages || 1}
              </span>
            </div>
            <div style={{ height: 7, background: "linear-gradient(#111 2px,transparent 2px,transparent 4px,#111 4px)" }} />
          </div>

          {/* CLIPS GRID */}
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 260, border: "4px solid #ddd" }} />
              ))}
            </div>
          ) : clips.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px", border: "4px dashed #ccc" }}>
              <div className="spidey" style={{ color: "#ccc", fontSize: "2.5rem", display: "block", marginBottom: 10 }}>NO SNAPS FOUND!</div>
              <p style={{ fontFamily: "'Special Elite',serif", color: "#aaa", marginBottom: 20 }}>
                {query ? `No clips matched "${query}". Try a different search.` : "No clips here yet. Be the first to upload!"}
              </p>
              <Link href="/upload">
                <button className="btn" style={{ background: "#4A3DC8", color: "white", padding: "10px 24px", fontSize: "1.1rem", boxShadow: "4px 4px 0 #111", borderRadius: 3 }}>⬆ UPLOAD A SNAP</button>
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
              {clips.map((clip, i) => (
                <Link key={clip.id} href={`/clips/${clip.id}`} className="clip-card"
                  style={{ transform: `rotate(${i % 2 === 0 ? "-0.5deg" : "0.5deg"})` }}>
                  <div style={{ height: 165, background: `linear-gradient(${BG_GRADIENTS[i % 6]})`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    <div className="halftone" style={{ position: "absolute", inset: 0, opacity: 0.2 }} />
                    {clip.tags[0] && (
                      <div style={{ position: "absolute", top: 8, left: 8 }}>
                        <span className="tag-badge" style={{ background: ["#C8952A","#4A3DC8","#8B2035"][i%3], transform: "rotate(-3deg)" }}>{clip.tags[0].tag}</span>
                      </div>
                    )}
                    <div style={{ width: 50, height: 50, background: "#C8952A", border: "3px solid #111", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "3px 3px 0 #111", zIndex: 2 }}>
                      <span style={{ fontSize: "1.3rem", marginLeft: 3 }}>▶</span>
                    </div>
                    <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.6)", padding: "2px 8px", fontFamily: "'Special Elite',serif", fontSize: "0.75rem", color: "white" }}>
                      👁 {fmt(clip.views)}
                    </div>
                  </div>
                  <div style={{ padding: "12px 14px", borderTop: "3px solid #111" }}>
                    <div className="spidey" style={{ fontSize: "1.05rem", color: "#111", marginBottom: 6, display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{clip.title}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Link href={`/profile/${clip.user.username}`} onClick={e => e.stopPropagation()}
                        style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, color: "#4A3DC8", fontSize: "0.85rem", textDecoration: "none" }}>
                        @{clip.user.username}
                      </Link>
                      <div style={{ display: "flex", gap: 10 }}>
                        <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.8rem", color: "#888" }}>❤️ {clip._count.likes}</span>
                        <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.8rem", color: "#888" }}>💬 {clip._count.comments}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {pages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 32, flexWrap: "wrap" }}>
              <button className="page-btn page-idle" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={{ opacity: page === 1 ? 0.4 : 1 }}>← PREV</button>
              {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
                const p = pages <= 7 ? i + 1 : page <= 4 ? i + 1 : page >= pages - 3 ? pages - 6 + i : page - 3 + i;
                return (
                  <button key={p} className={`page-btn ${page === p ? "page-active" : "page-idle"}`} onClick={() => setPage(p)}>{p}</button>
                );
              })}
              <button className="page-btn page-idle" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                style={{ opacity: page === pages ? 0.4 : 1 }}>NEXT →</button>
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
