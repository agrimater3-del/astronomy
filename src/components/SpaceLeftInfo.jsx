import React, { useEffect, useState } from 'react';

export default function SpaceLeftInfo({
  active = false,
  isTilted = false,
  solarZoom = 0.0
}) {
  // Letters of the word "COSMOS" for the initial core zoomed state
  const cosmosLetters = ['C', 'O', 'S', 'M', 'O', 'S'];

  // Letters of "THE MILKY WAY" for the scrolled state
  const milkywayWords = [
    { word: 'THE', startIndex: 0 },
    { word: 'MILKY', startIndex: 3 },
    { word: 'WAY', startIndex: 8 }
  ];

  // State to track when the initial COSMOS letters finish bouncing in
  const [lettersFinished, setLettersFinished] = useState(false);

  // State to track when the scrolled MILKY WAY letters finish bouncing in
  const [milkywayLettersDone, setMilkywayLettersDone] = useState(false);

  useEffect(() => {
    if (!active) {
      setLettersFinished(false);
      return;
    }

    // Letters stagger: 0s to 0.60s. After ~1.1s, subtitle and description reveal.
    const timer = setTimeout(() => {
      setLettersFinished(true);
    }, 1100);

    return () => clearTimeout(timer);
  }, [active]);

  useEffect(() => {
    if (isTilted && solarZoom <= 0.20) {
      // 11 characters * 0.08s = 0.88s + 0.72s animation = ~1.5s total.
      // After ~1.0s, smoothly reveal the subtitle, paragraphs, and stats.
      setMilkywayLettersDone(false);
      const timer = setTimeout(() => {
        setMilkywayLettersDone(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (!isTilted) {
      setMilkywayLettersDone(false);
    }
  }, [isTilted, solarZoom <= 0.20]);

  if (!active) return null;

  // Dwell zone: "THE MILKY WAY" section stays comfortably visible while solarZoom <= 0.20.
  // When user intentionally scrolls down past 0.20, it triggers its instant reverse transition!
  const isExitingMilkyWay = isTilted && solarZoom > 0.20;

  // Fully unmount when scrolled past 0.28 into Solar System to eliminate any ghost border glitch
  if (isTilted && solarZoom > 0.28) return null;

  return (
    <div
      className={`cosmos-hero-stage ${
        isTilted ? 'pos-right is-milkyway-state' : 'pos-left is-cosmos-state'
      } ${isExitingMilkyWay ? 'stage-exiting' : ''}`}
      style={{
        pointerEvents: isExitingMilkyWay ? 'none' : 'auto'
      }}
    >
      {/* =================================================================
          PANE 1: COSMOS MAIN PAGE (BEFORE SCROLLING DOWN)
          - Left aligned
          - "COSMOS" bold condensed heading with letter zoom bounce
          - "EXPLORE WHAT LIES BEYOND" & tagline
          - Club introduction description
          ================================================================= */}
      <div
        className={`hero-content-pane pane-cosmos ${
          !isTilted ? 'active-pane' : 'inactive-pane'
        }`}
      >
        <h1 className="cosmos-main-heading" aria-label="COSMOS">
          {cosmosLetters.map((char, index) => (
            <span
              key={index}
              className={`cosmos-bounce-letter bounce-in cosmos-letter-${index}`}
              style={{
                animationDelay: `${index * 0.12}s`
              }}
            >
              {char}
            </span>
          ))}
        </h1>

        <div
          className={`cosmos-text-block ${
            lettersFinished ? 'reveal-smooth' : 'hidden-smooth'
          }`}
        >
          <h2 className="cosmos-subheading-eyebrow">
            EXPLORE WHAT LIES BEYOND
          </h2>

          <h3 className="cosmos-subheading-tagline">
            THE INFINITE REALM OF STARS &amp; GRAVITATIONAL WONDERS
          </h3>

          <p className="cosmos-description-text">
            The Astronomy Club of I²IT Pune. We explore galaxies, decode cosmic
            mysteries, observe celestial wonders, and bring the universe closer
            through astronomy, stargazing, and space exploration.
          </p>
        </div>
      </div>

      {/* =================================================================
          PANE 2: THE MILKY WAY (WHEN SCROLLED DOWN FROM MAIN PAGE)
          - Right aligned
          - "THE MILKY WAY" letter-by-letter zoom-in bounce like COSMOS
          - "OUR HOME IN THE COSMOS." subheading
          - 2 descriptive paragraphs
          - 3 key astronomical facts / highlights
          - ON SLIGHTLY DOWNSCROLL: Goes into reverse transition instantly!
          ================================================================= */}
      <div
        className={`hero-content-pane pane-milkyway ${
          !isTilted
            ? 'inactive-pane'
            : isExitingMilkyWay
            ? 'reverse-exit'
            : 'active-pane'
        }`}
      >
        {/* Letter-by-letter heading: zoom bounce in on arrival, reverse bounce on downscroll */}
        <h1
          key={isTilted ? (isExitingMilkyWay ? 'mw-exit' : 'mw-active') : 'mw-inactive'}
          className="milkyway-main-heading"
          aria-label="THE MILKY WAY"
        >
          {milkywayWords.map((wordObj, wIdx) => (
            <React.Fragment key={wIdx}>
              <span className="milkyway-word">
                {wordObj.word.split('').map((char, cIdx) => (
                  <span
                    key={cIdx}
                    className={`milkyway-bounce-letter ${
                      isExitingMilkyWay ? 'reverse-out' : 'bounce-in'
                    }`}
                    style={{
                      animationDelay: isExitingMilkyWay
                        ? `${(10 - (wordObj.startIndex + cIdx)) * 0.02}s`
                        : `${(wordObj.startIndex + cIdx) * 0.08}s`
                    }}
                  >
                    {char}
                  </span>
                ))}
              </span>
              {wIdx < milkywayWords.length - 1 && (
                <span className="milkyway-word-space" />
              )}
            </React.Fragment>
          ))}
        </h1>

        <div
          className={`milkyway-text-block ${
            !isExitingMilkyWay && milkywayLettersDone ? 'reveal-smooth' : 'hidden-smooth'
          }`}
        >
          <h2 className="milkyway-subheading">
            OUR HOME IN THE COSMOS.
          </h2>

          <div className="milkyway-paragraphs">
            <p className="milkyway-p">
              A vast spiral galaxy filled with hundreds of billions of stars,
              countless planetary systems, and clouds of cosmic dust. Within one
              of its spiral arms lies our Sun, carrying Earth and its neighboring
              planets through an immense celestial landscape.
            </p>
            <p className="milkyway-p">
              Stretching roughly 100,000 light-years across, the Milky Way is our
              home among the stars — a universe of its own, with mysteries still
              waiting to be discovered.
            </p>
          </div>

          <div className="milkyway-stats-list">
            <div className="milkyway-stat-item">
              <span className="stat-highlight">100,000 LIGHT-YEARS</span>
              <span className="stat-separator">—</span>
              <span className="stat-desc">Approximate diameter</span>
            </div>
            <div className="milkyway-stat-item">
              <span className="stat-highlight">200+ BILLION STARS</span>
              <span className="stat-separator">—</span>
              <span className="stat-desc">A commonly cited estimate</span>
            </div>
            <div className="milkyway-stat-item">
              <span className="stat-highlight">1 GALAXY WE CALL HOME</span>
              <span className="stat-separator">—</span>
              <span className="stat-desc">Our place in the universe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
