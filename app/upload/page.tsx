"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

const SNAP_TAGS = ["4 CUBES", "8 CUBES", "SNAP & RETREAT"];

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [step,       setStep]       = useState(1);
  const [dragging,   setDragging]   = useState(false);
  const [file,       setFile]       = useState<File | null>(null);
  const [preview,    setPreview]    = useState<string | null>(null);
  const [uploading,  setUploading]  = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [done,       setDone]       = useState(false);
  const [clipId,     setClipId]     = useState<string | null>(null);
  const [visibility, setVisibility] = useState("public");
  const [form,       setForm]       = useState({ title: "", description: "", tags: [] as string[], saveLocal: false, sotw: false });
  const [error,      setError]      = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Redirect if not signed in — wait 2.5s so user can read the message
  useEffect(() => {
    if (status === "unauthenticated") {
      const t = setTimeout(() => router.replace("/signin"), 2500);
      return () => clearTimeout(t);
    }
  }, [status, router]);

  if (status === "loading") return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f0e6c8", fontFamily: "'Anton',sans-serif", fontSize: "2rem", color: "#4A3DC8" }}>
      LOADING...
    </div>
  );

  if (status === "unauthenticated") return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f0e6c8", gap: 24, padding: 32 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Special+Elite&display=swap');
        .starburst { clip-path: polygon(50% 0%,56% 18%,73% 5%,65% 22%,85% 18%,73% 32%,95% 35%,78% 43%,95% 55%,76% 57%,88% 74%,70% 70%,72% 90%,58% 80%,50% 100%,42% 80%,28% 90%,30% 70%,12% 74%,24% 57%,5% 55%,22% 43%,5% 35%,27% 32%,15% 18%,35% 22%,27% 5%,44% 18%); }
        @keyframes popIn { 0%{transform:scale(0.8) rotate(-5deg);opacity:0;} 70%{transform:scale(1.06);} 100%{transform:scale(1);opacity:1;} }
        @keyframes countdown { from{width:100%;} to{width:0%;} }
        .countdown-bar { animation: countdown 2.5s linear forwards; }
        .pop-in { animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
      `}</style>

      {/* Panel */}
      <div className="pop-in" style={{ border: "5px solid #111", boxShadow: "10px 10px 0 #111", background: "white", maxWidth: 480, width: "100%", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ background: "#8B2035", borderBottom: "4px solid #111", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", color: "white", fontSize: "1.1rem", letterSpacing: 2, transform: "skewX(-6deg)", display: "inline-block" }}>★ IDENTITY CHECK FAILED ★</span>
          <div className="starburst" style={{ width: 40, height: 40, background: "#C8952A", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", color: "#111", fontSize: "0.65rem", textAlign: "center", lineHeight: 1 }}>HEY!</span>
          </div>
        </div>

        <div style={{ padding: "28px 28px 20px", textAlign: "center" }}>
          {/* Big lock icon */}
          <div style={{ fontSize: "4rem", marginBottom: 12 }}>🔒</div>

          <div style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", fontSize: "2rem", color: "#4A3DC8", transform: "skewX(-6deg)", display: "block", marginBottom: 8, letterSpacing: 1 }}>
            SNAPPERS ONLY!
          </div>
          <p style={{ fontFamily: "'Special Elite',serif", fontSize: "0.95rem", color: "#555", lineHeight: 1.7, marginBottom: 20 }}>
            You need to be signed in to upload clips.<br />
            Redirecting you to sign in now...
          </p>

          {/* Countdown bar */}
          <div style={{ height: 8, border: "2px solid #111", background: "#f0e6c8", overflow: "hidden", marginBottom: 20, boxShadow: "2px 2px 0 #111" }}>
            <div className="countdown-bar" style={{ height: "100%", background: "#4A3DC8" }} />
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link href="/signin">
              <button style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", fontSize: "1.1rem", letterSpacing: 2, border: "3px solid #111", background: "#4A3DC8", color: "white", padding: "10px 24px", cursor: "pointer", boxShadow: "4px 4px 0 #111", borderRadius: 3 }}>
                ⚡ SIGN IN
              </button>
            </Link>
            <Link href="/signup">
              <button style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", fontSize: "1.1rem", letterSpacing: 2, border: "3px solid #111", background: "#C8952A", color: "#111", padding: "10px 24px", cursor: "pointer", boxShadow: "4px 4px 0 #111", borderRadius: 3 }}>
                JOIN THE FURY →
              </button>
            </Link>
          </div>
        </div>

        <div style={{ background: "#f8f0d8", borderTop: "3px solid #111", padding: "8px 20px", textAlign: "center" }}>
          <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.75rem", color: "#888", letterSpacing: 2 }}>
            FREE TO JOIN · TAKES 30 SECONDS
          </span>
        </div>
      </div>
    </div>
  );

  const onDrop = useCallback((e: React.DragEvent | React.ChangeEvent<HTMLInputElement>) => {
    const f = "dataTransfer" in e ? e.dataTransfer?.files[0] : (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    if ("preventDefault" in e) e.preventDefault();
    setDragging(false);
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setTimeout(() => setStep(2), 300);
  }, []);

  const toggleTag = (t: string) => setForm(f => ({
    ...f, tags: f.tags.includes(t) ? f.tags.filter(x => x !== t) : [...f.tags, t]
  }));

  const handlePublish = async () => {
    if (!file || !form.title) return;
    setUploading(true); setStep(3); setError("");

    try {
      // 1. Get presigned upload URL
      const urlRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size, type: "video" }),
      });
      if (!urlRes.ok) {
        const err = await urlRes.json();
        throw new Error(err.error ?? "Failed to get upload URL");
      }
      const { url, publicUrl, dev } = await urlRes.json();

      // 2. Upload directly to Supabase Storage via signed URL
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = e => { if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 85)); };
      await new Promise<void>((res, rej) => {
        // Supabase signed upload URLs use PUT
        xhr.open("PUT", url);
        if (!dev) {
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.setRequestHeader("x-upsert", "true");
        }
        xhr.onload  = () => { console.log("XHR status:", xhr.status, xhr.responseText); xhr.status < 400 ? res() : rej(new Error(`Upload failed: ${xhr.status} ${xhr.responseText}`)); };
        xhr.onerror = () => rej(new Error("Network error during upload"));
        xhr.send(dev ? null : file);
      });
      setProgress(90);

      // 3. Create clip record using the public URL from storage
      const videoUrl = publicUrl;

      const clipRes = await fetch("/api/clips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title:       form.title,
          description: form.description,
          videoUrl,
          tags:        form.tags,
          visibility,
        }),
      });
      if (!clipRes.ok) throw new Error("Failed to save clip");
      const clip = await clipRes.json();
      setProgress(95);

      // 4. Enter SOTW if selected
      if (form.sotw) {
        await fetch("/api/sotw", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clipId: clip.id }),
        });
      }

      setProgress(100);
      setClipId(clip.id);
      setTimeout(() => setDone(true), 400);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setUploading(false);
      setStep(2);
    }
  };

  const reset = () => {
    setStep(1); setFile(null); setPreview(null); setUploading(false);
    setProgress(0); setDone(false); setClipId(null);
    setForm({ title: "", description: "", tags: [], saveLocal: false, sotw: false });
    setError("");
  };

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
        .snap-input { width: 100%; border: 3px solid #111; background: #fdf8ec; font-family: 'Special Elite', serif; font-size: 1rem; padding: 11px 14px; outline: none; box-shadow: 3px 3px 0 #111; transition: box-shadow 0.1s, transform 0.1s; color: #111; resize: none; }
        .snap-input:focus { box-shadow: 5px 5px 0 #4A3DC8; transform: translate(-1px,-1px); }
        .snap-input::placeholder { color: #aaa; }
        .snap-label { font-family: 'Anton', sans-serif; font-style: italic; font-size: 0.9rem; letter-spacing: 2px; color: #111; margin-bottom: 6px; display: block; transform: skewX(-4deg); }
        .btn { font-family: 'Anton', sans-serif; font-style: italic; letter-spacing: 2px; border: 3px solid #111; cursor: pointer; text-transform: uppercase; transition: transform 0.1s, box-shadow 0.1s; }
        .btn:hover { transform: translate(-2px,-2px); }
        .btn:active { transform: translate(2px,2px); }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }
        .nav-item { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 1rem; letter-spacing: 2px; color: #C8952A; text-transform: uppercase; transition: color 0.1s; text-decoration: none; }
        .nav-item:hover { color: white; }
        .dropzone { border: 5px dashed #4A3DC8; background: #fdf8ec; transition: all 0.2s; cursor: pointer; position: relative; }
        .dropzone.over { border-color: #C8952A; background: #fff8e6; transform: scale(1.01); }
        .step-node { width: 56px; height: 56px; border-radius: 50%; border: 4px solid #111; display: flex; align-items: center; justify-content: center; font-family: 'Anton', sans-serif; font-style: italic; font-size: 1.4rem; transition: all 0.3s; flex-shrink: 0; }
        .step-active { background: #4A3DC8; color: white; box-shadow: 4px 4px 0 #111; transform: translate(-2px,-2px); }
        .step-done   { background: #C8952A; color: #111; box-shadow: 4px 4px 0 #111; }
        .step-idle   { background: #f0e6c8; color: #aaa; }
        .step-line   { height: 4px; flex: 1; background: repeating-linear-gradient(90deg,#111 0,#111 8px,transparent 8px,transparent 16px); }
        .step-line-done { background: #C8952A; }
        .tag-pill { font-family: 'Anton', sans-serif; font-style: italic; font-size: 0.8rem; letter-spacing: 1px; border: 2px solid #111; padding: 5px 12px; cursor: pointer; transition: all 0.15s; box-shadow: 3px 3px 0 #111; user-select: none; }
        .tag-on  { background: #4A3DC8; color: white; transform: translate(-1px,-1px); box-shadow: 4px 4px 0 #111; }
        .tag-off { background: #f8f0d8; color: #555; }
        .tag-off:hover { background: #e8ddb8; }
        .vis-btn { font-family: 'Anton', sans-serif; font-style: italic; font-size: 1rem; letter-spacing: 2px; border: 3px solid #111; padding: 10px 20px; cursor: pointer; flex: 1; text-align: center; transition: all 0.15s; }
        .vis-on  { background: #4A3DC8; color: white; box-shadow: 4px 4px 0 #111; transform: translate(-2px,-2px); }
        .vis-off { background: #f0e6c8; color: #888; }
        .prog-track { height: 28px; border: 3px solid #111; background: #f0e6c8; overflow: hidden; box-shadow: 4px 4px 0 #111; }
        .prog-fill  { height: 100%; background: repeating-linear-gradient(45deg,#4A3DC8 0,#4A3DC8 10px,#3a2fb8 10px,#3a2fb8 20px); transition: width 0.3s ease-out; }
        .error-box  { background: #fff0f0; border: 3px solid #8B2035; padding: 10px 14px; box-shadow: 3px 3px 0 #8B2035; font-family: 'Special Elite', serif; font-size: 0.9rem; color: #8B2035; margin-bottom: 14px; }
        @keyframes bob      { 0%,100%{transform:translateY(0) rotate(-1deg);} 50%{transform:translateY(-7px) rotate(1deg);} }
        @keyframes popIn    { 0%{transform:scale(0.8) rotate(-4deg);opacity:0;} 70%{transform:scale(1.06);} 100%{transform:scale(1);opacity:1;} }
        @keyframes checkPop { 0%{transform:scale(0) rotate(-20deg);opacity:0;} 60%{transform:scale(1.3) rotate(4deg);} 100%{transform:scale(1);opacity:1;} }
        @keyframes slideUp  { from{transform:translateY(20px);opacity:0;} to{transform:translateY(0);opacity:1;} }
        @keyframes pulse    { 0%,100%{box-shadow:5px 5px 0 #111,0 0 0 0 rgba(200,149,42,0.4);} 50%{box-shadow:5px 5px 0 #111,0 0 0 10px rgba(200,149,42,0);} }
        .bob       { animation: bob 3.5s ease-in-out infinite; }
        .pop-in    { animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .check-pop { animation: checkPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .slide-up  { animation: slideUp 0.35s ease forwards; }
        .pulse     { animation: pulse 2s infinite; }
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
          <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.75rem", letterSpacing: 3, color: "#555" }}>"SUBMIT YOUR SNAP FOR THE RECORD BOOKS"</div>
        </div>
        <div style={{ background: "#8B2035", padding: "7px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "3px solid #111" }}>
          <span className="spidey" style={{ color: "white", fontSize: "0.95rem" }}>SNAP SUBMISSION BUREAU — OPEN FOR BUSINESS</span>
          <span style={{ fontFamily: "'Special Elite',serif", color: "rgba(255,255,255,0.8)", fontSize: "0.75rem", letterSpacing: 2 }}>★ COLLECTOR'S SPECIAL EDITION ★</span>
          <span className="spidey" style={{ color: "#C8952A", fontSize: "0.95rem" }}>ISSUE #001 · LIMITED PRINT</span>
        </div>
      </div>

      {/* MAIN */}
      <div className="newsprint" style={{ flex: 1, padding: "36px 28px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>

          {/* PAGE TITLE */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div className="spidey-lg" style={{ fontSize: "clamp(2.2rem,5vw,3.8rem)", color: "#4A3DC8", display: "block" }}>UPLOAD YOUR SNAP!</div>
            <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.9rem", color: "#666", marginTop: 8, letterSpacing: 2 }}>
              Uploading as <strong>@{session?.user?.username}</strong> · 3 steps · Less than 2 minutes
            </div>
          </div>

          {/* STEP INDICATOR */}
          <div style={{ display: "flex", alignItems: "center", maxWidth: 500, margin: "0 auto 36px", gap: 0 }}>
            {[{ n: 1, label: "DROP IT" }, null, { n: 2, label: "DETAILS" }, null, { n: 3, label: "LAUNCH" }].map((s, i) =>
              s === null ? (
                <div key={`line-${i}`} className={`step-line ${step > Math.ceil(i / 2) ? "step-line-done" : ""}`} style={{ margin: "0 6px" }} />
              ) : (
                <div key={`step-${s.n}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                  <div className={`step-node ${step === s.n ? "step-active" : step > s.n ? "step-done" : "step-idle"}`}>
                    {step > s.n ? "✓" : s.n}
                  </div>
                  <span className="spidey" style={{ fontSize: "0.7rem", color: step >= s.n ? "#111" : "#aaa", letterSpacing: 1 }}>{s.label}</span>
                </div>
              )
            )}
          </div>

          {/* ── STEP 1: DROP ZONE ── */}
          {step === 1 && (
            <div className="pop-in" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 28, alignItems: "start" }}>
              <div className="panel" style={{ transform: "rotate(-0.5deg)" }}>
                <div style={{ background: "#4A3DC8", borderBottom: "4px solid #111", padding: "8px 18px", display: "flex", justifyContent: "space-between" }}>
                  <span className="spidey" style={{ color: "#C8952A", fontSize: "1rem" }}>★ STEP 1 OF 3 — DROP YOUR SNAP</span>
                  <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>PANEL #1</span>
                </div>
                <div style={{ padding: 24 }}>
                  <div
                    className={`dropzone ${dragging ? "over" : ""}`}
                    style={{ minHeight: 300, borderRadius: 4, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 32 }}
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop as any}
                    onClick={() => fileRef.current?.click()}
                  >
                    <input ref={fileRef} type="file" accept="video/*" style={{ display: "none" }} onChange={onDrop as any} />
                    <div style={{ width: 90, height: 90, border: "4px solid #4A3DC8", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "4px 4px 0 #4A3DC8", background: "white" }}>
                      <span style={{ fontSize: "2.8rem" }}>🎬</span>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div className="spidey-lg" style={{ fontSize: "2rem", color: dragging ? "#C8952A" : "#4A3DC8", display: "block", marginBottom: 8 }}>
                        {dragging ? "DROP IT!" : "DROP YOUR SNAP HERE!"}
                      </div>
                      <div style={{ fontFamily: "'Special Elite',serif", color: "#888", fontSize: "0.9rem", lineHeight: 1.7 }}>
                        Drag & drop your clip, or click to browse<br />
                        <span style={{ fontSize: "0.8rem", color: "#aaa" }}>MP4, MOV, AVI · Max 500MB</span>
                      </div>
                    </div>
                  </div>
                  <button className="btn" onClick={() => fileRef.current?.click()}
                    style={{ width: "100%", marginTop: 14, background: "#C8952A", color: "#111", padding: 12, fontSize: "1.2rem", boxShadow: "5px 5px 0 #111", borderRadius: 3 }}>
                    📁 BROWSE FILES
                  </button>
                </div>
              </div>

              {/* Tips */}
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div className="panel" style={{ background: "#f8f0d8", transform: "rotate(1deg)" }}>
                  <div style={{ background: "#C8952A", borderBottom: "3px solid #111", padding: "6px 14px" }}>
                    <span className="spidey" style={{ color: "#111", fontSize: "0.9rem" }}>EDITORIAL TIPS</span>
                  </div>
                  <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { icon: "⚡", tip: "Keep clips under 60 seconds for max engagement" },
                      { icon: "🎯", tip: "Capture the snap moment + 5s before & after" },
                      { icon: "📺", tip: "1080p or higher gets featured placement" },
                      { icon: "🔊", tip: "Audio cues (Oh Snap!) make clips pop" },
                    ].map((t, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>{t.icon}</span>
                        <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.82rem", color: "#444", lineHeight: 1.5 }}>{t.tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="panel" style={{ background: "#4A3DC8", transform: "rotate(-1.5deg)" }}>
                  <div className="halftone" style={{ position: "absolute", inset: 0, opacity: 0.25 }} />
                  <div style={{ padding: "18px 16px", position: "relative", zIndex: 2, textAlign: "center" }}>
                    <img src="/logo.jpg" className="bob" alt="sf" style={{ width: 80, height: 80, borderRadius: "50%", border: "3px solid #C8952A", objectFit: "cover", boxShadow: "4px 4px 0 #111", marginBottom: 10 }} />
                    <div className="spidey" style={{ color: "#C8952A", fontSize: "1.3rem", display: "block", marginBottom: 6 }}>SNAP FURY</div>
                    <div style={{ fontFamily: "'Special Elite',serif", color: "rgba(255,255,255,0.85)", fontSize: "0.8rem", lineHeight: 1.6 }}>Every legendary snap starts with a single upload. Is yours next?</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: DETAILS ── */}
          {step === 2 && (
            <div className="slide-up" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 28, alignItems: "start" }}>
              <div className="panel" style={{ transform: "rotate(-0.3deg)" }}>
                <div style={{ background: "#8B2035", borderBottom: "4px solid #111", padding: "8px 18px", display: "flex", justifyContent: "space-between" }}>
                  <span className="spidey" style={{ color: "white", fontSize: "1rem" }}>★ STEP 2 OF 3 — TELL THE STORY</span>
                  <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>PANEL #2</span>
                </div>
                <div style={{ padding: 24 }}>
                  {error && <div className="error-box">⚠️ {error}</div>}
                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <div>
                      <label className="snap-label">SNAP TITLE <span style={{ color: "#8B2035" }}>*</span></label>
                      <input className="snap-input" type="text" placeholder="e.g. CUBE DOMINATION — SERIES 5 FLEX"
                        value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                        style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", fontSize: "1.1rem" }} />
                    </div>
                    <div>
                      <label className="snap-label">WHAT HAPPENED? <span style={{ fontSize: "0.7rem", fontStyle: "normal", fontFamily: "'Special Elite',serif", transform: "none", letterSpacing: 0, color: "#888" }}>(optional)</span></label>
                      <textarea className="snap-input" rows={3} placeholder="Describe the moment, the stakes, the fury..."
                        value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                    </div>
                    <div>
                      <label className="snap-label">SNAP TYPE <span style={{ fontSize: "0.7rem", fontStyle: "normal", fontFamily: "'Special Elite',serif", transform: "none", letterSpacing: 0, color: "#888" }}>(pick all that apply)</span></label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {SNAP_TAGS.map(t => (
                          <span key={t} className={`tag-pill ${form.tags.includes(t) ? "tag-on" : "tag-off"}`} onClick={() => toggleTag(t)}>{t}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="snap-label">VISIBILITY</label>
                      <div style={{ display: "flex" }}>
                        {["public", "unlisted"].map((v, i) => (
                          <button key={v} className={`vis-btn ${visibility === v ? "vis-on" : "vis-off"}`}
                            onClick={() => setVisibility(v)}
                            style={{ border: "3px solid #111", borderRight: i === 0 ? "none" : "3px solid #111", borderRadius: i === 0 ? "3px 0 0 3px" : "0 3px 3px 0" }}>
                            {v === "public" ? "🌍 PUBLIC" : "🔒 UNLISTED"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Save locally */}
                    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", border: "3px solid #111", background: "#f8f0d8", boxShadow: "3px 3px 0 #111", cursor: "pointer" }}
                      onClick={() => setForm(f => ({ ...f, saveLocal: !f.saveLocal }))}>
                      <div style={{ width: 28, height: 28, border: "3px solid #111", background: form.saveLocal ? "#4A3DC8" : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "2px 2px 0 #111" }}>
                        {form.saveLocal && <span style={{ color: "white", fontSize: "1rem" }}>✓</span>}
                      </div>
                      <div>
                        <div className="spidey" style={{ color: "#111", fontSize: "0.9rem" }}>ALSO SAVE LOCALLY</div>
                        <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.75rem", color: "#666", marginTop: 2 }}>Keep a copy on your device as well</div>
                      </div>
                    </div>

                    {/* SOTW entry */}
                    <div style={{ position: "relative" }} onClick={() => setForm(f => ({ ...f, sotw: !f.sotw }))}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", border: "3px solid #111", background: form.sotw ? "#C8952A" : "#f8f0d8", boxShadow: "4px 4px 0 #111", cursor: "pointer", transition: "background 0.2s" }}>
                        <div style={{ width: 32, height: 32, border: "3px solid #111", background: form.sotw ? "#111" : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "2px 2px 0 #111", fontSize: "1.1rem" }}>
                          {form.sotw ? "⭐" : "☆"}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="spidey" style={{ color: "#111", fontSize: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
                            ENTER FOR SNAP OF THE WEEK
                            <span style={{ background: "#8B2035", color: "white", fontFamily: "'Special Elite',serif", fontSize: "0.6rem", letterSpacing: 2, padding: "1px 6px", fontStyle: "normal", display: "inline-block" }}>NEW</span>
                          </div>
                          <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.75rem", color: form.sotw ? "#111" : "#666", marginTop: 2, lineHeight: 1.5 }}>
                            Allow SnapFury to feature this clip on the official YouTube channel if selected. Winners announced every Sunday.
                          </div>
                        </div>
                        {form.sotw && (
                          <div className="starburst" style={{ width: 48, height: 48, background: "#111", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", color: "#C8952A", fontSize: "0.6rem", textAlign: "center", lineHeight: 1 }}>IN!</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 12 }}>
                      <button className="btn" onClick={() => setStep(1)}
                        style={{ background: "#f0e6c8", color: "#111", padding: "11px 20px", fontSize: "1rem", boxShadow: "4px 4px 0 #111", borderRadius: 3 }}>← BACK</button>
                      <button className="btn pulse" onClick={() => setStep(3)} disabled={!form.title}
                        style={{ flex: 1, background: form.title ? "#4A3DC8" : "#ccc", color: "white", padding: 11, fontSize: "1.3rem", boxShadow: form.title ? "5px 5px 0 #111" : "3px 3px 0 #999", borderRadius: 3 }}>
                        NEXT: PREVIEW →
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview card */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.75rem", color: "#888", letterSpacing: 2, textAlign: "center" }}>PREVIEW</div>
                <div className="panel" style={{ transform: "rotate(1deg)" }}>
                  <div style={{ height: 150, background: "linear-gradient(135deg,#1a1040,#4A3DC8)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    <div className="halftone" style={{ position: "absolute", inset: 0, opacity: 0.2 }} />
                    {preview
                      ? <video src={preview} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />
                      : <span style={{ fontSize: "2.5rem", zIndex: 2 }}>🎬</span>
                    }
                    {form.tags[0] && (
                      <div style={{ position: "absolute", top: 8, left: 8 }}>
                        <span style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", fontSize: "0.8rem", border: "2px solid #111", padding: "2px 8px", background: "#C8952A", color: "#111", transform: "rotate(-3deg)", display: "inline-block", boxShadow: "2px 2px 0 #111" }}>{form.tags[0]}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "12px 14px", borderTop: "3px solid #111" }}>
                    <div style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", fontSize: "1.1rem", color: "#111", marginBottom: 4, minHeight: 24 }}>
                      {form.title || <span style={{ color: "#ccc", fontStyle: "normal", fontFamily: "'Special Elite',serif", fontSize: "0.9rem" }}>Title goes here...</span>}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, color: "#4A3DC8", fontSize: "0.8rem" }}>@{session?.user?.username}</span>
                      <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.75rem", color: "#888" }}>Just now</span>
                    </div>
                  </div>
                </div>
                {file && (
                  <div style={{ border: "3px solid #111", background: "#f8f0d8", padding: "12px 14px", boxShadow: "3px 3px 0 #111", transform: "rotate(-1deg)" }}>
                    <div className="spidey" style={{ color: "#111", fontSize: "0.85rem", marginBottom: 6 }}>FILE DETAILS</div>
                    <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.8rem", color: "#555", lineHeight: 1.8 }}>
                      <div>📄 {file.name.length > 26 ? file.name.slice(0, 23) + "..." : file.name}</div>
                      <div>📦 {(file.size / 1e6).toFixed(1)} MB</div>
                      <div>🎥 {file.type || "video/mp4"}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 3: LAUNCH ── */}
          {step === 3 && (
            <div className="slide-up" style={{ maxWidth: 620, margin: "0 auto" }}>
              <div className="panel" style={{ transform: "rotate(-0.3deg)" }}>
                <div style={{ background: done ? "#2a6e2a" : "#4A3DC8", borderBottom: "4px solid #111", padding: "8px 18px", display: "flex", justifyContent: "space-between", transition: "background 0.5s" }}>
                  <span className="spidey" style={{ color: done ? "#C8952A" : "white", fontSize: "1rem" }}>
                    {done ? "★ SNAP FURY CONFIRMED! ★" : "★ STEP 3 OF 3 — LAUNCH IT!"}
                  </span>
                  <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>PANEL #3</span>
                </div>
                <div style={{ padding: "32px 28px", textAlign: "center" }}>
                  {!done ? (
                    <>
                      <div style={{ marginBottom: 24 }}>
                        <div className="spidey-lg" style={{ fontSize: "2.6rem", color: "#4A3DC8", display: "block", marginBottom: 8 }}>
                          {uploading ? "UPLOADING..." : "READY TO LAUNCH?"}
                        </div>
                        <div style={{ fontFamily: "'Special Elite',serif", color: "#888", fontSize: "0.9rem", letterSpacing: 1 }}>
                          {uploading ? `${Math.round(progress)}% complete — hang tight!` : "Your snap is about to become legend."}
                        </div>
                      </div>

                      {!uploading && (
                        <div style={{ border: "3px solid #111", background: "#f8f0d8", padding: 16, marginBottom: 24, boxShadow: "4px 4px 0 #111", textAlign: "left" }}>
                          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                            <div style={{ width: 80, height: 60, background: "linear-gradient(135deg,#1a1040,#4A3DC8)", border: "2px solid #111", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                              {preview ? <video src={preview} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted /> : <span>🎬</span>}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div className="spidey" style={{ color: "#111", fontSize: "1rem", display: "block", marginBottom: 4 }}>{form.title}</div>
                              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                {form.tags.map(t => (
                                  <span key={t} style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", fontSize: "0.7rem", border: "2px solid #4A3DC8", padding: "1px 6px", color: "#4A3DC8" }}>{t}</span>
                                ))}
                              </div>
                              <div style={{ fontFamily: "'Special Elite',serif", fontSize: "0.75rem", color: "#888", marginTop: 4 }}>
                                {visibility === "public" ? "🌍 Public" : "🔒 Unlisted"}{form.sotw ? " · ⭐ SOTW Entry" : ""} · @{session?.user?.username}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {uploading && (
                        <div style={{ marginBottom: 28 }}>
                          <div className="prog-track" style={{ borderRadius: 3, marginBottom: 8 }}>
                            <div className="prog-fill" style={{ width: `${progress}%` }} />
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontFamily: "'Special Elite',serif", fontSize: "0.8rem", color: "#888" }}>Uploading to SnapFury...</span>
                            <span className="spidey" style={{ color: "#4A3DC8", fontSize: "1rem" }}>{Math.round(progress)}%</span>
                          </div>
                        </div>
                      )}

                      {!uploading && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                          <button className="btn pulse" onClick={handlePublish}
                            style={{ width: "100%", background: "#4A3DC8", color: "white", padding: 16, fontSize: "1.6rem", boxShadow: "6px 6px 0 #111", borderRadius: 3 }}>
                            ⚡ PUBLISH TO SNAP FURY
                          </button>
                          <button className="btn" onClick={() => setStep(2)}
                            style={{ width: "100%", background: "#f0e6c8", color: "#111", padding: 10, fontSize: "1rem", boxShadow: "4px 4px 0 #111", borderRadius: 3 }}>
                            ← EDIT DETAILS
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="check-pop">
                      <div className="starburst" style={{ width: 120, height: 120, background: "#C8952A", border: "4px solid #111", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                        <span style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", color: "#111", fontSize: "1.8rem", textAlign: "center", lineHeight: 1 }}>OH<br />SNAP!</span>
                      </div>
                      <div className="spidey-lg" style={{ fontSize: "3rem", color: "#C8952A", display: "block", marginBottom: 8 }}>SNAP UPLOADED!</div>
                      <div style={{ fontFamily: "'Special Elite',serif", color: "#555", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: 24 }}>
                        Your snap is live on SnapFury.<br />The community is about to feel your fury.
                      </div>
                      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        {clipId && (
                          <Link href={`/clips/${clipId}`}>
                            <button className="btn" style={{ background: "#4A3DC8", color: "white", padding: "11px 24px", fontSize: "1.1rem", boxShadow: "4px 4px 0 #111", borderRadius: 3 }}>
                              👁 VIEW MY CLIP
                            </button>
                          </Link>
                        )}
                        <button className="btn" onClick={reset}
                          style={{ background: "#C8952A", color: "#111", padding: "11px 24px", fontSize: "1.1rem", boxShadow: "4px 4px 0 #111", borderRadius: 3 }}>
                          ⬆ UPLOAD ANOTHER
                        </button>
                        <Link href="/">
                          <button className="btn" style={{ background: "#f0e6c8", color: "#111", padding: "11px 24px", fontSize: "1.1rem", boxShadow: "4px 4px 0 #111", borderRadius: 3 }}>
                            🏠 GO HOME
                          </button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: "#111", borderTop: "4px solid #C8952A", padding: "12px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo.jpg" alt="sf" style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid #C8952A", objectFit: "cover" }} />
          <span className="spidey" style={{ color: "#C8952A", fontSize: "1rem" }}>SNAP FURY</span>
        </div>
        <span style={{ fontFamily: "'Special Elite',serif", color: "#444", fontSize: "0.75rem" }}>© 2025 SnapFury · Not affiliated with Marvel or Second Dinner</span>
      </div>
    </div>
  );
}
