// lib/movieLibrary.ts
export const CHAT_PRESETS = [
  "I want something emotional but not depressing",
  "Give me a fast movie, I’m tired",
  "I want a smart thriller tonight",
  "Something warm and comforting",
  "I’m okay with subtitles",
  "Give me a layered family drama",
  "I want something stylish and intense",
  "Need a comfort rewatch vibe, but new to me",
];

export const INDUSTRIES = [
  "Hollywood",
  "Mollywood",
  "Tollywood",
  "Kollywood",
  "Bollywood",
  "Sandalwood",
] as const;

export const INDUSTRY_LANGUAGES: Record<string, string> = {
  Hollywood: "English",
  Mollywood: "Malayalam",
  Tollywood: "Telugu",
  Kollywood: "Tamil",
  Bollywood: "Hindi",
  Sandalwood: "Kannada",
};

export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
export const TMDB_BACKDROP_BASE = "https://image.tmdb.org/t/p/original";
export const PLACEHOLDER_POSTER = "https://placehold.co/600x900/0b0b12/e5e7eb?text=CineMuse";
export const PLACEHOLDER_BACKDROP = "https://placehold.co/1600x900/09090f/e5e7eb?text=CineMuse+AI";

export type Industry = (typeof INDUSTRIES)[number];

export type SeedMovie = {
  query: string;
  industry: Industry;
  genres: string[];
  tier: "top" | "mid" | "deep";
};

export type MovieItem = {
  id: string | number;
  title: string;
  year: string;
  poster: string;
  backdrop: string;
  overview: string;
  description: string;
  runtime: number;
  language: string;
  industry: Industry;
  country: string;
  genres: string[];
  pace: "fast" | "easy" | "medium" | "slow-burn";
  moodTags: string[];
  attention: "low" | "medium" | "high";
  why?: string;
  tier: "top" | "mid" | "deep";
  query?: string;
  voteAverage?: number;
};

export type ProfileShape = {
  likedGenres: string[];
  subtitleComfort: boolean;
  attention: "low" | "medium" | "high";
};

