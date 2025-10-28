import React, { useEffect, useRef, useState } from 'react';

const Effect = ({ children }) => {
  const addRef = useRef(null);
  const [textureUrl, setTextureUrl] = useState('http://i.imgur.com/xrwK0bK.png');

  useEffect(() => {
    const img = new Image();
    img.src = textureUrl;
    img.onload = () => {
      // Image loaded fine — keep the texture
    };
    img.onerror = () => {
      // If it fails, clear it so the overlay is blank
      setTextureUrl('');
    };
  }, [textureUrl]);

  useEffect(() => {
    const updateBackgroundPosition = () => {
      if (addRef.current) {
        const x = Math.floor(1024 * Math.random());
        const y = Math.floor(1024 * Math.random());
        addRef.current.style.backgroundPosition = `${x}px ${y}px`;
      }
      requestAnimationFrame(updateBackgroundPosition);
    };

    updateBackgroundPosition();

    return () => {
      // Cleanup if necessary
    };
  }, []);

  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
      {/* Define a mild color filter */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0 }}>
        <filter id="mild-color-effect" colorInterpolationFilters="sRGB">
          <feComponentTransfer>
            <feFuncR type="linear" slope="1" intercept="-0.05" />
            <feFuncG type="linear" slope="1" intercept="0.05" />
            <feFuncB type="linear" slope="1" intercept="-0.02" />
          </feComponentTransfer>
        </filter>
      </svg>

      {/* Apply the mild color filter to the content */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          filter: 'url(#mild-color-effect)',
        }}
      >
        {children}
      </div>

      {/* Overlay the dithering texture */}
      <div
        ref={addRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
          background: textureUrl ? `url('${textureUrl}')` : 'none',
          opacity: textureUrl ? 1 : 0,
          zIndex: 9999,
        }}
      />
    </div>
  );
};

export default Effect;
