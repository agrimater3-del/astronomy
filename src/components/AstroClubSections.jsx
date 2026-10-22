import React, { useState } from 'react';

export default function AstroClubSections({ onReturnToOrbit }) {
  const [selectedEvent, setSelectedEvent] = useState(1);

  const astroEvents = [
    {
      id: 1,
      date: 'AUG 12 - 13, 2025',
      title: 'Perseid Meteor Shower Peak',
      source: 'Comet Swift-Tuttle Debris Stream',
      rate: 'Up to 100 Meteors / Hour',
      desc: 'One of the brightest and most active meteor showers of the year. Fast-moving meteors produce persistent ionized luminous trails visible across the dark Pune night sky.',
      tag: 'MAJOR SKY EVENT'
    },
    {
      id: 2,
      date: 'AUG 23, 2025',
      title: 'Chandrayaan-3 Moon Landing Commemoration',
      source: 'National Space Day of India',
      rate: 'ISRO Lunar Polar Milestone',
      desc: 'Celebrating India’s historic soft landing near the lunar south pole with the Vikram lander and Pragyan rover. The club conducts special telescope lunar crater mapping sessions.',
      tag: 'NATIONAL SPACE DAY'
    },
    {
      id: 3,
      date: 'AUG 01, 2025',
      title: 'Venus & Jupiter Dual Conjunction',
      source: 'Pre-Dawn Orbital Alignment',
      rate: 'Apparent Distance < 0.5°',
      desc: 'Spectacular close optical approach of the two brightest solar planets against the morning twilight, easily observed with amateur telescopes and binoculars.',
      tag: 'PLANETARY ALIGNMENT'
    }
  ];

  const galleryItems = [
    {
      title: 'Orion Nebula (M42)',
      type: 'Stellar Nursery',
      distance: '1,344 Light-Years',
      image: '/astroclub/nebula-1.jpg',
      badge: 'Deep-Sky Astrophotography'
    },
    {
      title: 'Spiral Galaxy (M51)',
      type: 'Grand Design Spiral',
      distance: '23 Million Light-Years',
      image: '/astroclub/galaxy.jpg',
      badge: 'Galactic Structure'
    },
    {
      title: 'Ringed Saturn',
      type: 'Gas Giant System',
      distance: '1.4 Billion km',
      image: '/astroclub/saturn.jpg',
      badge: 'Planetary Observation'
    }
  ];

  const teamMembers = [
    {
      role: 'CLUB LEAD',
      focus: 'Chief of Observation & Instrumentation',
      image: '/astroclub/astronaut.jpg'
    },
    {
      role: 'CO-LEAD',
      focus: 'Astro-Events & Public Outreach',
      image: '/astroclub/astronaut.jpg'
    },
    {
      role: 'BROADCAST & OPS',
      focus: 'Telemetry, Imaging & Mission Media',
      image: '/astroclub/astronaut3.jpg'
    }
  ];

  return (
    <div
      className="astroclub-hub-container"
      style={{
        width: '100%',
        position: 'relative',
        zIndex: 10,
        background: 'linear-gradient(180deg, rgba(2,4,11,0.6) 0%, rgba(4,8,22,0.95) 15%, #02040b 100%)',
        color: '#e2e8f0',
        padding: '60px 4vw 80px',
        borderTop: '1px solid rgba(56, 189, 248, 0.2)'
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* =========================================================
            SECTION 1: CLUB OVERVIEW & MISSION
            ========================================================= */}
        <section style={{ marginBottom: '80px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              fontFamily: "'Space Grotesk', monospace",
              fontSize: '11px',
              letterSpacing: '0.12em',
              color: '#38bdf8',
              marginBottom: '16px'
            }}
          >
            <span>✦</span>
            <span>I²IT ASTRONOMY CLUB • GROUND STATION ARCHIVE</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '36px',
              alignItems: 'center'
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 'clamp(28px, 4vw, 44px)',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  lineHeight: 1.15,
                  margin: '0 0 16px'
                }}
              >
                EXPLORE THE COSMOS <br />
                <span style={{ color: '#4db6b1' }}>WITH I²IT ASTRONOMY</span>
              </h2>
              <p
                style={{
                  fontSize: '15px',
                  lineHeight: 1.65,
                  color: '#94a3b8',
                  marginBottom: '20px',
                  maxWidth: '560px'
                }}
              >
                Headquartered at the PPCRC Complex in Hinjawadi, Pune, the I²IT Astronomy Club unites student researchers, engineers, and stargazers. From live planetary observation to orbital calculations and astrophotography, we turn curiosity into scientific exploration.
              </p>

              {/* Quick Stat Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <div
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '12px',
                    fontFamily: "'Space Grotesk', monospace"
                  }}
                >
                  🔭 <span style={{ color: '#38bdf8' }}>8" Dobsonian &amp; SCT</span>
                </div>
                <div
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '12px',
                    fontFamily: "'Space Grotesk', monospace"
                  }}
                >
                  📍 <span style={{ color: '#4db6b1' }}>PPCRC Observation Deck</span>
                </div>
                <div
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '12px',
                    fontFamily: "'Space Grotesk', monospace"
                  }}
                >
                  🛰️ <span style={{ color: '#f59e0b' }}>ISRO &amp; Deep-Sky Tracking</span>
                </div>
              </div>
            </div>

            {/* Earth & Campus Connection Card */}
            <div
              style={{
                position: 'relative',
                borderRadius: '20px',
                padding: '24px',
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(2, 6, 23, 0.9) 100%)',
                border: '1px solid rgba(77, 182, 177, 0.3)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
              }}
            >
              <img
                src="/astroclub/earth.jpg"
                alt="Earth"
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #4db6b1',
                  flexShrink: 0
                }}
              />
              <div>
                <div style={{ fontSize: '11px', fontFamily: "'Space Grotesk', monospace", color: '#4db6b1', letterSpacing: '0.1em' }}>
                  GROUND BASE COORDINATES
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: '4px 0' }}>
                  18.5204° N, 73.8567° E
                </div>
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                  PPCRC Building, I²IT Campus, Hinjawadi Phase 1, Pune, India
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 2: ASTRO-EVENTS & SPACE CALENDAR
            ========================================================= */}
        <section style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(24px, 3.2vw, 36px)',
                fontWeight: 700,
                color: '#ffffff',
                margin: '0 0 8px'
              }}
            >
              ASTRONOMICAL CALENDAR &amp; EVENTS
            </h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
              Key celestial highlights tracked by the observation wing
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '18px',
              marginBottom: '20px'
            }}
          >
            {astroEvents.map((evt) => {
              const active = selectedEvent === evt.id;
              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt.id)}
                  style={{
                    padding: '20px',
                    borderRadius: '16px',
                    background: active
                      ? 'linear-gradient(145deg, rgba(77, 182, 177, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)'
                      : 'rgba(15, 23, 42, 0.5)',
                    border: active ? '1px solid #4db6b1' : '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: active ? '0 8px 24px rgba(77, 182, 177, 0.2)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontFamily: "'Space Grotesk', monospace", color: '#38bdf8', fontWeight: 600 }}>
                      {evt.date}
                    </span>
                    <span
                      style={{
                        fontSize: '9px',
                        fontFamily: "'Space Grotesk', monospace",
                        padding: '3px 8px',
                        borderRadius: '999px',
                        background: active ? '#4db6b1' : 'rgba(255,255,255,0.08)',
                        color: active ? '#02040b' : '#94a3b8',
                        fontWeight: 700
                      }}
                    >
                      {evt.tag}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: '0 0 8px' }}>
                    {evt.title}
                  </h4>
                  <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 10px' }}>
                    {evt.desc}
                  </p>

                  <div style={{ fontSize: '11px', color: '#64748b', fontFamily: "'Space Grotesk', monospace" }}>
                    RATE / TYPE: <span style={{ color: '#e2e8f0' }}>{evt.rate}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cosmic Fun Fact Banner */}
          <div
            style={{
              padding: '16px 24px',
              borderRadius: '14px',
              background: 'rgba(56, 189, 248, 0.06)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}
          >
            <span style={{ fontSize: '20px' }}>💡</span>
            <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5 }}>
              <strong style={{ color: '#38bdf8' }}>Cosmic Fun Fact:</strong> During the Perseid meteor shower peak, particles as small as grains of sand hit Earth’s upper atmosphere at 59 km/s (130,000 mph), vaporizing into incandescent streaks of light!
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 3: DEEP-SKY GALLERY & LEADERSHIP SQUAD
            ========================================================= */}
        <section style={{ marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(24px, 3.2vw, 36px)',
                fontWeight: 700,
                color: '#ffffff',
                margin: '0 0 8px'
              }}
            >
              COSMIC GALLERY &amp; BROADCAST CREW
            </h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
              Deep-sky observations and club leadership at PPCRC
            </p>
          </div>

          {/* 3 Astrophotography Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '36px'
            }}
          >
            {galleryItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  borderRadius: '18px',
                  overflow: 'hidden',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'transform 0.3s ease, border-color 0.3s ease'
                }}
              >
                <div style={{ width: '100%', height: '200px', overflow: 'hidden' }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1.0)'; }}
                  />
                </div>
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '10px', fontFamily: "'Space Grotesk', monospace", color: '#4db6b1', fontWeight: 600 }}>
                      {item.badge}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      {item.distance}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>

          {/* Leadership Team Avatars */}
          <div
            style={{
              borderRadius: '20px',
              padding: '24px 32px',
              background: 'rgba(15, 23, 42, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
              alignItems: 'center',
              gap: '24px'
            }}
          >
            {teamMembers.map((m, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid #4db6b1',
                    flexShrink: 0
                  }}
                >
                  <img
                    src={m.image}
                    alt={m.role}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                    {m.role}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {m.focus}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
            BOTTOM NAVIGATION & RETURN TO ORBIT + DEVELOPER CREDITS
            ========================================================= */}
        <footer
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              fontSize: '13px',
              color: '#64748b'
            }}
          >
            <div>
              © {new Date().getFullYear()} I²IT Astronomy Club • Hope Foundation • PPCRC Complex Hinjawadi
            </div>

            <button
              type="button"
              onClick={onReturnToOrbit}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '9999px',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                color: '#38bdf8',
                fontFamily: "'Space Grotesk', monospace",
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.25)';
                e.currentTarget.style.borderColor = '#38bdf8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.35)';
              }}
            >
              <span>↑</span>
              <span>RETURN TO COSMIC ORBIT</span>
            </button>
          </div>

          {/* Official Engineering & Developer Attribution */}
          <div
            style={{
              padding: '16px 22px',
              borderRadius: '14px',
              background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.22)',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px' }}>⚡</span>
              <span
                style={{
                  fontFamily: "'Space Grotesk', monospace",
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: '#38bdf8'
                }}
              >
                DEVELOPED BY JARVIS ASTRA V2.0
              </span>
            </div>

            <div
              style={{
                fontFamily: "'Space Grotesk', monospace",
                fontSize: '12px',
                color: '#94a3b8'
              }}
            >
              Developers:&nbsp;
              <span style={{ color: '#ffffff', fontWeight: 600 }}>Dhairyashil Shinde</span>,&nbsp;
              <span style={{ color: '#ffffff', fontWeight: 600 }}>Prathamesh Raut</span>,&nbsp;
              <span style={{ color: '#ffffff', fontWeight: 600 }}>Ganesh</span>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