export const MOVIE_LIBRARY_SEED: SeedMovie[] = [
  // Hollywood
  { query: "Inception", industry: "Hollywood", genres: ["Sci-Fi", "Thriller"], tier: "top" },
  { query: "Interstellar", industry: "Hollywood", genres: ["Sci-Fi", "Drama"], tier: "top" },
  { query: "The Dark Knight", industry: "Hollywood", genres: ["Action", "Crime"], tier: "top" },
  { query: "Fight Club", industry: "Hollywood", genres: ["Drama", "Thriller"], tier: "top" },
  { query: "Whiplash", industry: "Hollywood", genres: ["Drama", "Music"], tier: "mid" },
  { query: "Gone Girl", industry: "Hollywood", genres: ["Mystery", "Thriller"], tier: "mid" },
  { query: "Knives Out", industry: "Hollywood", genres: ["Mystery", "Comedy"], tier: "mid" },
  { query: "Prisoners", industry: "Hollywood", genres: ["Thriller", "Crime"], tier: "mid" },
  { query: "The Prestige", industry: "Hollywood", genres: ["Mystery", "Drama"], tier: "mid" },
  { query: "Mad Max Fury Road", industry: "Hollywood", genres: ["Action", "Adventure"], tier: "mid" },
  { query: "About Time", industry: "Hollywood", genres: ["Romance", "Drama"], tier: "mid" },
  { query: "Lady Bird", industry: "Hollywood", genres: ["Drama", "Comedy"], tier: "deep" },
  { query: "Her", industry: "Hollywood", genres: ["Romance", "Sci-Fi"], tier: "deep" },
  { query: "Drive", industry: "Hollywood", genres: ["Crime", "Drama"], tier: "deep" },
  { query: "Nightcrawler", industry: "Hollywood", genres: ["Thriller", "Crime"], tier: "deep" },
  { query: "The Nice Guys", industry: "Hollywood", genres: ["Comedy", "Crime"], tier: "deep" },
  { query: "The Florida Project", industry: "Hollywood", genres: ["Drama"], tier: "deep" },
  { query: "Palm Springs", industry: "Hollywood", genres: ["Comedy", "Romance"], tier: "deep" },

  // Mollywood
  { query: "Drishyam 2013", industry: "Mollywood", genres: ["Thriller", "Drama"], tier: "top" },
  { query: "Bangalore Days", industry: "Mollywood", genres: ["Drama", "Comedy"], tier: "top" },
  { query: "Premam", industry: "Mollywood", genres: ["Romance", "Drama"], tier: "top" },
  { query: "Kumbalangi Nights", industry: "Mollywood", genres: ["Drama", "Comedy"], tier: "top" },
  { query: "Uyare", industry: "Mollywood", genres: ["Drama"], tier: "mid" },
  { query: "Minnal Murali", industry: "Mollywood", genres: ["Action", "Fantasy"], tier: "mid" },
  { query: "Rorschach", industry: "Mollywood", genres: ["Thriller", "Mystery"], tier: "mid" },
  { query: "Charlie Malayalam", industry: "Mollywood", genres: ["Adventure", "Drama"], tier: "mid" },
  { query: "Android Kunjappan Version 5.25", industry: "Mollywood", genres: ["Comedy", "Sci-Fi"], tier: "mid" },
  { query: "Maheshinte Prathikaaram", industry: "Mollywood", genres: ["Comedy", "Drama"], tier: "mid" },
  { query: "Sudani from Nigeria", industry: "Mollywood", genres: ["Drama", "Sports"], tier: "deep" },
  { query: "Ela Veezha Poonchira", industry: "Mollywood", genres: ["Thriller", "Crime"], tier: "deep" },
  { query: "Thondimuthalum Driksakshiyum", industry: "Mollywood", genres: ["Crime", "Drama"], tier: "deep" },
  { query: "Jan.E.Man", industry: "Mollywood", genres: ["Comedy", "Drama"], tier: "deep" },
  { query: "Nayattu", industry: "Mollywood", genres: ["Thriller", "Drama"], tier: "deep" },
  { query: "Virus Malayalam", industry: "Mollywood", genres: ["Thriller", "Drama"], tier: "deep" },
  { query: "Home Malayalam", industry: "Mollywood", genres: ["Drama", "Family"], tier: "deep" },
  { query: "Joji", industry: "Mollywood", genres: ["Drama", "Crime"], tier: "deep" },

  // Tollywood
  { query: "RRR", industry: "Tollywood", genres: ["Action", "Drama"], tier: "top" },
  { query: "Baahubali 2", industry: "Tollywood", genres: ["Action", "Adventure"], tier: "top" },
  { query: "Jersey Telugu", industry: "Tollywood", genres: ["Drama", "Sports"], tier: "top" },
  { query: "Mahanati", industry: "Tollywood", genres: ["Drama", "Biography"], tier: "mid" },
  { query: "Eega", industry: "Tollywood", genres: ["Fantasy", "Action"], tier: "mid" },
  { query: "Agent Sai Srinivasa Athreya", industry: "Tollywood", genres: ["Mystery", "Comedy"], tier: "mid" },
  { query: "Ante Sundaraniki", industry: "Tollywood", genres: ["Comedy", "Romance"], tier: "mid" },
  { query: "C/o Kancharapalem", industry: "Tollywood", genres: ["Drama", "Romance"], tier: "deep" },
  { query: "Brochevarevarura", industry: "Tollywood", genres: ["Comedy", "Crime"], tier: "deep" },
  { query: "Pelli Choopulu", industry: "Tollywood", genres: ["Romance", "Comedy"], tier: "deep" },
  { query: "Care of Kancharapalem", industry: "Tollywood", genres: ["Drama", "Romance"], tier: "deep" },
  { query: "Mathu Vadalara", industry: "Tollywood", genres: ["Comedy", "Thriller"], tier: "deep" },
  { query: "Cinema Bandi", industry: "Tollywood", genres: ["Comedy", "Drama"], tier: "deep" },
  { query: "Mallesham", industry: "Tollywood", genres: ["Drama", "Biography"], tier: "deep" },
  { query: "Vedam", industry: "Tollywood", genres: ["Drama"], tier: "deep" },
  { query: "Hit The First Case Telugu", industry: "Tollywood", genres: ["Thriller", "Crime"], tier: "mid" },
  { query: "Ee Nagaraniki Emaindhi", industry: "Tollywood", genres: ["Comedy", "Drama"], tier: "deep" },
  { query: "Godavari Telugu", industry: "Tollywood", genres: ["Romance", "Drama"], tier: "deep" },

  // Kollywood
  { query: "96 Tamil", industry: "Kollywood", genres: ["Romance", "Drama"], tier: "top" },
  { query: "Vikram 2022", industry: "Kollywood", genres: ["Action", "Thriller"], tier: "top" },
  { query: "Kaithi", industry: "Kollywood", genres: ["Action", "Thriller"], tier: "top" },
  { query: "Asuran", industry: "Kollywood", genres: ["Drama", "Action"], tier: "top" },
  { query: "Super Deluxe", industry: "Kollywood", genres: ["Drama", "Comedy"], tier: "mid" },
  { query: "Soodhu Kavvum", industry: "Kollywood", genres: ["Crime", "Comedy"], tier: "mid" },
  { query: "Theeran Adhigaaram Ondru", industry: "Kollywood", genres: ["Crime", "Action"], tier: "mid" },
  { query: "Oh My Kadavule", industry: "Kollywood", genres: ["Romance", "Fantasy"], tier: "mid" },
  { query: "Aruvi", industry: "Kollywood", genres: ["Drama"], tier: "deep" },
  { query: "Sarpatta Parambarai", industry: "Kollywood", genres: ["Drama", "Sports"], tier: "deep" },
  { query: "Kuttram Kadithal", industry: "Kollywood", genres: ["Drama"], tier: "deep" },
  { query: "Maanagaram", industry: "Kollywood", genres: ["Thriller", "Action"], tier: "deep" },
  { query: "Jigarthanda", industry: "Kollywood", genres: ["Crime", "Comedy"], tier: "deep" },
  { query: "Mandela Tamil", industry: "Kollywood", genres: ["Comedy", "Drama"], tier: "deep" },
  { query: "Pannaiyarum Padminiyum", industry: "Kollywood", genres: ["Comedy", "Drama"], tier: "deep" },
  { query: "Kaaka Muttai", industry: "Kollywood", genres: ["Drama", "Comedy"], tier: "deep" },
  { query: "Viduthalai Part 1", industry: "Kollywood", genres: ["Crime", "Drama"], tier: "mid" },
  { query: "Dada Tamil", industry: "Kollywood", genres: ["Drama", "Romance"], tier: "deep" },

  // Bollywood
  { query: "3 Idiots", industry: "Bollywood", genres: ["Comedy", "Drama"], tier: "top" },
  { query: "Dangal", industry: "Bollywood", genres: ["Drama", "Sports"], tier: "top" },
  { query: "Zindagi Na Milegi Dobara", industry: "Bollywood", genres: ["Comedy", "Drama"], tier: "top" },
  { query: "Andhadhun", industry: "Bollywood", genres: ["Thriller", "Comedy"], tier: "top" },
  { query: "Wake Up Sid", industry: "Bollywood", genres: ["Drama", "Romance"], tier: "mid" },
  { query: "Queen 2013", industry: "Bollywood", genres: ["Comedy", "Drama"], tier: "mid" },
  { query: "Tamasha", industry: "Bollywood", genres: ["Drama", "Romance"], tier: "mid" },
  { query: "Tumbbad", industry: "Bollywood", genres: ["Horror", "Fantasy"], tier: "mid" },
  { query: "Masaan", industry: "Bollywood", genres: ["Drama", "Romance"], tier: "deep" },
  { query: "Lunchbox", industry: "Bollywood", genres: ["Romance", "Drama"], tier: "deep" },
  { query: "Udaan", industry: "Bollywood", genres: ["Drama"], tier: "deep" },
  { query: "Detective Byomkesh Bakshy", industry: "Bollywood", genres: ["Mystery", "Thriller"], tier: "deep" },
  { query: "Karwaan", industry: "Bollywood", genres: ["Comedy", "Drama"], tier: "deep" },
  { query: "October", industry: "Bollywood", genres: ["Drama", "Romance"], tier: "deep" },
  { query: "A Death in the Gunj", industry: "Bollywood", genres: ["Drama"], tier: "deep" },
  { query: "Mard Ko Dard Nahi Hota", industry: "Bollywood", genres: ["Action", "Comedy"], tier: "deep" },
  { query: "Qarib Qarib Singlle", industry: "Bollywood", genres: ["Romance", "Comedy"], tier: "deep" },
  { query: "Badhaai Do", industry: "Bollywood", genres: ["Comedy", "Drama"], tier: "deep" },

  // Sandalwood
  { query: "Kantara", industry: "Sandalwood", genres: ["Action", "Mystery"], tier: "top" },
  { query: "KGF Chapter 1", industry: "Sandalwood", genres: ["Action", "Crime"], tier: "top" },
  { query: "777 Charlie", industry: "Sandalwood", genres: ["Adventure", "Drama"], tier: "top" },
  { query: "Kirik Party", industry: "Sandalwood", genres: ["Comedy", "Drama"], tier: "mid" },
  { query: "Ulidavaru Kandanthe", industry: "Sandalwood", genres: ["Crime", "Drama"], tier: "mid" },
  { query: "Lucia Kannada", industry: "Sandalwood", genres: ["Thriller", "Sci-Fi"], tier: "mid" },
  { query: "U Turn Kannada", industry: "Sandalwood", genres: ["Mystery", "Thriller"], tier: "mid" },
  { query: "Dia Kannada", industry: "Sandalwood", genres: ["Romance", "Drama"], tier: "deep" },
  { query: "Garuda Gamana Vrishabha Vahana", industry: "Sandalwood", genres: ["Crime", "Drama"], tier: "deep" },
  { query: "Ondu Motteya Kathe", industry: "Sandalwood", genres: ["Comedy", "Drama"], tier: "deep" },
  { query: "Bell Bottom Kannada", industry: "Sandalwood", genres: ["Comedy", "Mystery"], tier: "deep" },
  { query: "Sarkari Hi Pra Shaale Kasaragodu", industry: "Sandalwood", genres: ["Comedy", "Drama"], tier: "deep" },
  { query: "Avane Srimannarayana", industry: "Sandalwood", genres: ["Adventure", "Fantasy"], tier: "deep" },
  { query: "Thithi", industry: "Sandalwood", genres: ["Comedy", "Drama"], tier: "deep" },
  { query: "Gantumoote", industry: "Sandalwood", genres: ["Drama", "Romance"], tier: "deep" },
  { query: "Rama Rama Re", industry: "Sandalwood", genres: ["Drama"], tier: "deep" },
  { query: "Sapta Sagaradaache Ello Side A", industry: "Sandalwood", genres: ["Romance", "Drama"], tier: "mid" },
  { query: "Hostel Hudugaru Bekagiddare", industry: "Sandalwood", genres: ["Comedy"], tier: "deep" },
];

