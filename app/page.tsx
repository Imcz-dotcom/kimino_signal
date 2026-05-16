"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { BACKGROUND_URLS } from "@/lib/story-config";
import { Navigation } from "./components/Navigation";

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const SakuraParticles = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const petals = useMemo(() => {
    if (!mounted) return [];
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${seededRandom(i * 2.1) * 100}vw`,
      animationDuration: `${seededRandom(i * 3.7) * 10 + 15}s`,
      animationDelay: `-${seededRandom(i * 5.3) * 20}s`,
      width: `${seededRandom(i * 7.1) * 8 + 8}px`,
      height: `${seededRandom(i * 11.3) * 8 + 8}px`,
      opacity: 0.6 + seededRandom(i * 13) * 0.4,
    }));
  }, [mounted]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {petals.map((p) => (
        <div
          key={p.id}
          className="petal"
          style={{
            left: p.left,
            width: p.width,
            height: p.height,
            opacity: p.opacity,
            animation: `fall ${p.animationDuration} linear infinite`,
            animationDelay: p.animationDelay,
          }}
        />
      ))}
    </div>
  );
};

const AyanoSprite = ({ isNarrator }: { isNarrator: boolean }) => {
  const opacityClass = isNarrator
    ? "opacity-40 scale-95 translate-y-8 blur-[2px]"
    : "opacity-100 scale-100 translate-y-0 filter drop-shadow-[0_0_20px_rgba(255,183,178,0.3)]";

  return (
    <div
      className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[350px] h-[450px] md:w-[450px] md:h-[550px] transition-all duration-700 ease-in-out ${opacityClass} pointer-events-none z-20`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="image-removebg-preview.png"
        alt="Anime Character"
        className="w-full h-full object-contain animate-breathe drop-shadow-2xl"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src =
            "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80";
        }}
      />
    </div>
  );
};

interface Choice {
  text: string;
  next?: string;
  affection?: number;
}

interface StoryLine {
  speaker: string;
  text: string;
  mood: string;
  next?: string;
  choices?: Choice[];
}

interface SceneData {
  bg: string;
  script: StoryLine[];
  next?: string;
}

const STORY_DATA: Record<string, SceneData> = {
  intro: {
    bg: BACKGROUND_URLS.park,
    script: [
      {
        speaker: "",
        text: "The warm spring breeze carries the sweet scent of blooming cherry blossoms.",
        mood: "neutral",
      },
      {
        speaker: "",
        text: "I stand at the park entrance, waiting. She's late... as usual.",
        mood: "neutral",
      },
      { speaker: "???", text: "Watch out!!", mood: "surprised" },
      {
        speaker: "",
        text: "Suddenly, a girl crashes into me, dropping her bag onto the paved path.",
        mood: "neutral",
      },
      {
        speaker: "Ayano",
        text: "Ouch... I'm so sorry! I wasn't looking where I was going.",
        mood: "sad",
      },
      {
        speaker: "Player",
        text: "(Should I help her up?)",
        mood: "sad",
        choices: [
          {
            text: "Are you okay? Here, let me help you.",
            next: "help",
            affection: 1,
          },
          { text: "Watch where you're going next time.", next: "scold", affection: -1 },
        ],
      },
    ],
  },
  help: {
    bg: BACKGROUND_URLS.park,
    script: [
      { speaker: "Ayano", text: "Oh... thank you. That's really sweet of you.", mood: "blush" },
      { speaker: "Ayano", text: "I'm Ayano. Nice to meet you!", mood: "happy" },
      {
        speaker: "Ayano",
        text: "Say, since we bumped into each other, do you want to walk to the festival together?",
        mood: "smile",
        next: "festival",
      },
    ],
  },
  scold: {
    bg: BACKGROUND_URLS.park,
    script: [
      { speaker: "Ayano", text: "Ugh, I said I was sorry! You don't have to be mean about it.", mood: "angry" },
      {
        speaker: "Ayano",
        text: "But... I guess it was my fault.",
        mood: "sad",
      },
      {
        speaker: "Ayano",
        text: "Anyway, I'm Ayano. I'm heading to the lantern festival. Want to come?",
        mood: "neutral",
        next: "festival",
      },
    ],
  },
  festival: {
    bg: BACKGROUND_URLS.festival,
    script: [
      {
        speaker: "",
        text: "We walk through the bustling festival grounds. The soft glow of paper lanterns illuminates Ayano's face.",
        mood: "neutral",
      },
      {
        speaker: "Ayano",
        text: "Wow... it's so crowded tonight! Look at all the stalls!",
        mood: "surprised",
      },
      {
        speaker: "Ayano",
        text: "Hey... it's really easy to get separated here.",
        mood: "blush",
      },
      {
        speaker: "Ayano",
        text: "Do you mind if I... hold onto your sleeve?",
        mood: "blush",
        choices: [
          { text: "Take her hand instead.", next: "hold_hand", affection: 2 },
          { text: "Sure, hold on tight.", next: "sleeve", affection: 1 },
        ],
      },
    ],
  },
  hold_hand: {
    bg: BACKGROUND_URLS.festival,
    script: [
      { speaker: "Ayano", text: "Eh?!", mood: "surprised" },
      {
        speaker: "Ayano",
        text: "Y-you're holding my hand... instead of my sleeve...",
        mood: "blush",
      },
      { speaker: "Ayano", text: "Okay. I won't let go.", mood: "happy", next: "fireworks" },
    ],
  },
  sleeve: {
    bg: BACKGROUND_URLS.festival,
    script: [
      {
        speaker: "Ayano",
        text: "Thanks. I'd hate to get lost in this crowd.",
        mood: "smile",
      },
      {
        speaker: "Ayano",
        text: "You know, walking like this feels really nostalgic.",
        mood: "neutral",
        next: "fireworks",
      },
    ],
  },
  fireworks: {
    bg: BACKGROUND_URLS.fireworks,
    script: [
      { speaker: "", text: "Suddenly, a loud BOOM echoes through the night sky.", mood: "neutral" },
      { speaker: "Ayano", text: "Ah! The fireworks are starting!", mood: "surprised" },
      {
        speaker: "",
        text: "We look up as brilliant colors explode overhead, painting the stars.",
        mood: "neutral",
      },
      { speaker: "Ayano", text: "...", mood: "neutral" },
      { speaker: "Ayano", text: "Hey. There's something I need to tell you.", mood: "blush" },
      {
        speaker: "Ayano",
        text: "We're graduating soon... and we might go our separate ways.",
        mood: "sad",
      },
      {
        speaker: "Ayano",
        text: "But... I want to stay by your side. I really like you.",
        mood: "blush",
        choices: [
          { text: "I love you too, Ayano.", next: "good_end", affection: 1 },
          {
            text: "I'm sorry, I only see you as a friend.",
            next: "bad_end",
            affection: -5,
          },
        ],
      },
    ],
  },
  good_end: {
    bg: BACKGROUND_URLS.park,
    script: [
      { speaker: "Ayano", text: "Really?! You really mean it?", mood: "surprised" },
      {
        speaker: "Ayano",
        text: "I'm so happy! This is the best night of my life!",
        mood: "happy",
      },
      {
        speaker: "",
        text: "Under the canopy of cherry blossoms and fireworks, our new chapter begins.",
        mood: "neutral",
        next: "CREDITS",
      },
    ],
  },
  bad_end: {
    bg: BACKGROUND_URLS.sadEnding,
    script: [
      { speaker: "Ayano", text: "Oh... I see.", mood: "sad" },
      {
        speaker: "Ayano",
        text: "Sorry, I shouldn't have said anything. Let's just watch the fireworks.",
        mood: "sad",
      },
      {
        speaker: "",
        text: "The fireworks continue, but the space between us feels colder than before.",
        mood: "neutral",
        next: "CREDITS",
      },
    ],
  },
};

