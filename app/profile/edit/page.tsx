"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

type ProfileData = {
  username: string;
  email: string;
  displayName: string | null;
  bio: string | null;
  snapId: string | null;
  twitter: string | null;
  discord: string | null;
  twitch: string | null;
  youtube: string | null;
};

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form,    setForm]    = useState<Partial<ProfileData>>({});
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (status === "unauthenticated") { router.replace("/signin"); return; }
    if (status === "authenticated") {
      fetch("/api/profile")
        .then(r => r.json())
        .then((data: ProfileData) => { setForm(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [status, router]);

  const handleSave = async () => {
    setSaving(true); setError(""); setSaved(false);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: form.displayName,
        bio:         form.bio,
        snapId:      form.snapId,
        twitter:     form.twitter,
        discord:     form.discord,
        twitch:      form.twitch,
        youtube:     form.youtube,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      const d = await res.json();
      // d.error can be a string or a Zod error object — always stringify safely
      const msg = typeof d.error === "string"
        ? d.error
        : d.error?.fieldErrors
          ? Object.entries(d.error.fieldErrors).map(([k, v]) => `${k}: ${(v as string[]).join(", ")}`).join(" · ")
          : "Something went wrong. Please try again.";
      setError(msg);
    }
  };

  if (status === "loading" || loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f0e6c8" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Anton&display=swap'); @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}`}</style>
      <div style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", fontSize: "3rem", color: "#4A3DC8", animation: "pulse 1s infinite", letterSpacing: 3 }}>LOADING...</div>
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
        .snap-input { width: 100%; border: 3px solid #111; background: #fdf8ec; font-family: 'Special Elite', serif; font-size: 1rem; padding: 11px 14px; outline: none; box-shadow: 3px 3px 0 #111; transition: box-shadow 0.1s, transform 0.1s; color: #111; }
        .snap-input:focus { box-shadow: 5px 5px 0 #4A3DC8; transform: translate(-1px,-1px); }
        .snap-input::placeholder { color: #aaa; }
        .snap-input:disabled { background: #f0e6c8; color: #888; cursor: not-allowed; box-shadow: none; }
        .snap-label { font-family: 'Anton', sans-serif; font-style: italic; font-size: 0.9rem; letter-spacing: 2px; color: #111; margin-bottom: 6px; display: block; transform: skewX(-4deg); }
        .snap-hint  { font-family: 'Special Elite', serif; font-size: 0.75rem; color: #888; margin-top: 4px; }
        .btn { font-family: 'Anton', sans-serif; font-style: italic; letter-spacing: 2px; border: 3px solid #111; cursor: pointer; text-transform: uppercase; transition: transform 0.1s, box-shadow 0.1s; }
        .btn:hover  { transform: translate(-2px,-2px); }
        .btn:active { transform: translate(2px,2px); }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }
        .section-divider { height: 7px; background: linear-gradient(#111 2px, transparent 2px, transparent 4px, #111 4px); margin: 24px 0 20px; }
        @keyframes slideIn { from{transform:translateY(-10px);opacity:0;} to{transform:translateY(0);opacity:1;} }
        .slide-in { animation: slideIn 0.3s ease forwards; }
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
          <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.75rem", letterSpacing: 3, color: "#555" }}>"IDENTITY FILE UPDATE" · SNAPPER BUREAU</div>
        </div>
        <div style={{ background: "#8B2035", padding: "7px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "3px solid #111" }}>
          <span className="spidey" style={{ color: "white", fontSize: "0.9rem" }}>UPDATING IDENTITY FILE FOR @{session?.user?.username}</span>
          <span style={{ fontFamily: "'Special Elite',serif", color: "rgba(255,255,255,0.8)", fontSize: "0.75rem", letterSpacing: 2 }}>★ COLLECTOR'S SPECIAL EDITION ★</span>
          <span className="spidey" style={{ color: "#C8952A", fontSize: "0.9rem" }}>ISSUE #001</span>
        </div>
      </div>

      {/* MAIN */}
      <div className="newsprint" style={{ flex: 1, padding: "36px 28px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>

          {/* Page title */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div className="spidey-lg" style={{ fontSize: "clamp(2rem,4vw,3.5rem)", color: "#4A3DC8", display: "block" }}>EDIT YOUR PROFILE</div>
            <div style={{ fontFamily: "'Special Elite',serif", color: "#666", fontSize: "0.9rem", marginTop: 8, letterSpacing: 2 }}>
              Update your identity file — show the community who you are
            </div>
          </div>

          {/* Save success banner */}
          {saved && (
            <div className="slide-in" style={{ background: "#2a6e2a", border: "3px solid #111", padding: "12px 20px", marginBottom: 20, boxShadow: "4px 4px 0 #111", display: "flex", alignItems: "center", gap: 12 }}>
              <div className="starburst" style={{ width: 36, height: 36, background: "#C8952A", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#111", fontSize: "1rem" }}>✓</span>
              </div>
              <span className="spidey" style={{ color: "white", fontSize: "1.1rem" }}>PROFILE UPDATED!</span>
              <span style={{ fontFamily: "'Special Elite',serif", color: "rgba(255,255,255,0.8)", fontSize: "0.85rem" }}>Your identity file has been saved.</span>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div style={{ background: "#fff0f0", border: "3px solid #8B2035", padding: "12px 20px", marginBottom: 20, boxShadow: "3px 3px 0 #8B2035", fontFamily: "'Special Elite',serif", fontSize: "0.9rem", color: "#8B2035" }}>
              ⚠️ {error}
            </div>
          )}

          {/* FORM */}
          <div className="panel">
            {/* Panel header */}
            <div style={{ background: "#4A3DC8", borderBottom: "4px solid #111", padding: "8px 20px", display: "flex", justifyContent: "space-between" }}>
              <span className="spidey" style={{ color: "#C8952A", fontSize: "1rem" }}>★ IDENTITY FILE — @{session?.user?.username}</span>
              <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>CLASSIFIED LEVEL: YOU</span>
            </div>

            <div style={{ padding: "28px 28px" }}>

              {/* ── SECTION: BASIC INFO ── */}
              <div style={{ marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ background: "#4A3DC8", padding: "4px 14px", border: "2px solid #111", boxShadow: "3px 3px 0 #111" }}>
                    <span className="spidey" style={{ color: "#C8952A", fontSize: "0.9rem" }}>BASIC INFO</span>
                  </div>
                  <div style={{ flex: 1, height: 2, background: "repeating-linear-gradient(90deg,#111 0,#111 8px,transparent 8px,transparent 16px)" }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  {/* Username - readonly */}
                  <div>
                    <label className="snap-label">USERNAME <span style={{ color: "#888", fontSize: "0.7rem", fontStyle: "normal", transform: "none", display: "inline-block", letterSpacing: 0 }}>(cannot change)</span></label>
                    <input className="snap-input" type="text" value={form.username ?? ""} disabled />
                    <div className="snap-hint">Your unique SnapFury handle</div>
                  </div>

                  {/* Display name */}
                  <div>
                    <label className="snap-label">DISPLAY NAME</label>
                    <input className="snap-input" type="text" placeholder="e.g. Fury The Snapper"
                      value={form.displayName ?? ""}
                      onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))} />
                    <div className="snap-hint">Your real or preferred name</div>
                  </div>

                  {/* Email - readonly */}
                  <div>
                    <label className="snap-label">EMAIL <span style={{ color: "#888", fontSize: "0.7rem", fontStyle: "normal", transform: "none", display: "inline-block", letterSpacing: 0 }}>(not shown publicly)</span></label>
                    <input className="snap-input" type="email" value={form.email ?? ""} disabled />
                    <div className="snap-hint">Used for account access only</div>
                  </div>

                  {/* Snap ID */}
                  <div>
                    <label className="snap-label">MARVEL SNAP ID</label>
                    <input className="snap-input" type="text" placeholder="e.g. FuryMSnap#1234"
                      value={form.snapId ?? ""}
                      onChange={e => setForm(f => ({ ...f, snapId: e.target.value }))} />
                    <div className="snap-hint">Your in-game Marvel Snap player ID</div>
                  </div>
                </div>

                {/* Bio */}
                <div style={{ marginTop: 20 }}>
                  <label className="snap-label">BIO</label>
                  <textarea className="snap-input" rows={3} placeholder="Tell the community about yourself and your Snap style..."
                    value={form.bio ?? ""}
                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                    style={{ resize: "none" }} />
                  <div className="snap-hint" style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Shown on your public profile</span>
                    <span style={{ color: (form.bio?.length ?? 0) > 280 ? "#8B2035" : "#aaa" }}>{form.bio?.length ?? 0}/300</span>
                  </div>
                </div>
              </div>

              {/* ── SECTION: SOCIALS ── */}
              <div className="section-divider" />

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ background: "#8B2035", padding: "4px 14px", border: "2px solid #111", boxShadow: "3px 3px 0 #111" }}>
                  <span className="spidey" style={{ color: "white", fontSize: "0.9rem" }}>SOCIAL LINKS</span>
                </div>
                <div style={{ flex: 1, height: 2, background: "repeating-linear-gradient(90deg,#111 0,#111 8px,transparent 8px,transparent 16px)" }} />
                <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.75rem", color: "#888" }}>All optional · shown on your profile</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {[
                  { key: "twitter",  label: "TWITTER / X",  icon: "🐦", placeholder: "yourhandle",   prefix: "x.com/"          },
                  { key: "discord",  label: "DISCORD",       icon: "💬", placeholder: "yourhandle",   prefix: "discord.gg/"     },
                  { key: "twitch",   label: "TWITCH",        icon: "🟣", placeholder: "yourchannel",  prefix: "twitch.tv/"      },
                  { key: "youtube",  label: "YOUTUBE",       icon: "▶️",  placeholder: "@yourchannel", prefix: "youtube.com/"    },
                ].map(field => (
                  <div key={field.key}>
                    <label className="snap-label">{field.icon} {field.label}</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ background: "#f0e6c8", border: "3px solid #111", borderRight: "none", padding: "11px 10px", fontFamily: "'Special Elite',serif", fontSize: "0.8rem", color: "#888", whiteSpace: "nowrap", flexShrink: 0 }}>
                        @
                      </div>
                      <input className="snap-input" type="text"
                        placeholder={field.placeholder}
                        value={(form as any)[field.key] ?? ""}
                        onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                        style={{ borderLeft: "none" }} />
                    </div>
                    <div className="snap-hint">{field.prefix}{(form as any)[field.key] || field.placeholder}</div>
                  </div>
                ))}
              </div>

              {/* ── SAVE BUTTONS ── */}
              <div className="section-divider" style={{ marginBottom: 20 }} />

              <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
                <button className="btn" onClick={handleSave} disabled={saving}
                  style={{ background: saved ? "#2a6e2a" : "#4A3DC8", color: "white", padding: "14px 40px", fontSize: "1.4rem", boxShadow: "5px 5px 0 #111", borderRadius: 3, flex: "0 0 auto" }}>
                  {saving ? "SAVING..." : saved ? "✓ SAVED!" : "💾 SAVE CHANGES"}
                </button>
                <Link href={`/profile/${session?.user?.username}`}>
                  <button className="btn" style={{ background: "#f0e6c8", color: "#111", padding: "14px 28px", fontSize: "1.2rem", boxShadow: "4px 4px 0 #111", borderRadius: 3 }}>
                    ← VIEW PROFILE
                  </button>
                </Link>
                <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.8rem", color: "#aaa", marginLeft: 4 }}>
                  Changes are visible immediately on your profile
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: "#111", borderTop: "4px solid #C8952A", padding: "12px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo.jpg" alt="sf" style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid #C8952A", objectFit: "cover" }} />
          <span className="spidey" style={{ color: "#C8952A", fontSize: "1rem" }}>SNAP FURY</span>
        </div>
        <span style={{ fontFamily: "'Special Elite',serif", color: "#444", fontSize: "0.75rem" }}>© 2025 SnapFury · Not affiliated with Marvel or Second Dinner</span>
      </footer>
    </div>
  );
}
