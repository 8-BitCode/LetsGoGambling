import { Helmet } from "react-helmet";
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import pokerDogs from "./Assets/PokerDawgs.png";
import fadeInSound from "./Assets/SoundEffects/cheer.wav"; // Import the sound file
import "./CssFiles/END.css"; // Import the CSS file for animations

export default function END() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isScrollingDone, setIsScrollingDone] = useState(false);
  const [noLines, setNoLines] = useState([]); // State for the "No" lines
  const [showFadeIn, setShowFadeIn] = useState(false); // New state for fade-in delay
  const poemRef = useRef(null); // Ref to track the poem's height

  const poem = `Excerpt from The Gambler by Fyodor Dostoevsky:

"Yes, my nature is my weak point. I have only to remember what
happened to me some months ago at Roulettenberg, before my final ruin. What
a notable instance that was of my capacity for resolution! On the occasion in
question I had lost everything--everything; yet, just as I was leaving the
Casino, I heard another gulden give a rattle in my pocket! “Perhaps I shall need
it for a meal,” I thought to myself; but a hundred paces further on, I changed
my mind, and returned. That gulden I staked upon manque--and there is
something in the feeling that, though one is alone, and in a foreign land, and
far from one’s own home and friends, and ignorant of whence one’s next meal
is to come, one is nevertheless staking one’s very last coin! Well, I won the
stake, and in twenty minutes had left the Casino with a hundred and seventy
gulden in my pocket! That is a fact, and it shows what a last remaining gulden
can do. . . . But what if my heart had failed me, or I had shrunk from making
up my mind? . . .
<span class="highlight">No: tomorrow all shall be ended!"</span>
`;

  useEffect(() => {
    if (location.state?.fromUnlocked) {
      setIsUnlocked(true);
    } else {
      navigate("/GameSelection");
    }
  }, [location, navigate]);

  useEffect(() => {
    if (isUnlocked && poemRef.current) {
      // Calculate the duration of the scrolling animation
      const poemHeight = poemRef.current.scrollHeight;
      const screenHeight = window.innerHeight;
      const scrollDistance = poemHeight + screenHeight; // Total scroll distance
      const scrollSpeed = 30; // Reduced scroll speed (pixels per second)
      const duration = scrollDistance / scrollSpeed; // Duration in seconds
  
      // Set the animation duration dynamically
      poemRef.current.style.animationDuration = `${duration}s`;
  
      // Timer for when the scroll finishes
      const timer = setTimeout(() => {
        setIsScrollingDone(true);
      }, duration * 1000); // Convert to milliseconds
  
      return () => clearTimeout(timer);
    }
  }, [isUnlocked]);
  
  

  useEffect(() => {
    if (isScrollingDone) {

      // Start the "No" line scrolling effect (faster intervals)
      const interval = setInterval(() => {
        setNoLines((prev) => [
          ...prev.filter((item) => item.y > -50),
          {
            id: Date.now(),
            y: window.innerHeight,
            x: Math.random() * (window.innerWidth - 300), // Constrain x to prevent overflow
          },
        ]);
      }, 1000); // Add a new "No" line every 1 second (instead of 2)

      const moveInterval = setInterval(() => {
        setNoLines((prev) => prev.map((item) => ({ ...item, y: item.y - 4 }))); // Move faster (4px per frame instead of 2)
      }, 30);

      // Set a delay before showing the fade-in container
      const fadeInTimer = setTimeout(() => {
        setShowFadeIn(true);
              // Play the sound effect
      const audio = new Audio(fadeInSound);
      audio.play();
      }, 5000); // 5 seconds delay

      return () => {
        clearInterval(interval);
        clearInterval(moveInterval);
        clearTimeout(fadeInTimer);
      };
    }
  }, [isScrollingDone]);

  return (
    <>
      <Helmet>
        <title>The End</title>
      </Helmet>
      {isUnlocked ? (
        <div className="end-container">
          <div className="scrolling-text" ref={poemRef}>
            <pre
              style={{ fontFamily: "PixelFont" }}
              dangerouslySetInnerHTML={{ __html: poem }}
            />
          </div>
          {isScrollingDone && (
            <div className="infinite-loop-container">
              {noLines.map((item) => (
                <div
                  key={item.id}
                  className="infinite-loop-text"
                  style={{ top: item.y, left: item.x }}
                >
                  No: tomorrow all shall be ended!
                </div>
              ))}
            </div>
          )}
          <div
            className={`fade-in-container ${showFadeIn ? "visible" : ""}`}
          >
            <img
              src={pokerDogs}
              alt="Fade-in Image"
              className="fade-in-image"
            />
            <p className="fade-in-text">Let's Go Gambling</p>
          </div>
        </div>
      ) : null}
    </>
  );
}