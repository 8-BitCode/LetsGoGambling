import { Helmet } from 'react-helmet';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
export default function END() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isUnlocked, setIsUnlocked] = useState(false);
  
    useEffect(() => {
      if (location.state?.fromUnlocked) {
        setIsUnlocked(true);
      } else {
        navigate('/GameSelection');
      }
    }, [location, navigate]);
  const poem = `
    You stand here now, at the edge of the spinning,
    Where the air hums low, a song never winning.
    The wheel turns, its spokes like knives in the dark,
    Each click a whisper, each tick a spark.

    You came for the glow, the promise of more,
    The shimmering prize beyond the door.
    But the door never closes, the prize never stays,
    It slips through your fingers, a mirage in the haze.

    The faces around you are blurred, undefined,
    Reflections of something you left far behind.
    Their laughter is hollow, their voices a thread,
    A chorus of echoes from the paths you once tread.

    You placed your bets, though no coins were seen,
    Traded your hours for the might-have-been.
    The wheel kept spinning, the numbers aligned,
    But the cost was your shadow, the self you confined.

    And now you see it, the truth in the spin,
    The wheel was a circle, a loop you were in.
    The prize was a phantom, the game a disguise,
    A labyrinth built on your own hungry eyes.

    In the beginning, the wheel was a dream,
    A glimmer of gold in a world turned gray.
    You reached for it, fingers trembling,
    And the wheel whispered, "Stay."

    It promised you kingdoms, a crown of stars,
    A map to a treasure that was always yours.
    But the map was a mirror, the treasure a lie,
    And the stars were just embers that burned as they died.

    The wheel spun faster, the air grew thin,
    The faces around you began to blend in.
    You forgot their names, their voices, their eyes,
    Until all that remained was the hum and the prize.

    You traded your days for the spin of the wheel,
    Your nights for the chance at a fortune unreal.
    But the fortune was smoke, the wheel a machine,
    And the cost was your soul, unseen, unseen.

    The wheel grew louder, its song a scream,
    A cacophony of hopes in a world turned mean.
    You clung to the edge, your hands raw and worn,
    But the wheel kept spinning, your spirit forlorn.

    The prize was a shadow, the game a trap,
    A cycle of loss with no end, no map.
    And yet you stayed, though the light grew dim,
    For the wheel had become your only hymn.

    But here, at the edge, the wheel slows its pace,
    The hum fades to silence, the light leaves no trace.
    You step away, though the pull is still strong,
    The song of the spinning, the siren’s sweet song.

    And as you walk, the world feels less thin,
    The air less heavy, the light within.
    The wheel fades behind you, its glow now a spark,
    A memory fading, a mark in the dark.

    For the game was never the wheel or the glow,
    But the hands that held you, the seeds you would sow.
    And now you are free, though the path is unclear,
    The wheel is behind you, the way forward is here.

    The faces return, their voices now clear,
    A symphony of life, not a chorus of fear.
    The prize was a phantom, the game a disguise,
    But the truth was within you, behind your own eyes.

    And so you walk, though the wheel still spins,
    Its song now distant, a hum on the wind.
    You carry the lessons, the scars, the light,
    And the wheel becomes silence, lost in the night.

    For the greatest reward was never the prize,
    But the truth in your heart, the spark in your eyes.
    The wheel fades behind, a memory, a ghost,
    And you, dear traveler, are what matters the most.
  `;

  // Inline styles
  const styles = {
    endContainer: {
      position: 'relative',
      width: '100%',
      height: '100vh',
      backgroundColor: 'black',
      color: '#00ff00', // Neon green text
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollingText: {
      position: 'absolute',
      bottom: '0',
      width: '80%',
      textAlign: 'center',
      whiteSpace: 'pre-wrap',
      animation: 'scroll-up 120s linear',
      fontFamily: 'PixelFont',
    },
    '@keyframes scroll-up': {
      '0%': {
        transform: 'translateY(100%)',
      },
      '100%': {
        transform: 'translateY(-100%)',
      },
    },
  };


  return (
    <>
      <Helmet>
        <title>The End</title>
      </Helmet>
      {isUnlocked ? (
        <div style={styles.endContainer}>
          <div style={styles.scrollingText}>
            <pre style={{ fontFamily: 'PixelFont' }}>{poem}</pre>
          </div>
          <style>
            {`
              @keyframes scroll-up {
                0% {
                  transform: translateY(100%);
                }
                100% {
                  transform: translateY(-100%);
                }
              }
            `}
          </style>
        </div>
      ) : null}
    </>
  );
}