/**
 * 0RB SYSTEM - Book a Demo
 * Get people on calls
 */

import { useState } from 'react';
import Head from 'next/head';

export default function BookDemo() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    industry: '',
    painPoint: '',
    preferredTime: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const industries = [
    'Legal', 'Medical/Healthcare', 'Sales', 'Finance',
    'Creative/Marketing', 'Software/Tech', 'Customer Support',
    'HR/Recruiting', 'Operations', 'Executive/C-Suite', 'Other'
  ];

  const timeSlots = [
    'Morning (9am-12pm)',
    'Afternoon (12pm-5pm)',
    'Evening (5pm-8pm)',
    'Flexible'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // In production, send to your CRM/email
    console.log('Lead captured:', formData);

    // For now, just show success
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="book-page">
        <Head>
          <title>Demo Booked | 0RB SYSTEM</title>
        </Head>
        <div className="success-container">
          <div className="success-icon">✅</div>
          <h1>You're In!</h1>
          <p>Check your email for the calendar invite.</p>
          <p className="success-sub">We'll show you exactly how 0RB can 10x your workflow.</p>
          <a href="/" className="back-btn">Explore the System →</a>
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  }

  return (
    <div className="book-page">
      <Head>
        <title>Book a Demo | 0RB SYSTEM</title>
        <meta name="description" content="See how 0RB can automate your workflow. Free 15-minute demo." />
      </Head>

      <div className="book-container">
        <div className="book-left">
          <h1>See 0RB in Action</h1>
          <p className="subtitle">15 minutes. No pitch. Just value.</p>

          <div className="benefits">
            <div className="benefit">
              <span className="benefit-icon">⚡</span>
              <div>
                <strong>See Your Workflow Automated</strong>
                <p>We'll show you exactly how 0RB handles YOUR specific tasks</p>
              </div>
            </div>
            <div className="benefit">
              <span className="benefit-icon">🎯</span>
              <div>
                <strong>Custom Demo for Your Industry</strong>
                <p>Legal, Medical, Sales, Finance - we've got you covered</p>
              </div>
            </div>
            <div className="benefit">
              <span className="benefit-icon">🚀</span>
              <div>
                <strong>Leave with a Game Plan</strong>
                <p>Whether you buy or not, you'll know exactly what to automate</p>
              </div>
            </div>
          </div>

          <div className="social-proof">
            <p>"Went from 40 hours/week to 15 on client work"</p>
            <span>— Sarah, Legal Consultant</span>
          </div>
        </div>

        <div className="book-right">
          <form onSubmit={handleSubmit} className="book-form">
            <div className="form-group">
              <label>Your Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="John Smith"
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="john@company.com"
              />
            </div>

            <div className="form-group">
              <label>Company</label>
              <input
                type="text"
                value={formData.company}
                onChange={e => setFormData({...formData, company: e.target.value})}
                placeholder="Acme Inc"
              />
            </div>

            <div className="form-group">
              <label>Industry *</label>
              <select
                required
                value={formData.industry}
                onChange={e => setFormData({...formData, industry: e.target.value})}
              >
                <option value="">Select your industry</option>
                {industries.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>What's eating up your time? *</label>
              <textarea
                required
                value={formData.painPoint}
                onChange={e => setFormData({...formData, painPoint: e.target.value})}
                placeholder="E.g., I spend 10+ hours a week on client reports..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Preferred Time *</label>
              <select
                required
                value={formData.preferredTime}
                onChange={e => setFormData({...formData, preferredTime: e.target.value})}
              >
                <option value="">Select a time</option>
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="submit-btn">
              Book My Demo →
            </button>

            <p className="form-note">
              No credit card required. No commitment. Just a conversation.
            </p>
          </form>
        </div>
      </div>

      <style jsx>{styles}</style>
    </div>
  );
}

const styles = `
  .book-page {
    min-height: 100vh;
    background: #0a0a0f;
    color: #fff;
    font-family: 'Rajdhani', sans-serif;
    padding: 40px 20px;
  }

  .book-container {
    max-width: 1000px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: start;
  }

  @media (max-width: 768px) {
    .book-container {
      grid-template-columns: 1fr;
      gap: 40px;
    }
  }

  .book-left h1 {
    font-family: 'Orbitron', sans-serif;
    font-size: 2.5rem;
    margin-bottom: 10px;
    letter-spacing: 0.05em;
  }

  .subtitle {
    color: #00ffff;
    font-size: 1.2rem;
    margin-bottom: 40px;
  }

  .benefits {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-bottom: 40px;
  }

  .benefit {
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }

  .benefit-icon {
    font-size: 1.5rem;
    width: 40px;
    height: 40px;
    background: #12121a;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .benefit strong {
    display: block;
    margin-bottom: 4px;
  }

  .benefit p {
    color: #888;
    font-size: 0.9rem;
    margin: 0;
  }

  .social-proof {
    background: #12121a;
    border-left: 3px solid #00ffff;
    padding: 20px;
    border-radius: 0 10px 10px 0;
  }

  .social-proof p {
    font-style: italic;
    margin-bottom: 8px;
  }

  .social-proof span {
    color: #888;
    font-size: 0.9rem;
  }

  .book-form {
    background: #12121a;
    padding: 30px;
    border-radius: 16px;
    border: 1px solid #1a1a2e;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 12px 16px;
    background: #0a0a0f;
    border: 1px solid #1a1a2e;
    border-radius: 8px;
    color: #fff;
    font-size: 1rem;
    font-family: inherit;
  }

  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #00ffff;
  }

  .form-group select {
    cursor: pointer;
  }

  .submit-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #00ffff, #00cccc);
    border: none;
    border-radius: 8px;
    color: #0a0a0f;
    font-family: 'Orbitron', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s;
  }

  .submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 255, 255, 0.3);
  }

  .form-note {
    text-align: center;
    color: #666;
    font-size: 0.85rem;
    margin-top: 16px;
    margin-bottom: 0;
  }

  .success-container {
    max-width: 500px;
    margin: 100px auto;
    text-align: center;
  }

  .success-icon {
    font-size: 4rem;
    margin-bottom: 20px;
  }

  .success-container h1 {
    font-family: 'Orbitron', sans-serif;
    font-size: 2.5rem;
    margin-bottom: 16px;
  }

  .success-container p {
    color: #888;
    margin-bottom: 8px;
  }

  .success-sub {
    color: #00ffff !important;
    margin-bottom: 30px !important;
  }

  .back-btn {
    display: inline-block;
    padding: 16px 32px;
    background: #12121a;
    border: 1px solid #00ffff;
    color: #00ffff;
    border-radius: 8px;
    font-family: 'Orbitron', sans-serif;
    text-decoration: none;
    transition: all 0.3s;
  }

  .back-btn:hover {
    background: #00ffff;
    color: #0a0a0f;
  }
`;
