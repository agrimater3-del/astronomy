import React from 'react';
import { Calendar, MapPin, Users, Telescope, Camera, Sun, Award } from 'lucide-react';

const EVENTS = [
  {
    title: 'Mahabaleshwar Dark Sky All-Night Expedition',
    date: 'Nov 14 – 15, 2026',
    loc: 'Arthur Seat Plateau, Mahabaleshwar (Bortle 2)',
    badge: 'EXPEDITION',
    desc: 'Breathtaking 8-hour uninterrupted deep sky survey under Bortle Class 2 pristine skies. Observing Andromeda, Orion Nebula, and Pleiades.',
    slots: '28 / 35 Registered'
  },
  {
    title: 'Geminids Meteor Shower Campus Campout',
    date: 'Dec 13, 2026',
    loc: 'I2IT Main Amphitheater & Astro Lawn',
    badge: 'ANNUAL WATCH',
    desc: 'Peak meteor rate up to 120 meteors/hour! Live all-sky cameras, laser constellation tours, and astrophotography tracking rigs.',
    slots: 'Open to All Students'
  },
  {
    title: 'Solar Eclipse & Sunspot H-Alpha Workshop',
    date: 'Jan 22, 2027',
    loc: 'Department of Electronics & Telecomm Terrace',
    badge: 'SOLAR LAB',
    desc: 'Safe observation of solar coronal mass ejections, sunspots, and prominences using dedicated Lunt & Coronado H-Alpha solar scopes.',
    slots: 'Limited to 20'
  }
];

const GEAR_ITEMS = [
  {
    name: 'Celestron NexStar 8SE Schmidt-Cassegrain',
    aperture: '203 mm (8 Inch) Optical Tube',
    mount: 'Computerized Altazimuth GoTo with 40,000+ Objects Database',
    use: 'Deep Sky Galaxies & Planetary Lunar Imaging'
  },
  {
    name: 'Sky-Watcher Dobsonian 10" Collapsible',
    aperture: '254 mm (10 Inch) Parabolic Mirror',
    mount: 'Smooth Teflon Manual Dobsonian Mount',
    use: 'Visual Light Bucket for Faint Nebulae and Star Clusters'
  },
  {
    name: 'ZWO ASI294MC Pro Cooled Astronomy Camera',
    aperture: 'Micro 4/3 Back-Illuminated Sony IMX294 Sensor',
    mount: 'Active Peltier Cooling down to -35°C below ambient',
    use: 'Long-exposure narrowband astrophotography'
  }
];

export default function ClubEvents({ onOpenJoin }) {
  return (
    <section id="events" className="events-section">
      <div className="section-container">
        
        {/* Events Header */}
        <div className="section-head">
          <div className="section-pill">
            <Calendar size={14} className="text-amber-400" />
            <span>EXPEDITIONS & MISSIONS</span>
          </div>
          <h2 className="section-title">Upcoming Stargazing Gatherings</h2>
          <p className="section-subtitle">
            Hands-on observation nights, off-campus dark sky camps, and practical telescope handling workshops.
          </p>
        </div>

        {/* Events Grid */}
        <div className="events-grid">
          {EVENTS.map((evt, idx) => (
            <div key={idx} className="event-card">
              <div className="event-top-row">
                <span className="event-badge">{evt.badge}</span>
                <span className="event-date">
                  <Calendar size={13} />
                  <span>{evt.date}</span>
                </span>
              </div>
              
              <h3 className="event-title">{evt.title}</h3>
              
              <div className="event-location">
                <MapPin size={14} className="text-cyan-400 shrink-0" />
                <span>{evt.loc}</span>
              </div>

              <p className="event-desc">{evt.desc}</p>

              <div className="event-footer">
                <span className="event-slots">
                  <Users size={14} />
                  <span>{evt.slots}</span>
                </span>

                <button className="btn-event-rsvp" onClick={onOpenJoin}>
                  RSVP / Register
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Club Equipment Fleet */}
        <div className="equipment-showcase">
          <div className="section-head text-left">
            <div className="section-pill">
              <Telescope size={14} className="text-cyan-400" />
              <span>LABORATORY INSTRUMENTS</span>
            </div>
            <h3 className="sub-section-title">Club Optical Rigs & Astrophotography Gear</h3>
          </div>

          <div className="gear-grid">
            {GEAR_ITEMS.map((gear, idx) => (
              <div key={idx} className="gear-card">
                <div className="gear-icon-wrapper">
                  <Telescope size={22} className="text-amber-400" />
                </div>
                <h4 className="gear-name">{gear.name}</h4>
                <div className="gear-spec">
                  <span className="spec-label">Aperture:</span>
                  <span className="spec-val">{gear.aperture}</span>
                </div>
                <div className="gear-spec">
                  <span className="spec-label">Mounting:</span>
                  <span className="spec-val">{gear.mount}</span>
                </div>
                <div className="gear-spec">
                  <span className="spec-label">Primary Role:</span>
                  <span className="spec-val highlight">{gear.use}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