export function shuffle<T>(array: T[]) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function genreToMoodTags(genres: string[]) {
  const set = new Set<string>();

  if (genres.includes("Drama")) set.add("emotional");
  if (genres.includes("Romance")) set.add("warm");
  if (genres.includes("Comedy")) set.add("comfort");
  if (genres.includes("Thriller") || genres.includes("Mystery") || genres.includes("Crime")) set.add("tense");
  if (genres.includes("Action") || genres.includes("Adventure")) set.add("excited");
  if (genres.includes("Fantasy") || genres.includes("Sci-Fi")) set.add("curious");
  if (genres.includes("Horror")) set.add("dark");
  if (genres.includes("Sports")) set.add("inspired");
  if (genres.includes("Family")) set.add("comfort");

  if (!set.size) set.add("reflective");
  return Array.from(set);
}

export function genreToPace(genres: string[]): "fast" | "easy" | "medium" | "slow-burn" {
  if (genres.includes("Action") || genres.includes("Thriller")) return "fast";
  if (genres.includes("Comedy") || genres.includes("Romance") || genres.includes("Family")) return "easy";
  if (genres.includes("Mystery") || genres.includes("Drama")) return "slow-burn";
  return "medium";
}

export function genreToAttention(genres: string[]): "low" | "medium" | "high" {
  if (genres.includes("Mystery") || genres.includes("Crime") || genres.includes("Sci-Fi")) return "high";
  if (genres.includes("Action") || genres.includes("Comedy") || genres.includes("Adventure")) return "low";
  return "medium";
}

