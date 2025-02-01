"use client";
import React, {useState, useEffect} from "react";

export default function About() {
  const textContent = [
    {type: "h1", text: "About This Site\n"},
    {
      type: "p",
      text: "Welcome to my home video archive! This site was created as a way to digitize and archive the VHS videos that were taken when I was young.\n"
    },
    {type: "p", text: "If you want more info or to see other projects: "},
    {type: "link", text: "check out my GitHub"},
    {type: "p", text: "."},
  ];

  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex >= getAllText().length) {
      setIsComplete(true);
      return;
    }

    const typingInterval = setInterval(() => {
      setDisplayText((prev) => {
        const nextChar = getAllText().charAt(currentIndex);
        setCurrentIndex(currentIndex + 1);
        return prev + nextChar;
      });
    }, 50);

    return () => clearInterval(typingInterval);
  }, [currentIndex]);

  // concatenate text
  const getAllText = () => {
    return textContent.map((item) => item.text).join("");
  };

  const renderFormattedText = () => {
    let currentPos = 0;
    return textContent.map((item, idx) => {
      const length = item.text.length;
      const content = displayText.slice(currentPos, currentPos + length);
      currentPos += length;

      switch (item.type) {
        case "h1":
          return (
            <h1 key={idx} className="text-4xl mb-6">
              {content.replace("\n", "")}
            </h1>
          );
        case "link":
          return (
            <a
              key={idx}
              href="https://github.com/smbirch"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:underline cursor-pointer"
            >
              {content}
            </a>
          );
        case "p":
          return (
            <span key={idx}>
              {content.replace("\n", "")}
              {content.includes("\n") && <br/>}
            </span>
          );
        default:
          return content;
      }
    });
  };

  return (
    <div className="flex flex-col justify-between items-center bg-black text-white min-h-screen p-5">
      <main className="text-center max-w-3xl mt-20">
        <div className="relative inline-block">
          {renderFormattedText()}
          {!isComplete && (
            <span className="border-r-2 border-white animate-blink">&nbsp;</span>
          )}
        </div>
      </main>

      <footer className="text-center py-4 border-t border-gray-700 w-full mt-8">
        &copy; smbirch 2025
      </footer>

      <style jsx global>{`
        @keyframes blink {
          from,
          to {
            border-color: transparent;
          }
          50% {
            border-color: white;
          }
        }

        .animate-blink {
          animation: blink 1s step-end infinite;
        }
      `}</style>
    </div>
  );
}