const TitleScreen = ({ onStart }: { onStart: () => void }) => {
  const navItems = [
    { id: "game", title: "Start", subtitle: "START", onClick: onStart },
    { id: "characters", title: "Partner", subtitle: "PARTNER", onClick: () => console.log("characters") },
    { id: "saves", title: "Saves", subtitle: "SAVES", onClick: () => console.log("saves") },
    { id: "gallery", title: "arXiv", subtitle: "DISCOVER", onClick: () => console.log("gallery") },
    { id: "music", title: "Workshop", subtitle: "WORKSHOP", onClick: () => console.log("music") },
    { id: "settings", title: "Settings", subtitle: "CONFIG", onClick: () => console.log("settings") },
    { id: "credits", title: "Community & Author", subtitle: "COMMUNITY", onClick: () => console.log("credits") },
  ];

  return (
    <div className="relative w-full h-screen flex overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://wallpapercave.com/wp/wp3738698.jpg')] bg-cover bg-center z-0"></div>
      
      {/* Sakura Particles */}
      <SakuraParticles />
      
      {/* Title Section - Outside Sidebar */}
      <div className="absolute top-12 left-12 z-40">
        <h1 className="text-5xl font-bold text-pink-100 drop-shadow-lg" style={{ fontFamily: 'Dancing Script' }}>
          kimi no signal
        </h1>
        <p className="text-sm text-pink-200 drop-shadow font-light tracking-wider mt-2" style={{ fontFamily: 'Nunito' }}>
          恋愛 &amp; 紙で飛んだ青春物語
        </p>
      </div>

      {/* Left Sidebar - Navigation */}
      <div className="relative w-72 z-30 flex-shrink-0 flex flex-col mt-40">
        <Navigation items={navItems} />
      </div>
    </div>
  );
};

