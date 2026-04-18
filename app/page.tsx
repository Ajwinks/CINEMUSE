// app/page.tsx
// @ts-nocheck
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  Check,
  ChevronRight,
  Clapperboard,
  Clock3,
  Coffee,
  Film,
  Globe2,
  Heart,
  LogIn,
  LogOut,
  MessageCircle,
  Moon,
  Play,
  Plus,
  RefreshCcw,
  Sparkles,
  Star,
  ThumbsDown,
  User,
  X,
  Zap,
} from "lucide-react";
import {
  CHAT_PRESETS,
  INDUSTRIES,
  MOVIE_LIBRARY_SEED,
  PLACEHOLDER_BACKDROP,
  PLACEHOLDER_POSTER,
  buildFallbackLibrary,
  buildReason,
  fetchMovieLibraryFromTMDB,
  inferUserType,
  pickBalancedOnboarding,
  scoreMovie,
} from "@/lib/movieLibrary";

const defaultProfile = {
  likedGenres: [],
  likedIndustries: [],
  subtitleComfort: true,
  attention: "low",
  mood: "emotional",
  chat: CHAT_PRESETS[0],
  watched: [],
  disliked: [],
  reviews: [],
  watchedEntries: [],
  onboardingComplete: false,
  onboardingIndex: 0,
  onboardingQueue: [],
};

const storage = {
  getUsers() {
    try {
      return JSON.parse(localStorage.getItem("cinemuse-users") || "{}");
    } catch {
      return {};
    }
  },
  saveUsers(nextUsers: Record<string, any>) {
    localStorage.setItem("cinemuse-users", JSON.stringify(nextUsers));
  },
  getCurrentUser() {
    return localStorage.getItem("cinemuse-current-user") || "";
  },
  setCurrentUser(name: string) {
    localStorage.setItem("cinemuse-current-user", name);
  },
  clearCurrentUser() {
    localStorage.removeItem("cinemuse-current-user");
  },
};

