import React, { useState } from 'react';
import {
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  BookOpen,
  MessageSquare,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function HelpContact({ onNavigate }) {
  const [activeFaq, setActiveFaq] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'General Inquiry',
    subject: '',
    message: ''
  });

  const faqs = [
    {
      q: 'How many books can I borrow simultaneously?',
      a: 'Registered student members can borrow up to 5 physical books at a time for an initial loan period of 14 days.'
    },
    {
      q: 'How do renewals work and when can a loan be renewed?',
      a: 'Books can be renewed up to 2 times (each renewal extends the due date by 14 days) from your student dashboard, provided no other reader has placed a waiting queue hold on that title.'
    },
    {
      q: 'What is the overdue fine policy?',
      a: 'LibraMind applies a standard daily overdue fee of $1.00 per day per book past the due date. Fines can be viewed on your dashboard or settled at the circulation desk.'
    },
    {
      q: 'How does the reservation waiting queue work?',
      a: 'When all copies of a book are checked out, you can join the hold queue. As soon as a borrowed copy is returned, the system automatically assigns it to the next student in line and holds it at the desk for 48 hours.'
    },
    {
      q: 'Can I reserve study seats in advance?',
      a: 'Yes! Study seats across Quiet Study, Collaborative Hub, and Garden Window Pods can be booked for specific 2-hour and 3-hour focus blocks through our Interactive Study Seat Map.'
    },
    {
      q: 'How does the AI Assistant locate books in the building?',
      a: 'LibraMind AI retrieves genuine database coordinates indexing Floor, Section, Shelf Code, and Rack number. Simply ask "Where can I find Clean Code?" to get the exact location.'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        category: 'General Inquiry',
        subject: '',
        message: ''
      });
    }, 4000);
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 40px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '20px',
              backgroundColor: 'var(--soft-sage-light)',
              color: 'var(--forest)',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '14px'
            }}
          >
            <HelpCircle size={16} />
            Circulation Help & Academic Inquiries
          </div>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--forest-dark)', marginBottom: '12px' }}>
            We're Here to Assist Your Research
          </h1>
          <p style={{ color: 'var(--muted-text)', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
            Have a question about book loans, hold queues, study pod bookings, or library policies? Contact our library desk or explore frequent answers below.
          </p>
        </div>

        {/* Contact Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
            marginBottom: '48px'
          }}
        >
          <div className="bio-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--soft-sage-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--forest)' }}>
                <Phone size={20} />
              </div>
              <div>
                <strong style={{ color: 'var(--forest-dark)', fontSize: '1rem', display: 'block' }}>Front Desk Hotline</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--muted-text)' }}>Immediate desk assistance</span>
              </div>
            </div>
            <p style={{ fontSize: '0.94rem', fontWeight: 600, color: 'var(--forest-dark)', margin: '0 0 4px' }}>
              +1 (800) 555-LIBRA (5427)
            </p>
            <span style={{ fontSize: '0.8rem', color: 'var(--sage)' }}>Available during all library open hours</span>
          </div>

          <div className="bio-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--soft-sage-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--forest)' }}>
                <Mail size={20} />
              </div>
              <div>
                <strong style={{ color: 'var(--forest-dark)', fontSize: '1rem', display: 'block' }}>Circulation Email</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--muted-text)' }}>Responses within 12 hours</span>
              </div>
            </div>
            <p style={{ fontSize: '0.94rem', fontWeight: 600, color: 'var(--forest-dark)', margin: '0 0 4px' }}>
              support@libramind.edu
            </p>
            <span style={{ fontSize: '0.8rem', color: 'var(--sage)' }}>For research, hold extensions & inquiries</span>
          </div>

          <div className="bio-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--soft-sage-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--forest)' }}>
                <Clock size={20} />
              </div>
              <div>
                <strong style={{ color: 'var(--forest-dark)', fontSize: '1rem', display: 'block' }}>Desk Service Hours</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--muted-text)' }}>Physical staff presence</span>
              </div>
            </div>
            <p style={{ fontSize: '0.94rem', fontWeight: 600, color: 'var(--forest-dark)', margin: '0 0 4px' }}>
              Mon – Fri: 8:00 AM – 10:00 PM
            </p>
            <span style={{ fontSize: '0.8rem', color: 'var(--sage)' }}>Sat – Sun: 9:00 AM – 8:00 PM</span>
          </div>
        </div>

        {/* 2-Column Section: FAQs and Direct Form */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '36px',
            alignItems: 'start'
          }}
        >
          {/* FAQ Accordion */}
          <div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--forest-dark)', marginBottom: '8px' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: 'var(--muted-text)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Quick answers about borrowing, renewals, fines, and study spaces.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bio-card"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid var(--subtle-border)'
                  }}
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      gap: '12px'
                    }}
                  >
                    <span style={{ fontWeight: 600, color: 'var(--forest-dark)', fontSize: '0.95rem' }}>
                      {faq.q}
                    </span>
                    {activeFaq === idx ? (
                      <ChevronUp size={18} color="var(--forest)" />
                    ) : (
                      <ChevronDown size={18} color="var(--muted-text)" />
                    )}
                  </button>

                  {activeFaq === idx && (
                    <div
                      style={{
                        padding: '0 20px 18px',
                        fontSize: '0.88rem',
                        color: 'var(--muted-text)',
                        lineHeight: 1.6,
                        borderTop: '1px solid rgba(52, 78, 65, 0.06)',
                        paddingTop: '12px'
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Inquiry Form */}
          <div
            className="bio-card"
            style={{
              padding: '32px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px'
            }}
          >
            <h2 style={{ fontSize: '1.4rem', color: 'var(--forest-dark)', marginBottom: '6px' }}>
              Send an Inquiry to the Librarians
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', marginBottom: '20px' }}>
              Submit a question or report an issue. Our library staff will reply directly to your registered email.
            </p>

            {submitted ? (
              <div
                style={{
                  padding: '24px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--soft-sage-light)',
                  textAlign: 'center'
                }}
              >
                <CheckCircle size={36} color="var(--forest)" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--forest-dark)', marginBottom: '6px' }}>
                  Inquiry Dispatched Successfully!
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--dark-text)', margin: 0 }}>
                  A confirmation has been sent to our circulation desk. Our team will review your message shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Your Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Maya Patel"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Email Address *</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="e.g. maya@libramind.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Inquiry Category</label>
                  <select
                    className="form-control"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Book Loan & Renewals">Book Loan & Renewals</option>
                    <option value="Hold Queue & Reservations">Hold Queue & Reservations</option>
                    <option value="Study Pod & Seat Booking">Study Pod & Seat Booking</option>
                    <option value="Lost or Damaged Book Report">Lost or Damaged Book Report</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Subject *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Brief summary of your question"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Detailed Message *</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Describe your question, ISBN of interest, or requested assistance..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Send size={16} />
                  Submit Inquiry to Staff
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