const GameEngine = ({ onRestart }: { onRestart: () => void }) => {
  const [currentScene, setCurrentScene] = useState("intro");
  const [lineIndex, setLineIndex] = useState(0);
  const [affection, setAffection] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [uiHidden, setUiHidden] = useState(false);
  const [autoMode, setAutoMode] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const sceneData = STORY_DATA[currentScene];
  const lineData = sceneData.script[lineIndex];
  const isNarrator = !lineData.speaker || lineData.speaker === "";

  const transitionToScene = (nextScene: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScene(nextScene);
      setLineIndex(0);
      setIsTransitioning(false);
    }, 800);
  };

  const handleChoice = (choice: Choice) => {
    if (choice.affection) {
      setAffection((prev) => Math.max(0, Math.min(5, prev + choice.affection)));
    }
    if (choice.next) {
      transitionToScene(choice.next);
    }
  };

  const handleAdvance = () => {
    if (isTyping) {
      if (timerRef.current) clearInterval(timerRef.current);
      setDisplayedText(lineData.text);
      setIsTyping(false);
      return;
    }

    if (lineData.choices) return;

    if (lineData.next === "CREDITS") {
      onRestart();
      return;
    }

    if (lineIndex < sceneData.script.length - 1) {
      setLineIndex((prev) => prev + 1);
    } else if (sceneData.next) {
      transitionToScene(sceneData.next);
    }
  };

  useEffect(() => {
    if (!lineData) return;

    let i = 0;
    const fullText = lineData.text;
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayedText("");
    setIsTyping(true);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setDisplayedText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsTyping(false);
      }
    }, 35);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [lineData, currentScene, lineIndex]);

  useEffect(() => {
    if (autoMode && !isTyping && !lineData.choices && lineData.next !== "CREDITS") {
      const autoTimer = setTimeout(() => {
        handleAdvance();
      }, 2500);
      return () => clearTimeout(autoTimer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoMode, isTyping, lineData]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      <div
        className={`absolute inset-0 bg-cover bg-center scene-transition ${isTransitioning ? "opacity-0 scale-105" : "opacity-100 scale-100"}`}
        style={{ backgroundImage: `url(${sceneData.bg})` }}
      />

      <SakuraParticles />

      <div className="absolute top-6 left-6 z-40 flex space-x-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
        {[1, 2, 3, 4, 5].map((level) => (
          <svg
            key={level}
            className={`w-6 h-6 transition-colors duration-500 ${
              affection >= level
                ? "text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]"
                : "text-gray-400"
            }`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        ))}
      </div>

      <div className="absolute top-6 right-6 z-40 flex space-x-4">
        <button
          onClick={() => setAutoMode(!autoMode)}
          className={`px-4 py-2 rounded-full backdrop-blur-md border font-bold text-sm transition-all ${
            autoMode
              ? "bg-pink-500/80 border-pink-300 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)]"
              : "bg-black/30 border-white/20 text-gray-200 hover:bg-white/20"
          }`}
        >
          AUTO
        </button>
        <button
          onClick={() => setUiHidden(true)}
          className="px-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-gray-200 font-bold text-sm hover:bg-white/20 transition-all"
        >
          HIDE
        </button>
      </div>

      {uiHidden && (
        <div
          className="absolute inset-0 z-50 cursor-pointer"
          onClick={() => setUiHidden(false)}
        />
      )}

      <AyanoSprite isNarrator={isNarrator} />

      {!uiHidden && !lineData.choices && (
        <div className="absolute inset-0 z-20 cursor-pointer" onClick={handleAdvance} />
      )}

      {!uiHidden && (
        <div
          className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-30 transition-all duration-500 ${isTransitioning ? "translate-y-20 opacity-0" : "translate-y-0 opacity-100"}`}
        >
          {lineData.speaker && (
            <div className="absolute -top-6 left-6 md:left-12 bg-gradient-to-r from-pink-500 to-rose-400 text-white px-8 py-2 rounded-full shadow-[0_4px_15px_rgba(236,72,153,0.5)] font-extrabold tracking-widest text-lg border-2 border-white/30 z-40">
              {lineData.speaker}
            </div>
          )}

          <div
            className="glass-panel rounded-[2rem] p-8 md:p-10 min-h-[180px] cursor-pointer"
            onClick={handleAdvance}
          >
            <p className="text-xl md:text-2xl text-white font-medium leading-relaxed drop-shadow-md">
              {displayedText}
            </p>

            {!isTyping && !lineData.choices && (
              <div className="absolute bottom-6 right-8 animate-bounce text-pink-300 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      )}

      {!uiHidden && lineData.choices && !isTyping && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center space-y-6 px-4 animate-fadeIn">
          {lineData.choices.map((choice: Choice, idx: number) => (
            <button
              key={idx}
              onClick={() => handleChoice(choice)}
              className="btn-hover-pulse w-full max-w-2xl bg-white/90 text-pink-900 font-bold py-5 px-8 rounded-full shadow-2xl transition-all border-4 border-pink-200 hover:border-pink-500 hover:bg-white text-xl md:text-2xl"
            >
              {choice.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [screen, setScreen] = useState<"title" | "game">("title");

  return (
    <div className="w-full h-screen font-sans text-gray-900 overflow-hidden">
      {screen === "title" ? (
        <TitleScreen onStart={() => setScreen("game")} />
      ) : (
        <GameEngine onRestart={() => setScreen("title")} />
      )}
    </div>
  );
}
