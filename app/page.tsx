// @ts-nocheck
'use client';

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Film,
  Sparkles,
  MessageCircle,
  Clock3,
  Globe2,
  Heart,
  ThumbsDown,
  Star,
  Brain,
  ChevronRight,
  Play,
  RefreshCcw,
  Moon,
  Coffee,
  Zap,
  User,
  LogIn,
  LogOut,
  Plus,
  Clapperboard,
  Check,
  X,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const MOVIES = [
  {
    id: 1,
    title: "Her",
    year: 2013,
    country: "USA",
    language: "English",
    runtime: 126,
    genres: ["Drama", "Romance", "Sci-Fi"],
    pace: "slow-burn",
    moodTags: ["lonely", "emotional", "reflective", "warm"],
    attention: "medium",
    description: "A tender futuristic love story about connection, solitude, and emotional intimacy.",
    why: "Fits emotional, reflective nights and works well when you want depth without heavy complexity.",
    backdrop: "https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 2,
    title: "Mad Max: Fury Road",
    year: 2015,
    country: "Australia / USA",
    language: "English",
    runtime: 120,
    genres: ["Action", "Adventure"],
    pace: "fast",
    moodTags: ["excited", "intense", "adrenaline"],
    attention: "low",
    description: "A relentless chase film with stunning visuals, explosive energy, and almost no wasted time.",
    why: "Perfect when you want immediate momentum and zero patience-testing setup.",
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 3,
    title: "Perfect Days",
    year: 2023,
    country: "Japan",
    language: "Japanese",
    runtime: 124,
    genres: ["Drama"],
    pace: "slow-burn",
    moodTags: ["calm", "healing", "quiet", "reflective"],
    attention: "high",
    description: "A meditative portrait of routine, beauty, loneliness, and quiet joy in everyday life.",
    why: "Best for calm moods when you want something gentle, intimate, and quietly meaningful.",
    backdrop: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 4,
    title: "Parasite",
    year: 2019,
    country: "South Korea",
    language: "Korean",
    runtime: 132,
    genres: ["Thriller", "Drama", "Dark Comedy"],
    pace: "medium",
    moodTags: ["curious", "smart", "dark", "tense"],
    attention: "medium",
    description: "A razor-sharp class thriller that shifts tones brilliantly while staying gripping throughout.",
    why: "Strong pick if you want intelligent storytelling with tension, style, and memorable turns.",
    backdrop: "https://images.unsplash.com/photo-1505685296765-3a2736de412f?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 5,
    title: "Paddington 2",
    year: 2017,
    country: "UK",
    language: "English",
    runtime: 103,
    genres: ["Family", "Comedy", "Adventure"],
    pace: "easy",
    moodTags: ["comfort", "happy", "warm", "light"],
    attention: "low",
    description: "An irresistibly charming comfort watch full of kindness, warmth, and playful humor.",
    why: "Excellent when you want something light, wholesome, and impossible to regret.",
    backdrop: "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 6,
    title: "Prisoners",
    year: 2013,
    country: "USA",
    language: "English",
    runtime: 153,
    genres: ["Thriller", "Mystery", "Crime"],
    pace: "medium",
    moodTags: ["dark", "tense", "serious", "intense"],
    attention: "high",
    description: "A bleak, absorbing mystery driven by desperation, moral conflict, and sustained tension.",
    why: "Great for serious thriller mode when you want something heavy, gripping, and immersive.",
    backdrop: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1600&q=80",
  },
];

const CHAT_PRESETS = [
  "I want something emotional but not depressing",
  "Give me a fast movie, I’m tired",
  "I want a smart thriller tonight",
  "Something warm and comforting",
  "I’m okay with subtitles",
];

const INDUSTRIES = [
  "Hollywood",
  "Mollywood",
  "Tollywood",
  "Kollywood",
  "Bollywood",
  "Sandalwood",
];

