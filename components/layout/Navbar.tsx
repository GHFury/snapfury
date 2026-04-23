"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const path = usePathname();

  const navLinks = [
    ["HOME",        "/"],
    ["CLIPS",       "/clips"],
    ["UPLOAD",      "/upload"],
    ["LEADERBOARD", "/leaderboard"],
  ];

  const isActive = (href: string) =>
    href === "/" ? path === "/" : path.startsWith(href);

  return (
    <nav style={{
      background: "#111",
      borderBottom: "4px solid #C8952A",
      padding: "0 28px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 64,
      flexShrink: 0,
      position: "sticky",
      top: 0,
      zIndex: 200,
    }}>
      <style>{`
        .nav-link {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 1rem;
          letter-spacing: 2px;
          color: #C8952A;
          text-transform: uppercase;
          transition: color 0.1s;
          text-decoration: none;
        }
        .nav-link:hover { color: white; }
        .nav-link.nav-active { color: white; border-bottom: 2px solid #C8952A; padding-bottom: 2px; }
        .nav-btn {
          font-family: 'Anton', sans-serif;
          font-style: italic;
          letter-spacing: 2px;
          border: 3px solid #111;
          cursor: pointer;
          text-transform: uppercase;
          transition: transform 0.1s, box-shadow 0.1s;
          text-decoration: none;
          display: inline-block;
        }
        .nav-btn:hover { transform: translate(-2px,-2px); }
        .nav-btn:active { transform: translate(2px,2px); }
        .spidey-nav {
          font-family: 'Anton', sans-serif;
          font-style: italic;
          transform: skewX(-6deg);
          display: inline-block;
          letter-spacing: 1px;
        }
      `}</style>

      {/* LOGO */}
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
        <img
          src="/logo.jpg"
          alt="SnapFury"
          style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid #C8952A", objectFit: "cover", boxShadow: "2px 2px 0 #C8952A" }}
        />
        <div>
          <div className="spidey-nav" style={{ color: "#C8952A", fontSize: "1.5rem", letterSpacing: 3, lineHeight: 1 }}>SNAP FURY</div>
          <div style={{ background: "#8B2035", fontFamily: "'Special Elite',serif", fontSize: "0.55rem", letterSpacing: 3, color: "white", padding: "1px 6px", marginTop: 2, textAlign: "center" }}>
            SPECIAL EDITION
          </div>
        </div>
      </Link>

      {/* NAV LINKS */}
      <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        {navLinks.map(([label, href]) => (
          <Link key={label} href={href} className={`nav-link ${isActive(href) ? "nav-active" : ""}`}>
            {label}
          </Link>
        ))}
      </div>

      {/* RIGHT SIDE — session aware */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {session ? (
          <>
            {/* Avatar + username */}
            <Link href={`/profile/${session.user.username}`}
              style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                border: "2px solid #C8952A", background: "#4A3DC8",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden", boxShadow: "2px 2px 0 #C8952A", flexShrink: 0,
              }}>
                {session.user.image
                  ? <img src={session.user.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <span style={{ fontFamily: "'Anton',sans-serif", fontStyle: "italic", color: "#C8952A", fontSize: "0.9rem" }}>
                      {session.user.username?.[0]?.toUpperCase()}
                    </span>
                }
              </div>
              <span className="spidey-nav" style={{ color: "#C8952A", fontSize: "1rem" }}>
                @{session.user.username}
              </span>
            </Link>

            {/* Sign out */}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              style={{
                fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700,
                fontSize: "0.8rem", letterSpacing: 1,
                background: "transparent", border: "1px solid #444",
                color: "#666", padding: "5px 12px", cursor: "pointer",
                transition: "all 0.1s",
              }}
              onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = "#888"; (e.target as HTMLElement).style.color = "#aaa"; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = "#444"; (e.target as HTMLElement).style.color = "#666"; }}
            >
              SIGN OUT
            </button>
          </>
        ) : (
          <>
            {/* Sign in */}
            <Link href="/signin" className="nav-btn"
              style={{ background: "transparent", color: "#C8952A", padding: "7px 16px", borderRadius: 3, fontSize: "0.95rem", borderColor: "#C8952A", boxShadow: "3px 3px 0 #C8952A" }}>
              SIGN IN
            </Link>
            {/* Join */}
            <Link href="/signup" className="nav-btn"
              style={{ background: "#C8952A", color: "#111", padding: "8px 18px", borderRadius: 3, fontSize: "1rem", boxShadow: "4px 4px 0 #111" }}>
              ⚡ JOIN THE FURY
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
