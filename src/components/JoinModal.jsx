import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, User, Mail, GraduationCap, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function JoinModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Computer Engineering',
    year: 'Second Year (SE)',
    interest: 'Astrophotography & Telescopes'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [memberId, setMemberId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    // Generate member id
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const id = `I2IT-ASTRO-2026-${randNum}`;
    setMemberId(id);
    setIsSubmitted(true);

    // Fire cosmic celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#f59e0b', '#a78bfa', '#ffffff']
      });
    } catch (err) {}
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="btn-modal-close" onClick={onClose}>
          <X size={18} />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="modal-header">
              <div className="modal-badge">
                <Sparkles size={14} className="text-amber-400" />
                <span>MEMBERSHIP ENROLLMENT</span>
              </div>
              <h3 className="modal-title">Join I2IT Astronomy Club</h3>
              <p className="modal-subtitle">
                Become part of Hope Foundation’s International Institute of Information Technology astronomy society.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">
                  <User size={14} />
                  <span>Full Name</span>
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Aryan Sharma" 
                  className="form-input"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Mail size={14} />
                  <span>College Email ID</span>
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="e.g. aryan.s@isquareit.edu.in" 
                  className="form-input"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label className="form-label">
                    <GraduationCap size={14} />
                    <span>Department</span>
                  </label>
                  <select 
                    className="form-input"
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                  >
                    <option>Computer Engineering (CE)</option>
                    <option>Information Technology (IT)</option>
                    <option>Electronics & Telecomm (E&TC)</option>
                    <option>First Year Engineering</option>
                  </select>
                </div>

                <div className="form-group half">
                  <label className="form-label">
                    <Compass size={14} />
                    <span>Academic Year</span>
                  </label>
                  <select 
                    className="form-input"
                    value={formData.year}
                    onChange={e => setFormData({ ...formData, year: e.target.value })}
                  >
                    <option>First Year (FE)</option>
                    <option>Second Year (SE)</option>
                    <option>Third Year (TE)</option>
                    <option>Final Year (BE)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Primary Astronomical Interest</label>
                <select 
                  className="form-input"
                  value={formData.interest}
                  onChange={e => setFormData({ ...formData, interest: e.target.value })}
                >
                  <option>Astrophotography & Image Processing</option>
                  <option>Telescope Optics & Alignment</option>
                  <option>Observational Stargazing & Constellations</option>
                  <option>Theoretical Astrophysics & Cosmology</option>
                  <option>Astronomy Club Event Coordination</option>
                </select>
              </div>

              <button type="submit" className="btn-modal-submit">
                <span>Submit Membership Application</span>
                <Sparkles size={16} />
              </button>
            </form>
          </div>
        ) : (
          <div className="modal-success-state">
            <div className="success-icon-wrapper">
              <CheckCircle2 size={48} className="text-emerald-400" />
            </div>
            
            <h3 className="success-title">Welcome to the Club!</h3>
            <p className="success-desc">
              Congratulations <strong>{formData.name}</strong>, your application has been verified by the I2IT Astronomy Council.
            </p>

            <div className="astro-cadet-card">
              <div className="cadet-header">
                <span>I2IT ASTRONOMY CLUB — OFFICIAL PASS</span>
                <span className="badge-active">ACTIVE</span>
              </div>
              <div className="cadet-id">{memberId}</div>
              <div className="cadet-details">
                <span>{formData.name}</span>
                <span>•</span>
                <span>{formData.department}</span>
              </div>
            </div>

            <div className="success-actions">
              <button className="btn-modal-submit" onClick={onClose}>
                Start Stargazing
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