const TMDB_SEED = [
  { query: "Inception", industry: "Hollywood", genres: ["Sci-Fi", "Thriller"] },
  { query: "Interstellar", industry: "Hollywood", genres: ["Sci-Fi", "Drama"] },
  { query: "Drishyam 2013", industry: "Mollywood", genres: ["Thriller", "Drama"] },
  { query: "Bangalore Days", industry: "Mollywood", genres: ["Drama", "Comedy"] },
  { query: "RRR", industry: "Tollywood", genres: ["Action", "Drama"] },
  { query: "Baahubali 2", industry: "Tollywood", genres: ["Action", "Adventure"] },
  { query: "96 Tamil", industry: "Kollywood", genres: ["Romance", "Drama"] },
  { query: "Vikram 2022", industry: "Kollywood", genres: ["Action", "Thriller"] },
  { query: "3 Idiots", industry: "Bollywood", genres: ["Comedy", "Drama"] },
  { query: "Dangal", industry: "Bollywood", genres: ["Drama", "Sports"] },
  { query: "Kantara", industry: "Sandalwood", genres: ["Action", "Mystery"] },
  { query: "KGF Chapter 1", industry: "Sandalwood", genres: ["Action", "Crime"] },
];

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const defaultProfile = {
  likedGenres: ["Drama", "Thriller"],
  subtitleComfort: true,
  attention: "low",
  mood: "emotional",
  chat: "I want something emotional but not depressing",
  watched: [],
  disliked: [],
  reviews: [],
  watchedEntries: [],
  onboardingComplete: false,
  onboardingIndex: 0,
};

const storage = {
  getUsers() {
    try {
      return JSON.parse(localStorage.getItem("cinemuse-users") || "{}");
    } catch {
      return {};
    }
  },
  saveUsers(nextUsers) {
    localStorage.setItem("cinemuse-users", JSON.stringify(nextUsers));
  },
  getCurrentUser() {
    return localStorage.getItem("cinemuse-current-user") || "";
  },
  setCurrentUser(name) {
    localStorage.setItem("cinemuse-current-user", name);
  },
  clearCurrentUser() {
    localStorage.removeItem("cinemuse-current-user");
  },
};

function scoreMovie(movie, profile, mood, chat, watched, disliked) {
  let score = 0;

  if (watched.includes(movie.title)) score -= 100;
  if (disliked.includes(movie.title)) score -= 35;

  movie.genres.forEach((g) => {
    if (profile.likedGenres.includes(g)) score += 10;
  });

  if (profile.subtitleComfort && movie.language !== "English") score += 7;
  if (!profile.subtitleComfort && movie.language !== "English") score -= 6;

  if (profile.attention === "low" && ["fast", "easy"].includes(movie.pace)) score += 12;
  if (profile.attention === "low" && movie.attention === "high") score -= 8;
  if (profile.attention === "high" && movie.attention === "high") score += 6;

  if (movie.moodTags.includes(mood)) score += 16;

  const q = chat.toLowerCase();
  if (q.includes("fast") && movie.pace === "fast") score += 15;
  if (q.includes("slow") && movie.pace === "slow-burn") score += 10;
  if (q.includes("emotional") && movie.moodTags.some((t) => ["emotional", "warm", "reflective"].includes(t))) score += 12;
  if (q.includes("thriller") && movie.genres.includes("Thriller")) score += 14;
  if ((q.includes("comfort") || q.includes("warm")) && movie.moodTags.some((t) => ["comfort", "warm", "happy", "light"].includes(t))) score += 15;
  if (q.includes("subtitles") && movie.language !== "English") score += 12;
  if (q.includes("not depressing") && movie.moodTags.includes("dark")) score -= 10;

  score += Math.random() * 2;
  return score;
}

function Badge({ children }) {
  return (
    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/80 backdrop-blur-md">
      {children}
    </span>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 text-white">
        <Icon className="h-4 w-4 text-violet-300" />
        <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white/90">{title}</h3>
      </div>
      <p className="mt-1 text-sm text-white/55">{subtitle}</p>
    </div>
  );
}