function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "accent" | "soft" }) {
  const tones = {
    default: "border-white/15 bg-white/10 text-white/80",
    accent: "border-violet-300/25 bg-violet-400/10 text-violet-100",
    soft: "border-white/10 bg-black/25 text-white/70",
  };

  return (
    <span className={`rounded-full border px-3 py-1 text-xs backdrop-blur-md ${tones[tone]}`}>
      {children}
    </span>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: any;
  title: string;
  subtitle: string;
}) {
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

function StarPicker({
  rating,
  onChange,
}: {
  rating: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className="rounded-full p-1 transition hover:scale-110"
        >
          <Star
            className={`h-5 w-5 ${
              value <= rating ? "fill-violet-300 text-violet-300" : "text-white/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function TogglePill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm transition ${
        active
          ? "border-violet-300/40 bg-violet-400/15 text-white"
          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

function AuthCard({
  loginName,
  setLoginName,
  handleLogin,
  handleCreateUser,
  existingUsers,
  libraryCount,
}: {
  loginName: string;
  setLoginName: (v: string) => void;
  handleLogin: () => void;
  handleCreateUser: () => void;
  existingUsers: string[];
  libraryCount: number;
}) {
  return (
    <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10 lg:px-10">
      <div className="grid w-full gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="rounded-[34px] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-violet-200">
            <Sparkles className="h-3.5 w-3.5" />
            CineMuse AI
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white lg:text-6xl">
            One film at a time, picked for your mood and taste.
          </h1>

          <p className="mt-4 max-w-2xl text-base text-white/65 lg:text-lg">
            CineMuse learns from what you watched, rated, skipped, and loved across Hollywood,
            Mollywood, Tollywood, Kollywood, Bollywood, and Sandalwood.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge tone="accent">Poster-based onboarding</Badge>
            <Badge>{libraryCount}+ seeded titles</Badge>
            <Badge>Balanced across 6 industries</Badge>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {[
              "No fake watched history for new users",
              "Recommendations avoid watched and disliked titles",
              "TMDB posters with graceful fallback",
            ].map((line) => (
              <div key={line} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/72">
                {line}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[34px] border border-white/10 bg-black/30 p-6 shadow-2xl backdrop-blur-2xl">
          <SectionTitle
            icon={LogIn}
            title="Start your movie profile"
            subtitle="Create a profile, or log back in and continue where you left off."
          />

          <input
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
            className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-white/30"
            placeholder="Enter a username, for example Ajwin"
          />

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={handleLogin}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black"
            >
              <LogIn className="h-4 w-4" />
              Login
            </button>
            <button
              onClick={handleCreateUser}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white/85"
            >
              <Plus className="h-4 w-4" />
              Create profile
            </button>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/55">Existing users</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {existingUsers.length > 0 ? (
                existingUsers.map((name) => (
                  <button
                    key={name}
                    onClick={() => setLoginName(name)}
                    className="rounded-full border border-white/10 bg-black/25 px-3 py-2 text-xs text-white/80"
                  >
                    {name}
                  </button>
                ))
              ) : (
                <p className="text-sm text-white/50">No profiles yet. Create your first one.</p>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-violet-300/15 bg-violet-400/10 p-4">
            <p className="text-sm text-violet-100">
              Onboarding asks one poster at a time and mixes obvious picks with mid-tier and deeper taste-signal movies.
            </p>
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
}: {
  currentUser: string;
  currentMovie: any;
  currentIndex: number;
  total: number;
  currentRating: number;
  setCurrentRating: (n: number) => void;
  markWatched: (movie: any, rating: number) => void;
  markNotWatched: (movie: any) => void;
  finishOnboarding: () => void;
  watchedEntries: any[];
  loading: boolean;
}) {
  return (
    <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10 lg:px-10">
      <div className="w-full rounded-[34px] border border-white/10 bg-black/35 p-6 shadow-2xl backdrop-blur-2xl lg:p-8">
        <SectionTitle
          icon={Clapperboard}
          title={`Build ${currentUser}'s taste profile`}
          subtitle="A balanced poster-based quiz across all six industries so recommendations feel personal quickly."
        />

        {loading ? (
          <div className="rounded-[28px] border border-white/10 bg-white/10 p-12 text-center text-white/70">
            Loading posters and movies for your onboarding...
          </div>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <Badge tone="accent">
                {Math.min(currentIndex + 1, total)} / {total}
              </Badge>
              <Badge>{currentMovie?.industry || "Movie"}</Badge>
              {(currentMovie?.genres || []).map((genre: string) => (
                <Badge key={genre} tone="soft">
                  {genre}
                </Badge>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl">
                <div className="aspect-[2/3] w-full overflow-hidden bg-black/30">
                  <img
                    src={currentMovie?.poster || PLACEHOLDER_POSTER}
                    alt={currentMovie?.title || "Movie poster"}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.3em] text-violet-200/80">Onboarding pick</p>
                <h2 className="mt-2 text-4xl font-semibold tracking-tight text-white lg:text-5xl">
                  {currentMovie?.title || "Movie"}
                </h2>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-base text-white/60">
                  <span>{currentMovie?.year || "Unknown year"}</span>
                  <span>•</span>
                  <span>{currentMovie?.industry || "Unknown industry"}</span>
                  <span>•</span>
                  <span>{currentMovie?.language || "Unknown language"}</span>
                </div>

                <p className="mt-5 text-sm text-white/55">Have you watched this movie?</p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() => markWatched(currentMovie, currentRating)}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black"
                  >
                    <Check className="h-4 w-4" />
                    Watched
                  </button>
                  <button
                    onClick={() => markNotWatched(currentMovie)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white/85 hover:bg-white/10"
                  >
                    <X className="h-4 w-4" />
                    Not watched
                  </button>
                </div>

                <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-white/60">If watched, rate it with stars</p>
                  <div className="mt-3">
                    <StarPicker rating={currentRating} onChange={setCurrentRating} />
                  </div>
                </div>

                <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-white/55">Why this title is here</p>
                  <p className="mt-2 text-sm leading-6 text-white/78">
                    This onboarding mix is intentionally not just blockbusters. It includes obvious anchors,
                    solid mid-tier signals, and deeper picks to map real taste.
                  </p>
                </div>

                <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-white/60">Saved taste signals</p>
                      <p className="mt-1 text-white">
                        {watchedEntries.length} watched movie{watchedEntries.length === 1 ? "" : "s"} captured
                      </p>
                    </div>
                    <button
                      onClick={finishOnboarding}
                      className="rounded-full border border-violet-300/40 bg-violet-400/15 px-5 py-3 text-sm text-white hover:bg-violet-400/20"
                    >
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

function MemoryPanel({
  userType,
  likedGenres,
  likedIndustries,
  watchedEntries,
  reviews,
  memorySummary,
}: {
  userType: string;
  likedGenres: string[];
  likedIndustries: string[];
  watchedEntries: any[];
  reviews: any[];
  memorySummary: string;
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
      <SectionTitle
        icon={Brain}
        title="Profile memory"
        subtitle="Signals learned from watched films, ratings, industries, and recommendation feedback."
      />

      <div className="space-y-3 text-sm text-white/78">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-white/55">General type</p>
          <p className="mt-1 font-medium text-white">{userType}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-white/55">Liked genres</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {likedGenres.length > 0 ? (
              likedGenres.map((g) => <Badge key={g}>{g}</Badge>)
            ) : (
              <p className="text-white/45">Still learning...</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-white/55">Liked industries</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {likedIndustries.length > 0 ? (
              likedIndustries.map((g) => (
                <Badge key={g} tone="accent">
                  {g}
                </Badge>
              ))
            ) : (
              <p className="text-white/45">No strong industry pattern yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-white/55">Learning summary</p>
          <p className="mt-1 leading-6">{memorySummary}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Watched", value: watchedEntries.length },
            { label: "Reviews", value: reviews.length },
            { label: "Signals", value: likedGenres.length + likedIndustries.length },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-black/25 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">{item.label}</p>
              <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ControlsPanel({
  mood,
  setMood,
  attention,
  setAttention,
  subtitleComfort,
  setSubtitleComfort,
  chat,
  setChat,
}: {
  mood: string;
  setMood: (v: string) => void;
  attention: (typeof defaultProfile.attention);
  setAttention: (v: any) => void;
  subtitleComfort: boolean;
  setSubtitleComfort: (v: boolean) => void;
  chat: string;
  setChat: (v: string) => void;
}) {
  const moods = ["emotional", "warm", "comfort", "tense", "excited", "curious", "reflective", "dark", "inspired"];

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
      <SectionTitle
        icon={MessageCircle}
        title="Mood controls"
        subtitle="Set the current vibe, your attention span, and a short natural-language prompt."
      />

      <div className="space-y-5">
        <div>
          <p className="mb-3 text-sm text-white/60">Mood</p>
          <div className="flex flex-wrap gap-2">
            {moods.map((item) => (
              <TogglePill key={item} active={mood === item} onClick={() => setMood(item)}>
                {item}
              </TogglePill>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm text-white/60">Attention span</p>
          <div className="flex flex-wrap gap-2">
            {["low", "medium", "high"].map((item) => (
              <TogglePill key={item} active={attention === item} onClick={() => setAttention(item)}>
                {item}
              </TogglePill>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-white/60">Subtitle comfort</p>
              <p className="mt-1 text-sm text-white/78">
                Helps CineMuse lean harder into Malayalam, Tamil, Telugu, Kannada, and Hindi picks.
              </p>
            </div>
            <button
              onClick={() => setSubtitleComfort(!subtitleComfort)}
              className={`rounded-full px-4 py-2 text-sm ${
                subtitleComfort
                  ? "bg-violet-400/15 text-white ring-1 ring-violet-300/40"
                  : "bg-white/5 text-white/70 ring-1 ring-white/10"
              }`}
            >
              {subtitleComfort ? "Comfortable" : "Prefer English"}
            </button>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm text-white/60">Tell CineMuse what you want</p>
          <textarea
            value={chat}
            onChange={(e) => setChat(e.target.value)}
            rows={4}
            className="w-full resize-none rounded-3xl border border-white/10 bg-black/20 px-4 py-4 text-white outline-none placeholder:text-white/30"
            placeholder="Example: I want something emotional but not depressing."
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {CHAT_PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => setChat(preset)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/75 hover:bg-white/10"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewPanel({
  feedbackText,
  setFeedbackText,
  submitReview,
}: {
  feedbackText: string;
  setFeedbackText: (v: string) => void;
  submitReview: (reaction: string) => void;
}) {
  const actions = [
    { label: "Loved", icon: Heart, className: "bg-white text-black" },
    { label: "Too Slow", icon: Clock3, className: "border border-white/15 bg-white/5 text-white/85" },
    { label: "Not Now", icon: ThumbsDown, className: "border border-white/15 bg-white/5 text-white/85" },
    { label: "Smart Pick", icon: Brain, className: "border border-violet-300/35 bg-violet-400/15 text-white" },
  ];

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
      <SectionTitle
        icon={Heart}
        title="Recommendation feedback"
        subtitle="Feedback updates future picks, liked genres, industry confidence, and skip logic."
      />

      <textarea
        value={feedbackText}
        onChange={(e) => setFeedbackText(e.target.value)}
        rows={4}
        className="w-full resize-none rounded-3xl border border-white/10 bg-black/20 px-4 py-4 text-white outline-none placeholder:text-white/30"
        placeholder="Optional note: loved the writing, too slow in the middle, want something lighter next..."
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {actions.map((item) => (
          <button
            key={item.label}
            onClick={() => submitReview(item.label)}
            className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition hover:scale-[1.01] ${item.className}`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function HistoryPanel({
  watchedEntries,
  reviews,
}: {
  watchedEntries: any[];
  reviews: any[];
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
      <SectionTitle
        icon={Clapperboard}
        title="Taste history"
        subtitle="Your watched entries and recent recommendation feedback stay attached to your profile."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-sm text-white/55">Watched and rated</p>
          <div className="space-y-3">
            {watchedEntries.length > 0 ? (
              watchedEntries.slice(-6).reverse().map((entry, index) => (
                <div key={`${entry.title}-${index}`} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3">
                  <img
                    src={entry.poster || PLACEHOLDER_POSTER}
                    alt={entry.title}
                    className="h-16 w-12 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-white">{entry.title}</p>
                    <p className="text-sm text-white/55">{entry.industry}</p>
                    <div className="mt-2 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star
                          key={value}
                          className={`h-3.5 w-3.5 ${
                            value <= entry.rating ? "fill-violet-300 text-violet-300" : "text-white/20"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/55">
                No watched entries yet.
              </div>
            )}
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm text-white/55">Recent feedback</p>
          <div className="space-y-3">
            {reviews.length > 0 ? (
              reviews.slice(-6).reverse().map((entry, index) => (
                <div key={`${entry.movie}-${index}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-white">{entry.movie}</p>
                    <Badge tone="accent">{entry.reaction}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/65">{entry.note || "No note"}</p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/55">
                No recommendation feedback yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CinematicMovieAIApp() {
  const [loginName, setLoginName] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [users, setUsers] = useState<Record<string, any>>({});

  const [likedGenres, setLikedGenres] = useState<string[]>(defaultProfile.likedGenres);
  const [likedIndustries, setLikedIndustries] = useState<string[]>(defaultProfile.likedIndustries);
  const [subtitleComfort, setSubtitleComfort] = useState(defaultProfile.subtitleComfort);
  const [attention, setAttention] = useState<"low" | "medium" | "high">(defaultProfile.attention);
  const [mood, setMood] = useState(defaultProfile.mood);
  const [chat, setChat] = useState(defaultProfile.chat);
  const [watched, setWatched] = useState<string[]>(defaultProfile.watched);
  const [disliked, setDisliked] = useState<string[]>(defaultProfile.disliked);
  const [reviews, setReviews] = useState<any[]>(defaultProfile.reviews);
  const [feedbackText, setFeedbackText] = useState("");
  const [refreshSeed, setRefreshSeed] = useState(0);
  const [watchedEntries, setWatchedEntries] = useState<any[]>(defaultProfile.watchedEntries);
  const [onboardingComplete, setOnboardingComplete] = useState(defaultProfile.onboardingComplete);
  const [onboardingIndex, setOnboardingIndex] = useState(defaultProfile.onboardingIndex);
  const [currentOnboardingRating, setCurrentOnboardingRating] = useState(4);

  const [movieLibrary, setMovieLibrary] = useState<any[]>([]);
  const [onboardingMovies, setOnboardingMovies] = useState<any[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(true);

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
    const fetchLibrary = async () => {
      setLibraryLoading(true);
      try {
        const token = process.env.NEXT_PUBLIC_TMDB_BEARER_TOKEN;
        const results = await fetchMovieLibraryFromTMDB(token);

        setMovieLibrary(results);

        const existingQueue =
          currentUser && users[currentUser]?.onboardingQueue?.length
            ? users[currentUser].onboardingQueue
            : [];

        if (existingQueue.length > 0) {
          const queueMovies = existingQueue
            .map((title: string) => results.find((movie) => movie.title === title))
            .filter(Boolean);
          setOnboardingMovies(queueMovies.length ? queueMovies : pickBalancedOnboarding(results, 18));
        } else {
          setOnboardingMovies(pickBalancedOnboarding(results, 18));
        }
      } catch (error) {
        console.error("TMDB library fetch failed", error);
        const fallback = buildFallbackLibrary();
        setMovieLibrary(fallback);
        setOnboardingMovies(pickBalancedOnboarding(fallback, 18));
      } finally {
        setLibraryLoading(false);
      }
    };

    fetchLibrary();
  }, []);

  function loadUser(name: string, userMap = users) {
    const data = userMap[name] || defaultProfile;

    setCurrentUser(name);
    setLikedGenres(data.likedGenres || []);
    setLikedIndustries(data.likedIndustries || []);
    setSubtitleComfort(data.subtitleComfort ?? true);
    setAttention(data.attention || "low");
    setMood(data.mood || "emotional");
    setChat(data.chat || CHAT_PRESETS[0]);
    setWatched(data.watched || []);
    setDisliked(data.disliked || []);
    setReviews(data.reviews || []);
    setWatchedEntries(data.watchedEntries || []);
    setOnboardingComplete(Boolean(data.onboardingComplete));
    setOnboardingIndex(data.onboardingIndex || 0);

    if (movieLibrary.length) {
      const queueTitles = data.onboardingQueue || [];
      if (queueTitles.length > 0) {
        const queueMovies = queueTitles
          .map((title: string) => movieLibrary.find((movie) => movie.title === title))
          .filter(Boolean);

        setOnboardingMovies(queueMovies.length ? queueMovies : pickBalancedOnboarding(movieLibrary, 18));
      } else {
        setOnboardingMovies(pickBalancedOnboarding(movieLibrary, 18));
      }
    }

    storage.setCurrentUser(name);
  }

  useEffect(() => {
    if (!currentUser) return;

    const updatedUser = {
      likedGenres,
      likedIndustries,
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
      onboardingQueue: onboardingMovies.map((movie) => movie.title),
    };

    const nextUsers = { ...users, [currentUser]: updatedUser };
    setUsers(nextUsers);
    storage.saveUsers(nextUsers);
  }, [
    currentUser,
    likedGenres,
    likedIndustries,
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
    onboardingMovies,
  ]);

  const userType = useMemo(
    () => inferUserType(attention, likedGenres, likedIndustries),
    [attention, likedGenres, likedIndustries]
  );

  const currentOnboardingMovie =
    onboardingMovies[onboardingIndex] || onboardingMovies[onboardingMovies.length - 1] || null;

  const topMovie = useMemo(() => {
    if (!movieLibrary.length) return null;

    const profile = { likedGenres, subtitleComfort, attention };

    const candidate = [...movieLibrary]
      .map((movie) => ({
        ...movie,
        score: scoreMovie(movie, profile, mood, chat, watched, disliked, likedIndustries, reviews),
      }))
      .sort((a, b) => b.score - a.score)[0];

    if (!candidate) return null;

    return {
      ...candidate,
      why: buildReason(candidate, mood, chat, likedIndustries, likedGenres),
    };
  }, [
    movieLibrary,
    likedGenres,
    subtitleComfort,
    attention,
    mood,
    chat,
    watched,
    disliked,
    likedIndustries,
    reviews,
    refreshSeed,
  ]);

  const memorySummary = useMemo(() => {
    if (reviews.length === 0 && watchedEntries.length === 0) {
      return "Memory is still forming. Mark watched films during onboarding and rate what you loved to sharpen the engine.";
    }
    if (reviews.length > 0) {
      const last = reviews[reviews.length - 1];
      return `Last learning update: you ${last.reaction.toLowerCase()} "${last.movie}" because "${last.note}".`;
    }
    const favoriteEntry = [...watchedEntries].sort((a, b) => b.rating - a.rating)[0];
    return `You rated "${favoriteEntry.title}" from ${favoriteEntry.industry} at ${favoriteEntry.rating} stars.`;
  }, [reviews, watchedEntries]);

  const handleCreateUser = () => {
    const name = loginName.trim();
    if (!name) return;
    if (users[name]) {
      loadUser(name, users);
      return;
    }

    const queue = movieLibrary.length ? pickBalancedOnboarding(movieLibrary, 18) : [];
    const nextUsers = {
      ...users,
      [name]: {
        ...defaultProfile,
        watched: [],
        disliked: [],
        reviews: [],
        watchedEntries: [],
        likedGenres: [],
        likedIndustries: [],
        onboardingComplete: false,
        onboardingIndex: 0,
        onboardingQueue: queue.map((movie) => movie.title),
      },
    };

    setUsers(nextUsers);
    storage.saveUsers(nextUsers);
    setOnboardingMovies(queue);
    loadUser(name, nextUsers);
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

  const moveToNextOnboardingMovie = () => {
    if (onboardingIndex < onboardingMovies.length - 1) {
      setOnboardingIndex((prev) => prev + 1);
      setCurrentOnboardingRating(4);
    } else {
      setOnboardingComplete(true);
    }
  };

  const markWatched = (movie: any, rating: number) => {
    if (!movie?.title) return;

    const alreadySaved = watchedEntries.some((entry) => entry.title === movie.title);
    const nextEntry = {
      title: movie.title,
      industry: movie.industry,
      rating,
      genres: movie.genres,
      poster: movie.poster,
    };

    if (!alreadySaved) {
      setWatchedEntries((prev) => [...prev, nextEntry]);
    }

    setWatched((prev) => Array.from(new Set([...prev, movie.title])));
    setLikedIndustries((prev) => Array.from(new Set([...prev, movie.industry])));

    if (rating >= 4) {
      setLikedGenres((prev) => Array.from(new Set([...prev, ...movie.genres])));
    }

    moveToNextOnboardingMovie();
  };

  const markNotWatched = (movie: any) => {
    if (!movie?.title) return;
    moveToNextOnboardingMovie();
  };

  const finishOnboarding = () => {
    setOnboardingComplete(true);
  };

  const submitReview = (reaction: string) => {
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
      setLikedIndustries((prev) => Array.from(new Set([...prev, topMovie.industry])));
      setWatched((prev) => Array.from(new Set([...prev, topMovie.title])));
    }

    if (reaction === "Too Slow" || reaction === "Not Now") {
      setDisliked((prev) => Array.from(new Set([...prev, topMovie.title])));
    }

    setFeedbackText("");
    setRefreshSeed((prev) => prev + 1);
  };

  const watchThisTonight = () => {
    if (!topMovie) return;
    setWatched((prev) => Array.from(new Set([...prev, topMovie.title])));
    setFeedbackText(`I watched ${topMovie.title} and `);
    setRefreshSeed((prev) => prev + 1);
  };

  const refineRecommendation = () => {
    if (!topMovie) return;
    setDisliked((prev) => Array.from(new Set([...prev, topMovie.title])));
    setRefreshSeed((prev) => prev + 1);
  };

  const reshuffleOnboarding = () => {
    if (!movieLibrary.length) return;
    const fresh = pickBalancedOnboarding(movieLibrary, 18);
    setOnboardingMovies(fresh);
    setOnboardingIndex(0);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen overflow-hidden bg-[#07070b] text-white">
        <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-20" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.22),transparent_35%),linear-gradient(to_bottom,rgba(7,7,11,0.32),rgba(7,7,11,0.9)_45%,rgba(7,7,11,1))]" />

        <AuthCard
          loginName={loginName}
          setLoginName={setLoginName}
          handleLogin={handleLogin}
          handleCreateUser={handleCreateUser}
          existingUsers={Object.keys(users)}
          libraryCount={MOVIE_LIBRARY_SEED.length}
        />
      </div>
    );
  }

  if (!onboardingComplete) {
    return (
      <div className="min-h-screen overflow-hidden bg-[#07070b] text-white">
        <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-15" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.22),transparent_35%),linear-gradient(to_bottom,rgba(7,7,11,0.35),rgba(7,7,11,0.92)_45%,rgba(7,7,11,1))]" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-6 lg:px-10">
          <div className="flex flex-wrap justify-end gap-3">
            <button
              onClick={reshuffleOnboarding}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/85 hover:bg-white/10"
            >
              <RefreshCcw className="h-4 w-4" />
              New onboarding mix
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/85 hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>

        <OnboardingCard
          currentUser={currentUser}
          currentMovie={currentOnboardingMovie}
          currentIndex={onboardingIndex}
          total={onboardingMovies.length || 18}
          currentRating={currentOnboardingRating}
          setCurrentRating={setCurrentOnboardingRating}
          markWatched={markWatched}
          markNotWatched={markNotWatched}
          finishOnboarding={finishOnboarding}
          watchedEntries={watchedEntries}
          loading={libraryLoading}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#07070b] text-white">
      <div
        className="fixed inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage: `url(${topMovie?.backdrop || PLACEHOLDER_BACKDROP})`,
        }}
      />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.22),transparent_35%),linear-gradient(to_bottom,rgba(7,7,11,0.32),rgba(7,7,11,0.88)_45%,rgba(7,7,11,1))]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-5 rounded-[30px] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-violet-200">
                <Sparkles className="h-3.5 w-3.5" />
                CineMuse AI
              </div>

              <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white lg:text-6xl">
                One perfect movie. Chosen for your mood, taste, and attention.
              </h1>

              <p className="mt-4 max-w-2xl text-base text-white/65 lg:text-lg">
                A cinematic recommendation companion that learns from watched films, star ratings,
                industries, and feedback instead of throwing generic lists at you.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/85">
                <User className="h-4 w-4 text-violet-300" />
                {currentUser}
              </div>

              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/85 hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
                Log out
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
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="overflow-hidden rounded-[32px] border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl"
            >
              <div className="relative min-h-[560px] p-6 lg:p-8">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div
                  className="absolute right-0 top-0 h-80 w-2/3 bg-cover bg-center opacity-35"
                  style={{
                    backgroundImage: `url(${topMovie?.poster || topMovie?.backdrop || PLACEHOLDER_POSTER})`,
                  }}
                />
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-3 flex flex-wrap gap-2">
                        <Badge tone="accent">Today’s pick</Badge>
                        <Badge>Library: {movieLibrary.length}</Badge>
                        <Badge>One at a time</Badge>
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={topMovie?.title || "loading"}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -12 }}
                          transition={{ duration: 0.22 }}
                        >
                          <h2 className="max-w-2xl text-4xl font-semibold tracking-tight lg:text-6xl">
                            {topMovie?.title || "Loading..."}
                          </h2>
                        </motion.div>
                      </AnimatePresence>

                      <div className="mt-4 flex flex-wrap gap-2 text-sm text-white/75">
                        <Badge>{topMovie?.year || "—"}</Badge>
                        <Badge>{topMovie?.industry || "Movie"}</Badge>
                        <Badge>{topMovie?.language || "—"}</Badge>
                        <Badge>{topMovie?.runtime || 120} min</Badge>
                        <Badge>{topMovie?.pace || "medium"}</Badge>
                      </div>
                    </div>

                    <div className="hidden rounded-2xl border border-white/10 bg-black/35 p-3 text-white/75 lg:block">
                      <Film className="h-5 w-5 text-violet-300" />
                    </div>
                  </div>

                  <div>
                    <div className="mt-8 flex flex-wrap gap-2">
                      {(topMovie?.genres || []).map((genre: string) => (
                        <Badge key={genre}>{genre}</Badge>
                      ))}
                    </div>

                    <p className="mt-5 max-w-2xl text-base leading-7 text-white/78 lg:text-lg">
                      {topMovie?.description || "Loading recommendation..."}
                    </p>

                    <div className="mt-6 rounded-3xl border border-violet-300/20 bg-violet-400/10 p-5 backdrop-blur-lg">
                      <p className="text-xs uppercase tracking-[0.3em] text-violet-200/80">
                        Recommendation reasoning
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/85">
                        {topMovie?.why || "We are matching this from your current taste signals."}
                      </p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        onClick={watchThisTonight}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:scale-[1.02]"
                      >
                        <Play className="h-4 w-4" />
                        Watch this tonight
                      </button>

                      <button
                        onClick={refineRecommendation}
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white/85 transition hover:bg-white/10"
                      >
                        <RefreshCcw className="h-4 w-4" />
                        Not this, refine mood
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="grid gap-6 lg:grid-cols-2"
            >
              <MemoryPanel
                userType={userType}
                likedGenres={likedGenres}
                likedIndustries={likedIndustries}
                watchedEntries={watchedEntries}
                reviews={reviews}
                memorySummary={memorySummary}
              />
              <ControlsPanel
                mood={mood}
                setMood={setMood}
                attention={attention}
                setAttention={setAttention}
                subtitleComfort={subtitleComfort}
                setSubtitleComfort={setSubtitleComfort}
                chat={chat}
                setChat={setChat}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
            >
              <HistoryPanel watchedEntries={watchedEntries} reviews={reviews} />
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl"
            >
              <SectionTitle
                icon={Globe2}
                title="Industry pulse"
                subtitle="The app stays aware of cross-industry taste instead of defaulting to only one market."
              />

              <div className="grid gap-3 sm:grid-cols-2">
                {INDUSTRIES.map((industry) => {
                  const active = likedIndustries.includes(industry);
                  const watchedCount = watchedEntries.filter((entry) => entry.industry === industry).length;

                  return (
                    <div
                      key={industry}
                      className={`rounded-2xl border p-4 ${
                        active
                          ? "border-violet-300/30 bg-violet-400/10"
                          : "border-white/10 bg-black/20"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-white">{industry}</p>
                        <Badge tone={active ? "accent" : "soft"}>{watchedCount} watched</Badge>
                      </div>
                      <p className="mt-2 text-sm text-white/60">
                        {active
                          ? "This industry is influencing recommendations now."
                          : "Still learning your response to this industry."}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
              <ReviewPanel
                feedbackText={feedbackText}
                setFeedbackText={setFeedbackText}
                submitReview={submitReview}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl"
            >
              <SectionTitle
                icon={Zap}
                title="Quick actions"
                subtitle="Useful controls for keeping the recommendation loop feeling fresh."
              />

              <div className="space-y-3">
                <button
                  onClick={() => setOnboardingComplete(false)}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-left text-white/82 transition hover:bg-black/30"
                >
                  <span>
                    <span className="block font-medium text-white">Revisit onboarding</span>
                    <span className="mt-1 block text-sm text-white/55">
                      Ask more poster questions to strengthen taste signals.
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-violet-300" />
                </button>

                <button
                  onClick={() => {
                    if (!movieLibrary.length) return;
                    setOnboardingMovies(pickBalancedOnboarding(movieLibrary, 18));
                    setOnboardingIndex(0);
                    setOnboardingComplete(false);
                  }}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-left text-white/82 transition hover:bg-black/30"
                >
                  <span>
                    <span className="block font-medium text-white">Fresh onboarding mix</span>
                    <span className="mt-1 block text-sm text-white/55">
                      New balanced set across top-tier, mid-tier, and deeper picks.
                    </span>
                  </span>
                  <RefreshCcw className="h-4 w-4 text-violet-300" />
                </button>

                <button
                  onClick={() => setRefreshSeed((prev) => prev + 1)}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-left text-white/82 transition hover:bg-black/30"
                >
                  <span>
                    <span className="block font-medium text-white">Re-score now</span>
                    <span className="mt-1 block text-sm text-white/55">
                      Rerun the scoring engine using your current mood and latest feedback.
                    </span>
                  </span>
                  <Brain className="h-4 w-4 text-violet-300" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}