export function buildDescription(movie: { industry: string; genres: string[]; title?: string }) {
  return `${movie.industry} ${movie.genres.join(" / ")} pick selected for mood-based discovery and one-at-a-time recommendations.`;
}

export function inferUserType(
  attention: "low" | "medium" | "high",
  likedGenres: string[],
  likedIndustries: string[]
) {
  if (attention === "low" && likedGenres.includes("Thriller")) return "Low-attention thriller seeker";
  if (likedIndustries.length >= 3 && likedGenres.includes("Drama")) return "Cross-industry emotional explorer";
  if (likedGenres.includes("Comedy") && likedGenres.includes("Romance")) return "Comfort-first feel-good viewer";
  if (likedGenres.includes("Action")) return "Energy-driven spectacle viewer";
  if (likedGenres.includes("Mystery") || likedGenres.includes("Crime")) return "Puzzle-loving slow-burn explorer";
  return "Adaptive movie explorer";
}

export function buildReason(
  movie: MovieItem,
  mood: string,
  chat: string,
  likedIndustries: string[],
  likedGenres: string[] = []
) {
  const reasons: string[] = [];
  const q = chat.toLowerCase();

  if (movie.moodTags?.includes(mood)) reasons.push(`matches your ${mood} mood`);
  if (likedIndustries.includes(movie.industry)) reasons.push(`fits your growing ${movie.industry} preference`);
  if (movie.genres.some((genre) => likedGenres.includes(genre))) reasons.push(`leans into genres you already respond to`);
  if (q.includes("thriller") && movie.genres.includes("Thriller")) reasons.push("leans into the thriller vibe you asked for");
  if (q.includes("comfort") && movie.genres.some((g) => ["Comedy", "Romance", "Drama", "Family"].includes(g))) reasons.push("feels warm and easy to get into");
  if (q.includes("smart") && movie.attention === "high") reasons.push("has the layered storytelling you seem to want tonight");
  if (q.includes("fast") && movie.pace === "fast") reasons.push("keeps the pace moving");
  if (q.includes("subtitles") && movie.language !== "English") reasons.push(`opens up a strong ${movie.language} pick`);

  if (!reasons.length) reasons.push("balances your taste, mood, and watched history");
  return `Chosen because it ${reasons.join(", ")}.`;
}

