"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BACKGROUND_URLS } from "@/lib/story-config";
import { SakuraParticles } from "../components/SakuraParticles";

const AyanoSprite = ({ isNarrator, charUrl }: { isNarrator: boolean, charUrl: string }) => {
  const opacityClass = isNarrator
    ? "opacity-40 scale-95 translate-y-8 blur-[2px]"
    : "opacity-100 scale-100 translate-y-0 filter drop-shadow-[0_0_20px_rgba(255,183,178,0.3)]";

  return (
    <div
      className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[350px] h-[450px] md:w-[450px] md:h-[550px] transition-all duration-700 ease-in-out ${opacityClass} pointer-events-none z-20`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={charUrl || "/partner.png"}
        alt="Anime Character"
        className="w-full h-full object-contain animate-breathe drop-shadow-2xl"
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
    bg: BACKGROUND_URLS.digital_city,
    script: [
      {
        speaker: "",
        text: "The year is 2026. The old centralized web is fading, replaced by a world of user-ownership and code-based trust.",
        mood: "neutral",
      },
      {
        speaker: "Ayano",
        text: "Hey! You're finally here. Ready to step into the Web3 paradigm?",
        mood: "smile",
      },
      {
        speaker: "Player",
        text: "(She looks excited. But wait, what exactly is Web3?)",
        mood: "neutral",
        choices: [
          { text: "It's the 'Read-Write-Own' internet, right?", next: "web3_expert", affection: 1 },
          { text: "Is it just another version of Google?", next: "web3_noob", affection: -1 },
        ],
      },
    ],
  },
  web3_expert: {
    bg: BACKGROUND_URLS.cyber_cafe,
    script: [
      { speaker: "Ayano", text: "Correct! Unlike Web2, we aren't just the product anymore. We own our data and assets.", mood: "happy" },
      { speaker: "Ayano", text: "Look at my wallet—it's my gateway to everything here. But security is on us now.", mood: "neutral" },
      {
        speaker: "Ayano",
        text: "A stranger just sent you a link promising 10,000% APY in a new DeFi pool. What do you do?",
        mood: "serious",
        choices: [
          { text: "Click it! That's a huge return!", next: "scam_ending", affection: -5 },
          { text: "Ignore it. It's likely a Phishing attack or a Rug Pull.", next: "security_win", affection: 2 },
        ],
      },
    ],
  },
  web3_noob: {
    bg: BACKGROUND_URLS.cyber_cafe,
    script: [
      { speaker: "Ayano", text: "Not quite... Web2 is centralized, like Google or Facebook. Web3 is decentralized.", mood: "sad" },
      { speaker: "Ayano", text: "It uses Distributed Ledger Technology—blockchain—to remove the middlemen.", mood: "neutral" },
      { speaker: "Ayano", text: "Let's start simple. To participate, you need a Web3 wallet like MetaMask. Want me to help you set one up?", mood: "smile", next: "wallet_setup" },
    ],
  },
  wallet_setup: {
    bg: BACKGROUND_URLS.digital_city,
    script: [
      { speaker: "Ayano", text: "First, you download the extension, write down your 12-word seed phrase... and NEVER share it!", mood: "serious" },
      { speaker: "Ayano", text: "Okay, you're all set! Now you have a digital identity. But wait... look at this.", mood: "neutral", next: "web3_expert" },
    ],
  },
  security_win: {
    bg: BACKGROUND_URLS.neon_street,
    script: [
      { speaker: "Ayano", text: "Phew! I'm glad you're careful. In 2024 alone, $2.1 billion was lost to hacks and scams.", mood: "smile" },
      { speaker: "Ayano", text: "Since you're so smart, how about we try 'GameFi'? We can play to earn some NFTs!", mood: "happy" },
      {
        speaker: "Ayano",
        text: "But wait, the network is congested and gas fees are high. Should we use Layer-1 or a Layer-2 solution?",
        mood: "neutral",
        choices: [
          { text: "Layer-1! Let's stick to the main chain.", next: "high_fees", affection: 0 },
          { text: "Layer-2! It's faster and cheaper.", next: "scalability_win", affection: 1 },
        ],
      },
    ],
  },
  scalability_win: {
    bg: BACKGROUND_URLS.game_center,
    script: [
      { speaker: "Ayano", text: "Smart choice! Layer-2 solutions like Rollups make things so much smoother.", mood: "happy" },
      { speaker: "Ayano", text: "We're actually earning assets that we truly own. This is the power of a trustless system.", mood: "smile" },
      { speaker: "Ayano", text: "I feel like I can really trust you in this digital wilderness. Shall we form a DAO together?", mood: "blush" },
      {
        speaker: "",
        text: "As the digital sun sets over the blockchain, you realize that Web3 isn't just about money—it's about a new way of connecting.",
        mood: "neutral",
        next: "CREDITS",
      },
    ],
  },
  scam_ending: {
    bg: BACKGROUND_URLS.glitch_void,
    script: [
      { speaker: "Ayano", text: "No! Your private keys were compromised!", mood: "surprised" },
      { speaker: "Ayano", text: "Everything in your wallet is gone... and there's no 'Forgot Password' in Web3.", mood: "sad" },
      {
        speaker: "",
        text: "GAME OVER: You learned the hard way that self-custody requires constant vigilance.",
        mood: "neutral",
        next: "CREDITS",
      },
    ],
  },
  high_fees: {
    bg: BACKGROUND_URLS.busy_market,
    script: [
      { speaker: "Ayano", text: "Ugh, the transaction is taking forever and the fees cost more than the prize...", mood: "angry" },
      { speaker: "Ayano", text: "This is the 'Blockchain Trilemma' in action. Scalability is still a hurdle.", mood: "sad" },
      { speaker: "Ayano", text: "Let's try again tomorrow when the network is quieter.", mood: "neutral", next: "CREDITS" },
    ],
  },
};

function Scene1Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const charUrl = searchParams.get("charUrl") || "/partner.png";

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
      router.push("/");
      return;
    }

    if (lineIndex < sceneData.script.length - 1) {
      setLineIndex((prev) => prev + 1);
    } else if (lineData.next) {
      transitionToScene(lineData.next);
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
            className={`w-6 h-6 transition-colors duration-500 ${affection >= level
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
          className={`px-4 py-2 rounded-full backdrop-blur-md border font-bold text-sm transition-all ${autoMode
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

      <AyanoSprite isNarrator={isNarrator} charUrl={charUrl} />

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
}

export default function Scene1Page() {
  return (
    <Suspense fallback={<div className="w-full h-screen bg-black" />}>
      <Scene1Content />
    </Suspense>
  );
}
