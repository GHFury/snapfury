import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Seed users
  const password = await bcrypt.hash("snapfury123", 12);

  const fury = await db.user.upsert({
    where: { username: "FuryMSnap" },
    update: {},
    create: {
      username: "FuryMSnap",
      email:    "fury@snapfury.com",
      password,
      bio:      "Shorts of all things Marvel Snap! 💥",
    },
  });

  const king = await db.user.upsert({
    where: { username: "SnapKing99" },
    update: {},
    create: {
      username: "SnapKing99",
      email:    "king@snapfury.com",
      password,
      bio:      "Snap first, ask questions never.",
    },
  });

  const goblin = await db.user.upsert({
    where: { username: "CubeGoblin" },
    update: {},
    create: {
      username: "CubeGoblin",
      email:    "goblin@snapfury.com",
      password,
      bio:      "I live for the cube manipulation.",
    },
  });

  // Seed clips
  const clips = [
    {
      title:       "FURY TRIPLE SNAP",
      description: "The most audacious triple snap in SnapFury history.",
      videoUrl:    "https://clips.snapfury.com/sample/triple-snap.mp4",
      views:       33000,
      userId:      fury.id,
      tags:        ["SNAP", "DOUBLE SNAP", "CUBE FLEX", "COMEBACK"],
    },
    {
      title:       "CUBE DOMINATION",
      description: "A masterclass in cube management.",
      videoUrl:    "https://clips.snapfury.com/sample/cube-domination.mp4",
      views:       12400,
      userId:      fury.id,
      tags:        ["SNAP", "CUBE FLEX"],
    },
    {
      title:       "LAST SECOND SNAP",
      description: "Turn 6, down 2 cubes — snap anyway.",
      videoUrl:    "https://clips.snapfury.com/sample/last-second.mp4",
      views:       8900,
      userId:      king.id,
      tags:        ["LAST SECOND", "SNAP"],
    },
    {
      title:       "INFINITE RETREAT",
      description: "The graceful exit is also an art form.",
      videoUrl:    "https://clips.snapfury.com/sample/infinite-retreat.mp4",
      views:       21000,
      userId:      goblin.id,
      tags:        ["RETREAT", "PERFECT GAME"],
    },
    {
      title:       "SERIES 5 FLEX",
      description: "When your collection is just too stacked.",
      videoUrl:    "https://clips.snapfury.com/sample/series5-flex.mp4",
      views:       5300,
      userId:      king.id,
      tags:        ["CUBE FLEX", "SNAP"],
    },
    {
      title:       "SNAP OR RETREAT?",
      description: "The eternal question answered with pure aggression.",
      videoUrl:    "https://clips.snapfury.com/sample/snap-or-retreat.mp4",
      views:       17000,
      userId:      goblin.id,
      tags:        ["SNAP", "COMEBACK"],
    },
  ];

  for (const clip of clips) {
    const { tags, ...data } = clip;
    await db.clip.upsert({
      where:  { id: `seed-${data.title.replace(/\s/g, "-").toLowerCase()}` },
      update: {},
      create: {
        id: `seed-${data.title.replace(/\s/g, "-").toLowerCase()}`,
        ...data,
        tags: { create: tags.map(tag => ({ tag })) },
      },
    });
  }

  console.log("✅ Seeded users:", ["FuryMSnap", "SnapKing99", "CubeGoblin"].join(", "));
  console.log("✅ Seeded clips:", clips.length);
  console.log("\n🔑 Dev login — email: fury@snapfury.com  password: snapfury123");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