export function scoreMovie(
  movie: MovieItem,
  profile: ProfileShape,
  mood: string,
  chat: string,
  watched: string[],
  disliked: string[],
  likedIndustries: string[],
  reviews: { movie: string; reaction: string; note?: string }[] = []
) {
  let score = 0;

  if (watched.includes(movie.title)) score -= 1000;
  if (disliked.includes(movie.title)) score -= 200;

  movie.genres.forEach((genre) => {
    if (profile.likedGenres.includes(genre)) score += 14;
  });

  if (likedIndustries.includes(movie.industry)) score += 18;

  if (profile.subtitleComfort && movie.language !== "English") score += 6;
  if (!profile.subtitleComfort && movie.language !== "English") score -= 8;

  if (profile.attention === "low" && ["fast", "easy"].includes(movie.pace)) score += 12;
  if (profile.attention === "low" && movie.attention === "high") score -= 10;
  if (profile.attention === "high" && movie.attention === "high") score += 12;
  if (profile.attention === "medium" && movie.attention === "medium") score += 8;

  if (movie.moodTags.includes(mood)) score += 22;

  const q = chat.toLowerCase();
  if (q.includes("fast") && movie.pace === "fast") score += 12;
  if (q.includes("slow") && movie.pace === "slow-burn") score += 10;
  if (q.includes("emotional") && movie.genres.includes("Drama")) score += 12;
  if (q.includes("thriller") && movie.genres.includes("Thriller")) score += 16;
  if (q.includes("romance") && movie.genres.includes("Romance")) score += 14;
  if (q.includes("comedy") && movie.genres.includes("Comedy")) score += 14;
  if (q.includes("action") && movie.genres.includes("Action")) score += 14;
  if (q.includes("smart") && movie.attention === "high") score += 10;
  if (q.includes("not depressing") && movie.moodTags.includes("dark")) score -= 14;

  if (movie.tier === "mid") score += 2;
  if (movie.tier === "deep") score += 4;

  const feedbackForMovie = reviews.filter((entry) => entry.movie === movie.title);
  feedbackForMovie.forEach((entry) => {
    if (entry.reaction === "Loved" || entry.reaction === "Smart Pick") score += 8;
    if (entry.reaction === "Too Slow" || entry.reaction === "Not Now") score -= 18;
  });

  score += Math.random() * 2;
  return score;
}

