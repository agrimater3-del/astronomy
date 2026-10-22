import React, { useState } from 'react';

export default function AstroClubSections({ onReturnToOrbit }) {
  const [selectedEvent, setSelectedEvent] = useState(1);

  const astroEvents = [
    {
      id: 1,
      date: 'AUG 12 - 13, 2025',
      title: 'Perseid Meteor Shower Peak',
      rate: 'Up to 100 Meteors / Hour',
      tag: 'MAJOR SKY EVENT'
    },
    {
      id: 2,
      date: 'AUG 23, 2025',
      title: 'Chandrayaan-3 Moon Landing',
      rate: 'National Space Day of India',
      tag: 'LUNAR COMMEMORATION'
    },
    {
      id: 3,
      date: 'AUG 01, 2025',
      title: 'Venus & Jupiter Dual Conjunction',
      rate: 'Pre-Dawn Twilight Alignment',
      tag: 'PLANETARY ALIGNMENT'
    }
  ];

  const galleryItems = [
    {
      title: 'Orion Nebula (M42)',
      distance: '1,344 Light-Years',
      image: '/astroclub/nebula-1.jpg',
      badge: 'Deep-Sky Nursery'
    },
    {
      title: 'Spiral Galaxy (M51)',
      distance: '23 Million Light-Years',
      image: '/astroclub/galaxy.jpg',
      badge: 'Galactic Core'
    },
    {
      title: 'Ringed Saturn',
      distance: '1.4 Billion km',
      image: '/astroclub/saturn.jpg',
      badge: 'Planetary Observation'
    }
  ];

  const teamMembers = [
    {
      name: 'Ketan',
      role: 'CLUB LEAD',
      focus: 'Observation & Instrumentation',
      image: '/astroclub/ketan.jpg',
      position: 'center 20%'
    },
    {
      name: 'Bhakti',
      role: 'CO-LEAD',
      focus: 'Astro-Events & Public Outreach',
      image: '/astroclub/bhakti.jpg',
      position: 'center 16%'
    },
    {
      name: 'Operations Crew',
      role: 'BROADCAST & OPS',
      focus: 'Telemetry & Digital Media',
      image: '/astroclub/astronaut3.jpg',
      position: 'center center'
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
        padding: '50px 4vw 70px',
        borderTop: '1px solid rgba(56, 189, 248, 0.2)'
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

        {/* =========================================================
            SECTION 1: PPCRC GROUND BASE IDENTITY
            ========================================================= */}
        <section style={{ marginBottom: '60px' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '24px',
              padding: '24px 28px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(2, 6, 23, 0.95) 100%)',
              border: '1px solid rgba(77, 182, 177, 0.35)',
              boxShadow: '0 12px 32px rgba(0,0,0,0.5)'
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  fontFamily: "'Space Grotesk', monospace",
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  color: '#38bdf8',
                  marginBottom: '10px'
                }}
              >
                <span>✦</span>
                <span>I²IT ASTRONOMY CLUB • PPCRC GROUND STATION</span>
              </div>
              <h2
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 'clamp(22px, 3.2vw, 34px)',
                  fontWeight: 800,
                  color: '#ffffff',
                  margin: 0
                }}
              >
                P-14, RAJIV GANDHI INFOTECH PARK, HINJAWADI, PUNE
              </h2>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px' }}>
                Coordinates: <strong style={{ color: '#4db6b1' }}>18.5204° N, 73.8567° E</strong> • Elevation: 560m ASL
              </div>
            </div>

            {/* Hardware / Facility Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
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
                📍 <span style={{ color: '#4db6b1' }}>Rooftop Sky Deck</span>
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
                🛰️ <span style={{ color: '#f59e0b' }}>NASA Horizons Linked</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 2: ASTRO-EVENTS HIGHLIGHTS
            ========================================================= */}
        <section style={{ marginBottom: '60px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(20px, 2.5vw, 28px)',
                fontWeight: 700,
                color: '#ffffff',
                margin: 0
              }}
            >
              UPCOMING SKY EVENTS
            </h3>
            <span style={{ fontSize: '11px', fontFamily: "'Space Grotesk', monospace", color: '#4db6b1' }}>
              AUGUST 2025 HIGHLIGHTS
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '16px'
            }}
          >
            {astroEvents.map((evt) => {
              const active = selectedEvent === evt.id;
              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt.id)}
                  style={{
                    padding: '18px',
                    borderRadius: '16px',
                    background: active
                      ? 'linear-gradient(145deg, rgba(77, 182, 177, 0.18) 0%, rgba(15, 23, 42, 0.85) 100%)'
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
                        padding: '2px 8px',
                        borderRadius: '999px',
                        background: active ? '#4db6b1' : 'rgba(255,255,255,0.08)',
                        color: active ? '#02040b' : '#94a3b8',
                        fontWeight: 700
                      }}
                    >
                      {evt.tag}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: '0 0 6px' }}>
                    {evt.title}
                  </h4>
                  <div style={{ fontSize: '12px', color: '#94a3b8', fontFamily: "'Space Grotesk', monospace" }}>
                    {evt.rate}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================
            SECTION 3: COSMIC GALLERY & CLUB LEADERSHIP
            ========================================================= */}
        <section style={{ marginBottom: '50px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(20px, 2.5vw, 28px)',
                fontWeight: 700,
                color: '#ffffff',
                margin: 0
              }}
            >
              COSMIC OBSERVATIONS
            </h3>
            <span style={{ fontSize: '11px', fontFamily: "'Space Grotesk', monospace", color: '#38bdf8' }}>
              ASTROPHOTOGRAPHY
            </span>
          </div>

          {/* 3 Astrophotography Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '18px',
              marginBottom: '32px'
            }}
          >
            {galleryItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'transform 0.3s ease'
                }}
              >
                <div style={{ width: '100%', height: '180px', overflow: 'hidden' }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1.0)'; }}
                  />
                </div>
                <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                      {item.title}
                    </h4>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      {item.distance}
                    </span>
                  </div>
                  <span style={{ fontSize: '10px', fontFamily: "'Space Grotesk', monospace", color: '#4db6b1', fontWeight: 600 }}>
                    {item.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Leadership Team Cards: Ketan (Lead) & Bhakti (Co-Lead) */}
          <div
            style={{
              borderRadius: '20px',
              padding: '24px 32px',
              background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.6) 0%, rgba(2, 6, 23, 0.8) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
              alignItems: 'center',
              gap: '24px'
            }}
          >
            {teamMembers.map((m, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2.5px solid #4db6b1',
                    boxShadow: '0 0 16px rgba(77, 182, 177, 0.35)',
                    flexShrink: 0,
                    background: '#0a0f1d'
                  }}
                >
                  <img
                    src={m.image}
                    alt={m.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: m.position
                    }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                    {m.name}
                  </div>
                  <div style={{ fontSize: '11px', fontFamily: "'Space Grotesk', monospace", color: '#38bdf8', fontWeight: 700, letterSpacing: '0.05em' }}>
                    {m.role}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
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
            paddingTop: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
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
              padding: '14px 20px',
              borderRadius: '12px',
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
