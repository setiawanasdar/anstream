import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Fast Static Lookup Map for Popular Anime to TMDB ID
const KNOWN_ANIME_TMDB: Record<string, string> = {
  "jujutsu kaisen": "95479",
  "frieren": "209867",
  "sousou no frieren": "209867",
  "attack on titan": "1429",
  "shingeki no kyojin": "1429",
  "one piece": "37854",
  "demon slayer": "85937",
  "kimetsu no yaiba": "85937",
  "naruto": "46260",
  "naruto shippuden": "31910",
  "bleach": "30984",
  "bleach sennen kessen hen": "209867",
  "solo leveling": "127532",
  "ore dake level up na ken": "127532",
  "mushoku tensei": "94664",
  "chainsaw man": "114410",
  "death note": "13916",
  "hunter x hunter": "46298",
  "fullmetal alchemist brotherhood": "31911",
  "my hero academia": "65930",
  "boku no hero academia": "65930",
  "spy x family": "120089",
  "oshi no ko": "203737",
  "black clover": "73223",
  "tokyo ghoul": "61374",
  "sword art online": "45782",
  "haikyuu": "60863",
  "dr stone": "86031",
  "vinland saga": "86971",
  "overlord": "66348",
  "re zero": "65942",
  "mob psycho 100": "67075",
  "konosuba": "65922",
  "blue lock": "136283",
  "steins gate": "37943",
  "code geass": "31724",
  "kaguya sama": "83095",
  "bocchi the rock": "203857",
  "classroom of the elite": "72636",
  "youkoso jitsuryoku": "72636",
  "kaiju no 8": "207347",
  "dandadan": "239770",
  "wind breaker": "224483",
  "hells paradise": "128082",
  "jigokuraku": "128082",
  "zom 100": "217216",
  "the eminence in shadow": "152636",
  "kage no jitsuryokusha": "152636",
  "shangri la frontier": "205324",
  "mashle": "205424",
  "delicious in dungeon": "208249",
  "dungeon meshi": "208249",
  "undead unluck": "208889",
  "ragna crimson": "196417",
  "classroom of a black cat and a witch": "297557",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title");

  if (!title) {
    return NextResponse.json({ status: "error", message: "Title parameter is required" }, { status: 400 });
  }

  const cleanTitle = title
    .toLowerCase()
    .replace(/episode\s*[0-9]+/i, "")
    .replace(/season\s*[0-9]+/i, "")
    .replace(/s[0-9]+/i, "")
    .replace(/sub(title)?\s*indo(nesia)?/i, "")
    .replace(/[^a-z0-9\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  // 1. Check direct match in known dictionary
  for (const [key, tmdbId] of Object.entries(KNOWN_ANIME_TMDB)) {
    if (cleanTitle.includes(key) || key.includes(cleanTitle)) {
      return NextResponse.json({
        status: "success",
        data: { tmdbId, title: key, source: "dictionary" },
      });
    }
  }

  // 2. Search via free public TV/Anime search API
  try {
    const tmdbRes = await fetch(
      `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(cleanTitle)}&api_key=15d2ade7c0a47e0e69d31c4762b75eab`
    );
    if (tmdbRes.ok) {
      const tmdbData = await tmdbRes.json();
      if (tmdbData.results && tmdbData.results.length > 0) {
        const bestMatch = tmdbData.results[0];
        return NextResponse.json({
          status: "success",
          data: {
            tmdbId: bestMatch.id.toString(),
            title: bestMatch.name,
            source: "tmdb_search",
          },
        });
      }
    }
  } catch (err) {
    console.warn("TMDB Search error:", err);
  }

  return NextResponse.json({
    status: "not_found",
    message: "No TMDB ID found for this title",
  });
}