export function pickBalancedOnboarding(library: MovieItem[], total = 18) {
  if (!library.length) return [];

  const picks: MovieItem[] = [];
  const perIndustryBase = Math.max(2, Math.floor(total / INDUSTRIES.length));

  INDUSTRIES.forEach((industry) => {
    const pool = shuffle(library.filter((movie) => movie.industry === industry));
    const topPool = shuffle(pool.filter((movie) => movie.tier === "top"));
    const midPool = shuffle(pool.filter((movie) => movie.tier === "mid"));
    const deepPool = shuffle(pool.filter((movie) => movie.tier === "deep"));

    const local: MovieItem[] = [];
    if (topPool[0]) local.push(topPool[0]);
    if (midPool[0]) local.push(midPool[0]);
    if (deepPool[0]) local.push(deepPool[0]);

    const fillPool = shuffle([...topPool.slice(1), ...midPool.slice(1), ...deepPool.slice(1)]);
    while (local.length < perIndustryBase && fillPool.length) {
      local.push(fillPool.shift() as MovieItem);
    }

    picks.push(...local);
  });

  const deduped = picks.filter(
    (movie, index, arr) =>
      arr.findIndex((candidate) => candidate.title.toLowerCase() === movie.title.toLowerCase()) === index
  );

  if (deduped.length < total) {
    const remainder = shuffle(
      library.filter(
        (movie) =>
          !deduped.some((picked) => picked.title.toLowerCase() === movie.title.toLowerCase())
      )
    );
    deduped.push(...remainder.slice(0, total - deduped.length));
  }

  return shuffle(deduped).slice(0, total);
}

function normalizeRuntime(runtime?: number | null) {
  if (!runtime || Number.isNaN(runtime)) return 120;
  return runtime;
}

function normalizeMovie(seed: SeedMovie, movie: any, index: number): MovieItem {
  const poster = movie?.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : PLACEHOLDER_POSTER;
  const backdrop = movie?.backdrop_path ? `${TMDB_BACKDROP_BASE}${movie.backdrop_path}` : poster || PLACEHOLDER_BACKDROP;
  const title = movie?.title || seed.query;
  const year = movie?.release_date?.split("-")?.[0] || "";
  const overview = movie?.overview || buildDescription({ ...seed, title });

  return {
    id: movie?.id || `${seed.industry}-${index}`,
    title,
    year,
    poster,
    backdrop,
    overview,
    description: overview,
    runtime: normalizeRuntime(movie?.runtime),
    language: INDUSTRY_LANGUAGES[seed.industry],
    industry: seed.industry,
    country: seed.industry,
    genres: seed.genres,
    pace: genreToPace(seed.genres),
    moodTags: genreToMoodTags(seed.genres),
    attention: genreToAttention(seed.genres),
    tier: seed.tier,
    query: seed.query,
    voteAverage: movie?.vote_average,
  };
}

export function buildFallbackLibrary(seed = MOVIE_LIBRARY_SEED): MovieItem[] {
  return seed.map((item, index) =>
    normalizeMovie(
      item,
      {
        id: `${item.industry}-${index}`,
        title: item.query,
        poster_path: null,
        backdrop_path: null,
        release_date: "",
        overview: buildDescription(item),
        runtime: 120,
      },
      index
    )
  );
}

async function fetchMovieDetails(tmdbId: number, bearerToken: string) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
      cache: "force-cache",
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function fetchMovieLibraryFromTMDB(
  bearerToken?: string,
  seed = MOVIE_LIBRARY_SEED
): Promise<MovieItem[]> {
  if (!bearerToken) {
    return buildFallbackLibrary(seed);
  }

  try {
    const results = await Promise.all(
      seed.map(async (item, index) => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(item.query)}&include_adult=false`,
            {
              headers: {
                Authorization: `Bearer ${bearerToken}`,
                "Content-Type": "application/json",
              },
              cache: "force-cache",
            }
          );

          if (!response.ok) {
            return normalizeMovie(item, null, index);
          }

          const data = await response.json();
          const match = data?.results?.[0] || null;
          let details = null;

          if (match?.id) {
            details = await fetchMovieDetails(match.id, bearerToken);
          }

          return normalizeMovie(
            item,
            {
              ...match,
              runtime: details?.runtime ?? 120,
            },
            index
          );
        } catch {
          return normalizeMovie(item, null, index);
        }
      })
    );

    return results;
  } catch {
    return buildFallbackLibrary(seed);
  }
}