function StarPicker({ rating, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <button key={value} type="button" onClick={() => onChange(value)} className="transition hover:scale-110">
          <Star className={`h-5 w-5 ${value <= rating ? "fill-violet-300 text-violet-300" : "text-white/30"}`} />
        </button>
      ))}
    </div>
  );
}

function AuthCard({ loginName, setLoginName, handleLogin, handleCreateUser, existingUsers }) {
  return (
    <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl items-center px-6 py-10 lg:px-10">
      <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[34px] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-violet-200">
            <Sparkles className="h-3.5 w-3.5" />
            CineMuse AI
          </div>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-white lg:text-6xl">
            Find the perfect movie for your <span className="text-violet-300">mood</span>.
          </h1>
          <p className="mt-4 max-w-xl text-base text-white/65 lg:text-lg">
            Stop scrolling endlessly. Tell us your mood and taste — we’ll pick one perfect movie for you instantly.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge>One movie at a time</Badge>
            <Badge>Poster-based setup</Badge>
            <Badge>Built for Indian audiences too</Badge>
          </div>
        </div>

        <div className="rounded-[34px] border border-white/10 bg-black/30 p-6 shadow-2xl backdrop-blur-2xl">
          <SectionTitle icon={LogIn} title="Start your movie journey" subtitle="Create a profile and answer a quick watched / not watched poster quiz." />
          <input
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-white/30"
            placeholder="Enter a username, for example Ajwin"
          />
          <div className="mt-4 flex gap-3">
            <button onClick={handleLogin} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black">
              <LogIn className="h-4 w-4" /> Login
            </button>
            <button onClick={handleCreateUser} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white/85">
              <Plus className="h-4 w-4" /> Create profile
            </button>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/55">Existing users</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {existingUsers.length > 0 ? existingUsers.map((name) => (
                <button key={name} onClick={() => setLoginName(name)} className="rounded-full border border-white/10 bg-black/25 px-3 py-2 text-xs text-white/80">
                  {name}
                </button>
              )) : <p className="text-sm text-white/50">No profiles yet. Create your first one.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OnboardingCard({
  currentUser,
  currentMovie,
  currentIndex,
  total,
  currentRating,
  setCurrentRating,
  markWatched,
  markNotWatched,
  finishOnboarding,
  watchedEntries,
  loading,
}) {
  return (
    <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10 lg:px-10">
      <div className="w-full rounded-[34px] border border-white/10 bg-black/35 p-6 shadow-2xl backdrop-blur-2xl lg:p-8">
        <SectionTitle
          icon={Clapperboard}
          title={`Build ${currentUser}'s taste profile`}
          subtitle="We picked a mixed starter set from Hollywood, Mollywood, Tollywood, Kollywood, Bollywood, and Sandalwood. Just tell us if you’ve watched each one."
        />

        {loading ? (
          <div className="rounded-[28px] border border-white/10 bg-white/10 p-12 text-center text-white/70">
            Loading posters and movies for your onboarding...
          </div>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <Badge>{Math.min(currentIndex + 1, total)} / {total}</Badge>
              <Badge>{currentMovie?.industry || "Movie"}</Badge>
              {(currentMovie?.genres || []).map((genre) => <Badge key={genre}>{genre}</Badge>)}
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl">
                <div className="aspect-[2/3] w-full overflow-hidden bg-black/30">
                  <img src={currentMovie?.poster} alt={currentMovie?.title} className="h-full w-full object-cover" />
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.3em] text-violet-200/80">Onboarding pick</p>
                <h2 className="mt-2 text-4xl font-semibold tracking-tight text-white lg:text-5xl">{currentMovie?.title || "Movie"}</h2>
                <p className="mt-3 text-base text-white/60">{currentMovie?.year || ""} {currentMovie?.year ? "•" : ""} {currentMovie?.industry || ""}</p>
                <p className="mt-5 text-sm text-white/55">Have you watched this movie?</p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button onClick={() => markWatched(currentMovie, currentRating)} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black">
                    <Check className="h-4 w-4" /> Watched
                  </button>
                  <button onClick={() => markNotWatched(currentMovie)} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white/85 hover:bg-white/10">
                    <X className="h-4 w-4" /> Not watched
                  </button>
                </div>

                <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-white/60">If watched, rate it with stars</p>
                  <div className="mt-3">
                    <StarPicker rating={currentRating} onChange={setCurrentRating} />
                  </div>
                </div>

                <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-white/60">Saved taste signals</p>
                      <p className="mt-1 text-white">{watchedEntries.length} watched movie{watchedEntries.length === 1 ? "" : "s"} captured</p>
                    </div>
                    <button onClick={finishOnboarding} className="rounded-full border border-violet-300/40 bg-violet-400/15 px-5 py-3 text-sm text-white hover:bg-violet-400/20">
                      Finish for now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function CinematicMovieAIApp() {
  const [loginName, setLoginName] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [users, setUsers] = useState({});
  const [likedGenres, setLikedGenres] = useState(defaultProfile.likedGenres);
  const [subtitleComfort, setSubtitleComfort] = useState(defaultProfile.subtitleComfort);
  const [attention, setAttention] = useState(defaultProfile.attention);
  const [mood, setMood] = useState(defaultProfile.mood);
  const [chat, setChat] = useState(defaultProfile.chat);
  const [watched, setWatched] = useState(defaultProfile.watched);
  const [disliked, setDisliked] = useState(defaultProfile.disliked);
  const [reviews, setReviews] = useState(defaultProfile.reviews);
  const [feedbackText, setFeedbackText] = useState("");
  const [refreshSeed, setRefreshSeed] = useState(0);
  const [watchedEntries, setWatchedEntries] = useState([]);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [onboardingIndex, setOnboardingIndex] = useState(0);
  const [currentOnboardingRating, setCurrentOnboardingRating] = useState(4);
  const [onboardingMovies, setOnboardingMovies] = useState([]);
  const [onboardingLoading, setOnboardingLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUsers = storage.getUsers();
      const storedCurrentUser = storage.getCurrentUser();
      setUsers(storedUsers);
      if (storedCurrentUser && storedUsers[storedCurrentUser]) {
        loadUser(storedCurrentUser, storedUsers);
      }
    } catch (e) {
      console.error("Failed to load saved profiles", e);
    }
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      setOnboardingLoading(true);
      try {
        const results = await Promise.all(
          TMDB_SEED.map(async (item) => {
            const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(item.query)}`, {
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_BEARER_TOKEN}`,
                "Content-Type": "application/json",
              },
            });
            const data = await res.json();
            const movie = data.results?.[0];
            if (!movie) return null;

            return {
              title: movie.title,
              year: movie.release_date?.split("-")[0] || "",
              poster: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : "https://placehold.co/600x900",
              genres: item.genres,
              industry: item.industry,
            };
          })
        );

        const cleaned = results.filter(Boolean);
        setOnboardingMovies(cleaned);
      } catch (err) {
        console.error("TMDB fetch failed", err);
        setOnboardingMovies(
          TMDB_SEED.map((item) => ({
            title: item.query,
            year: "",
            poster: "https://placehold.co/600x900",
            genres: item.genres,
            industry: item.industry,
          }))
        );
      } finally {
        setOnboardingLoading(false);
      }
    };

    fetchMovies();
  }, []);

  function loadUser(name, userMap = users) {
    const data = userMap[name] || defaultProfile;
    setCurrentUser(name);
    setLikedGenres(data.likedGenres || defaultProfile.likedGenres);
    setSubtitleComfort(data.subtitleComfort ?? defaultProfile.subtitleComfort);
    setAttention(data.attention || defaultProfile.attention);
    setMood(data.mood || defaultProfile.mood);
    setChat(data.chat || defaultProfile.chat);
    setWatched(data.watched || defaultProfile.watched);
    setDisliked(data.disliked || defaultProfile.disliked);
    setReviews(data.reviews || defaultProfile.reviews);
    setWatchedEntries(data.watchedEntries || []);
    setOnboardingComplete(data.onboardingComplete || false);
    setOnboardingIndex(data.onboardingIndex || 0);
    storage.setCurrentUser(name);
  }

  useEffect(() => {
    if (!currentUser) return;
    const updatedUser = {
      likedGenres,
      subtitleComfort,
      attention,
      mood,
      chat,
      watched,
      disliked,
      reviews,
      watchedEntries,
      onboardingComplete,
      onboardingIndex,
    };
    const nextUsers = { ...users, [currentUser]: updatedUser };
    setUsers(nextUsers);
    storage.saveUsers(nextUsers);
  }, [currentUser, likedGenres, subtitleComfort, attention, mood, chat, watched, disliked, reviews, watchedEntries, onboardingComplete, onboardingIndex]);

  const profile = { likedGenres, subtitleComfort, attention };

  const topMovie = useMemo(() => {
    return [...MOVIES]
      .map((m) => ({ ...m, score: scoreMovie(m, profile, mood, chat, watched, disliked) + refreshSeed * Math.random() }))
      .sort((a, b) => b.score - a.score)[0];
  }, [likedGenres, subtitleComfort, attention, mood, chat, watched, disliked, refreshSeed]);

  const userType = useMemo(() => {
    if (attention === "low" && likedGenres.includes("Thriller")) return "Low-attention thriller seeker";
    if (likedGenres.includes("Drama") && subtitleComfort) return "Emotion-first global cinema explorer";
    if (likedGenres.includes("Family")) return "Comfort-watch mood viewer";
    return "Adaptive mainstream explorer";
  }, [attention, likedGenres, subtitleComfort]);

  const memorySummary = useMemo(() => {
    if (reviews.length === 0 && watchedEntries.length === 0) return "Memory is still forming. Mark watched films in onboarding and give feedback to sharpen the engine.";
    if (reviews.length > 0) {
      const last = reviews[reviews.length - 1];
      return `Last learning update: you ${last.reaction.toLowerCase()} "${last.movie}" because "${last.note}".`;
    }
    const favoriteEntry = [...watchedEntries].sort((a, b) => b.rating - a.rating)[0];
    return `You rated "${favoriteEntry.title}" from ${favoriteEntry.industry} at ${favoriteEntry.rating} stars.`;
  }, [reviews, watchedEntries]);

  const currentOnboardingMovie = onboardingMovies[onboardingIndex] || onboardingMovies[onboardingMovies.length - 1] || {
    title: "Loading",
    year: "",
    poster: "https://placehold.co/600x900",
    genres: [],
    industry: "Movie",
  };

  const submitReview = (reaction) => {
    if (!topMovie) return;
    const entry = {
      movie: topMovie.title,
      reaction,
      note: feedbackText || "no extra note",
      time: new Date().toLocaleString(),
    };
    setReviews((prev) => [...prev, entry]);
    if (reaction === "Loved" || reaction === "Smart Pick") {
      setLikedGenres((prev) => Array.from(new Set([...prev, ...topMovie.genres])));
      setWatched((prev) => Array.from(new Set([...prev, topMovie.title])));
    }
    if (reaction === "Too Slow" || reaction === "Not Now") {
      setDisliked((prev) => Array.from(new Set([...prev, topMovie.title])));
    }
    setFeedbackText("");
  };

  const handleCreateUser = () => {
    const name = loginName.trim();
    if (!name) return;
    const nextUsers = {
      ...users,
      [name]: {
        ...defaultProfile,
        watched: [],
        watchedEntries: [],
        onboardingComplete: false,
        onboardingIndex: 0,
      },
    };
    setUsers(nextUsers);
    storage.saveUsers(nextUsers);
    loadUser(name, nextUsers);
  };

  const moveToNextOnboardingMovie = () => {
    if (onboardingIndex < onboardingMovies.length - 1) {
      setOnboardingIndex((prev) => prev + 1);
      setCurrentOnboardingRating(4);
    } else {
      setOnboardingComplete(true);
    }
  };

  const markWatched = (movie, rating) => {
    if (!movie?.title) return;
    const newEntry = {
      title: movie.title,
      industry: movie.industry,
      rating,
      genres: movie.genres,
    };
    setWatchedEntries((prev) => [...prev, newEntry]);
    setWatched((prev) => Array.from(new Set([...prev, movie.title])));
    if (rating >= 4) {
      setLikedGenres((prev) => Array.from(new Set([...prev, ...movie.genres])));
    }
    moveToNextOnboardingMovie();
  };

  const markNotWatched = (movie) => {
    if (!movie?.title) return;
    setDisliked((prev) => Array.from(new Set([...prev, movie.title])));
    moveToNextOnboardingMovie();
  };

  const finishOnboarding = () => {
    setOnboardingComplete(true);
  };

  const watchThisTonight = () => {
    if (!topMovie) return;
    setWatched((prev) => Array.from(new Set([...prev, topMovie.title])));
    setFeedbackText(`I watched ${topMovie.title} and `);
  };

  const refineRecommendation = () => {
    if (!topMovie) return;
    setDisliked((prev) => Array.from(new Set([...prev, topMovie.title])));
    setRefreshSeed((prev) => prev + 1);
  };

  const handleLogin = () => {
    const name = loginName.trim();
    if (!name || !users[name]) return;
    loadUser(name);
  };

  const logout = () => {
    setCurrentUser("");
    storage.clearCurrentUser();
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen overflow-hidden bg-[#07070b] text-white">
        <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-20" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.25),transparent_35%),linear-gradient(to_bottom,rgba(7,7,11,0.35),rgba(7,7,11,0.9)_45%,rgba(7,7,11,1))]" />
        <AuthCard loginName={loginName} setLoginName={setLoginName} handleLogin={handleLogin} handleCreateUser={handleCreateUser} existingUsers={Object.keys(users)} />
      </div>
    );
  }

  if (!onboardingComplete) {
    return (
      <div className="min-h-screen overflow-hidden bg-[#07070b] text-white">
        <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-15" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.25),transparent_35%),linear-gradient(to_bottom,rgba(7,7,11,0.35),rgba(7,7,11,0.92)_45%,rgba(7,7,11,1))]" />
        <OnboardingCard
          currentUser={currentUser}
          currentMovie={currentOnboardingMovie}
          currentIndex={onboardingIndex}
          total={onboardingMovies.length || TMDB_SEED.length}
          currentRating={currentOnboardingRating}
          setCurrentRating={setCurrentOnboardingRating}
          markWatched={markWatched}
          markNotWatched={markNotWatched}
          finishOnboarding={finishOnboarding}
          watchedEntries={watchedEntries}
          loading={onboardingLoading}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#07070b] text-white">
      <div className="fixed inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: `url(${topMovie?.backdrop})` }} />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.25),transparent_35%),linear-gradient(to_bottom,rgba(7,7,11,0.35),rgba(7,7,11,0.88)_45%,rgba(7,7,11,1))]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col gap-5 rounded-[30px] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-violet-200">
                <Sparkles className="h-3.5 w-3.5" />
                CineMuse AI
              </div>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white lg:text-6xl">
                One perfect movie. Chosen for your <span className="text-violet-300">mood</span>, taste, and attention.
              </h1>
              <p className="mt-4 max-w-2xl text-base text-white/65 lg:text-lg">
                A cinematic AI movie companion that studies what you watched, what you loved, how you react, and what you want tonight.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/85">
                <User className="h-4 w-4 text-violet-300" />
                {currentUser}
              </div>
              <button onClick={logout} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/85 hover:bg-white/10">
                <LogOut className="h-4 w-4" /> Log out
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { icon: Brain, label: userType },
              { icon: Moon, label: `Mood: ${mood}` },
              { icon: Coffee, label: `Attention: ${attention}` },
              { icon: Star, label: `${reviews.length + watchedEntries.length} taste signals` },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
                <item.icon className="mb-2 h-4 w-4 text-violet-300" />
                <p className="text-sm text-white/85">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="overflow-hidden rounded-[32px] border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl">
              <div className="relative min-h-[540px] p-6 lg:p-8">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute right-0 top-0 h-80 w-2/3 bg-cover bg-center opacity-35" style={{ backgroundImage: `url(${topMovie?.backdrop})` }} />
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-3 flex flex-wrap gap-2">
                        <Badge>Today’s pick</Badge>
                        <Badge>Confidence {Math.min(98, Math.round(topMovie?.score * 2.5 || 80))}%</Badge>
                        <Badge>Why this now?</Badge>
                      </div>
                      <h2 className="max-w-2xl text-4xl font-semibold tracking-tight lg:text-6xl">{topMovie?.title}</h2>
                      <div className="mt-4 flex flex-wrap gap-2 text-sm text-white/75">
                        <Badge>{topMovie?.year}</Badge>
                        <Badge>{topMovie?.country}</Badge>
                        <Badge>{topMovie?.language}</Badge>
                        <Badge>{topMovie?.runtime} min</Badge>
                        <Badge>{topMovie?.pace}</Badge>
                      </div>
                    </div>
                    <div className="hidden rounded-2xl border border-white/10 bg-black/35 p-3 text-white/75 lg:block">
                      <Film className="h-5 w-5 text-violet-300" />
                    </div>
                  </div>

                  <div>
                    <div className="mt-8 flex flex-wrap gap-2">
                      {topMovie?.genres.map((g) => <Badge key={g}>{g}</Badge>)}
                    </div>
                    <p className="mt-5 max-w-2xl text-base leading-7 text-white/78 lg:text-lg">{topMovie?.description}</p>
                    <div className="mt-6 rounded-3xl border border-violet-300/20 bg-violet-400/10 p-5 backdrop-blur-lg">
                      <p className="text-xs uppercase tracking-[0.3em] text-violet-200/80">Recommendation reasoning</p>
                      <p className="mt-2 text-sm leading-6 text-white/85">{topMovie?.why}</p>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button onClick={watchThisTonight} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:scale-[1.02]">
                        <Play className="h-4 w-4" /> Watch this tonight
                      </button>
                      <button onClick={refineRecommendation} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white/85 transition hover:bg-white/10">
                        <RefreshCcw className="h-4 w-4" /> Not this, refine mood
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
                <SectionTitle icon={Brain} title="Profile memory" subtitle="Signals learned from watched movies, ratings, and feedback." />
                <div className="space-y-3 text-sm text-white/78">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-white/55">General type</p>
                    <p className="mt-1 font-medium text-white">{userType}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-white/55">Taste signals</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {watchedEntries.slice(0, 6).map((entry, idx) => (
                        <Badge key={`${entry.title}-${idx}`}>{entry.title}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-white/55">Learning summary</p>
                    <p className="mt-1 leading-6">{memorySummary}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
                <SectionTitle icon={MessageCircle} title="Live recommendation chat" subtitle="Refine what you want right now" />
                <textarea value={chat} onChange={(e) => setChat(e.target.value)} className="min-h-[130px] w-full rounded-3xl border border-white/10 bg-black/25 p-4 text-sm text-white outline-none placeholder:text-white/30" placeholder="Tell the AI what you want to watch tonight..." />
                <div className="mt-3 flex flex-wrap gap-2">
                  {CHAT_PRESETS.map((item) => (
                    <button key={item} onClick={() => setChat(item)} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:bg-white/10">{item}</button>
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[ ["emotional", Heart], ["comfort", Coffee], ["intense", Zap], ["curious", Sparkles] ].map(([m, Icon]) => (
                    <button key={m} onClick={() => setMood(m)} className={`rounded-2xl border px-4 py-3 text-left transition ${mood === m ? "border-violet-300/50 bg-violet-400/15" : "border-white/10 bg-black/20 hover:bg-white/5"}`}>
                      <Icon className="mb-2 h-4 w-4 text-violet-300" />
                      <p className="text-sm capitalize text-white/85">{m}</p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
              <SectionTitle icon={Sparkles} title="Your profile" subtitle="Fine-tune your taste so every recommendation feels more personal." />
              <div className="space-y-5 text-sm">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-white/55">Active profile</p>
                  <div className="mt-2 flex items-center gap-2 text-white">
                    <User className="h-4 w-4 text-violet-300" />
                    <span className="font-medium">{currentUser}</span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-white/60">Attention span</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[ ["low", "Need easy picks"], ["medium", "Balanced"], ["high", "Can handle depth"] ].map(([val, label]) => (
                      <button key={val} onClick={() => setAttention(val)} className={`rounded-2xl border p-3 text-left ${attention === val ? "border-violet-300/50 bg-violet-400/15" : "border-white/10 bg-black/20"}`}>
                        <p className="font-medium capitalize text-white">{val}</p>
                        <p className="mt-1 text-xs text-white/55">{label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-white/55">Watched from major industries</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {INDUSTRIES.map((industry) => {
                      const count = watchedEntries.filter((entry) => entry.industry === industry).length;
                      return <Badge key={industry}>{industry}: {count}</Badge>;
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-white">Subtitle comfort</p>
                      <p className="mt-1 text-xs text-white/55">Helps the engine decide whether to recommend global cinema</p>
                    </div>
                    <button onClick={() => setSubtitleComfort((v) => !v)} className={`rounded-full px-4 py-2 text-xs ${subtitleComfort ? "bg-violet-400/20 text-violet-200" : "bg-white/10 text-white/70"}`}>
                      {subtitleComfort ? "Comfortable" : "Prefer local language"}
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-white/55">Previously watched</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {watched.length > 0 ? watched.map((m) => <Badge key={m}>{m}</Badge>) : <p className="text-sm text-white/45">No movies added yet.</p>}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
              <SectionTitle icon={Star} title="After watching" subtitle="Your reaction updates memory and future recommendations" />
              <textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} className="min-h-[92px] w-full rounded-3xl border border-white/10 bg-black/25 p-4 text-sm text-white outline-none placeholder:text-white/30" placeholder={`Tell the AI what you felt about ${topMovie?.title}...`} />
              <div className="mt-4 flex flex-wrap gap-2">
                {[ ["Loved", Heart], ["Too Slow", Clock3], ["Not Now", ThumbsDown], ["Smart Pick", Sparkles] ].map(([label, Icon]) => (
                  <button key={label} onClick={() => submitReview(label)} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white/85 hover:bg-white/10">
                    <Icon className="h-4 w-4 text-violet-300" /> {label}
                  </button>
                ))}
              </div>

              <div className="mt-5 space-y-3">
                <AnimatePresence>
                  {reviews.slice().reverse().slice(0, 3).map((r, idx) => (
                    <motion.div key={`${r.movie}-${r.time}-${idx}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-white">{r.movie}</p>
                        <Badge>{r.reaction}</Badge>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-white/68">{r.note}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-[28px] border border-white/10 bg-gradient-to-br from-violet-400/15 to-white/5 p-6 backdrop-blur-xl">
              <SectionTitle icon={Globe2} title="Why CineMuse" subtitle="A more personal way to discover what to watch next." />
              <div className="space-y-3 text-sm text-white/75">
                {[
                  "Built around your personal taste and mood",
                  "Asks what you’ve watched from industries your audience follows",
                  "One movie at a time instead of endless lists",
                  "Mood, attention, and taste combined in one recommendation loop",
                  "Review memory updates after every watch",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-3">
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
                    <p>{point}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
