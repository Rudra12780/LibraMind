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
      a: 'Yes! Study seats across Quiet Focus, Collaborative Studio, and Archive Pods can be booked for specific time blocks through our Interactive Study Seat Map.'
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
    <div style={{ backgroundColor: 'var(--editorial-bg)', minHeight: '85vh', padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 40px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              backgroundColor: 'var(--editorial-border)',
              color: 'var(--editorial-text)',
              border: '1px solid var(--editorial-border)',
              boxShadow: 'var(--shadow-sm)',
              fontSize: '0.78rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '14px'
            }}
          >
            <HelpCircle size={15} strokeWidth={2.4} />
            Circulation Help & Patron Inquiries
          </div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', marginBottom: '12px' }}>
            We Are Here to Assist Your Research
          </h1>
          <p style={{ color: 'var(--editorial-text)', opacity: 0.85, fontSize: '1rem', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
            Have a question about book loans, hold queues, study pod bookings, or library policies? Contact our staff or explore the answers below.
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
          <div style={{ padding: '24px', backgroundColor: '#FFFFFF', border: '1px solid var(--editorial-border)', boxShadow: 'var(--shadow-card)', borderTop: '6px solid var(--editorial-accent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '42px', height: '42px', backgroundColor: 'var(--editorial-border)', border: '1px solid var(--editorial-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--editorial-text)' }}>
                <Phone size={20} strokeWidth={2.4} />
              </div>
              <div>
                <strong style={{ color: 'var(--editorial-text)', fontSize: '1rem', display: 'block', fontWeight: 900, textTransform: 'uppercase' }}>Front Desk Hotline</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--editorial-text)', opacity: 0.8, fontWeight: 600 }}>Direct desk phone line</span>
              </div>
            </div>
            <p style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--editorial-text)', margin: '0 0 4px', letterSpacing: '0.02em' }}>
              +1 (800) 555-LIBRA
            </p>
            <span style={{ fontSize: '0.78rem', color: 'var(--editorial-text)', opacity: 0.75, fontWeight: 600 }}>Active during all open hours</span>
          </div>

          <div style={{ padding: '24px', backgroundColor: '#FFFFFF', border: '1px solid var(--editorial-border)', boxShadow: 'var(--shadow-card)', borderTop: '6px solid var(--editorial-green)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '42px', height: '42px', backgroundColor: 'var(--editorial-border)', border: '1px solid var(--editorial-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--editorial-text)' }}>
                <Mail size={20} strokeWidth={2.4} />
              </div>
              <div>
                <strong style={{ color: 'var(--editorial-text)', fontSize: '1rem', display: 'block', fontWeight: 900, textTransform: 'uppercase' }}>Circulation Email</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--editorial-text)', opacity: 0.8, fontWeight: 600 }}>Response within 12h</span>
              </div>
            </div>
            <p style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--editorial-text)', margin: '0 0 4px', letterSpacing: '0.02em' }}>
              support@libramind.edu
            </p>
            <span style={{ fontSize: '0.78rem', color: 'var(--editorial-text)', opacity: 0.75, fontWeight: 600 }}>For research & hold inquiries</span>
          </div>

          <div style={{ padding: '24px', backgroundColor: '#FFFFFF', border: '1px solid var(--editorial-border)', boxShadow: 'var(--shadow-card)', borderTop: '6px solid var(--editorial-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '42px', height: '42px', backgroundColor: 'var(--editorial-border)', border: '1px solid var(--editorial-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--editorial-text)' }}>
                <Clock size={20} strokeWidth={2.4} />
              </div>
              <div>
                <strong style={{ color: 'var(--editorial-text)', fontSize: '1rem', display: 'block', fontWeight: 900, textTransform: 'uppercase' }}>Desk Hours</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--editorial-text)', opacity: 0.8, fontWeight: 600 }}>Physical staff presence</span>
              </div>
            </div>
            <p style={{ fontSize: '0.92rem', fontWeight: 900, color: 'var(--editorial-text)', margin: '0 0 4px', textTransform: 'uppercase' }}>
              Mon – Fri: 08:00 – 22:00
            </p>
            <span style={{ fontSize: '0.78rem', color: 'var(--editorial-text)', opacity: 0.75, fontWeight: 600 }}>Sat – Sun: 09:00 – 20:00</span>
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
            <h2 style={{ fontSize: '1.6rem', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: 'var(--editorial-text)', opacity: 0.85, fontSize: '0.9rem', marginBottom: '20px', fontWeight: 500 }}>
              Quick answers about borrowing, renewals, fines, and study spaces.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--editorial-border)',
                    boxShadow: activeFaq === idx ? '4px 4px 0px var(--editorial-text)' : '2px 2px 0px var(--editorial-text)',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      background: activeFaq === idx ? 'var(--editorial-border)' : '#FFFFFF',
                      border: 'none',
                      textAlign: 'left',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      gap: '12px'
                    }}
                  >
                    <span style={{ fontWeight: 800, color: 'var(--editorial-text)', fontSize: '0.95rem', textTransform: 'uppercase' }}>
                      {faq.q}
                    </span>
                    {activeFaq === idx ? (
                      <ChevronUp size={18} strokeWidth={2.4} color="var(--editorial-text)" />
                    ) : (
                      <ChevronDown size={18} strokeWidth={2.4} color="var(--editorial-text)" />
                    )}
                  </button>

                  {activeFaq === idx && (
                    <div
                      style={{
                        padding: '14px 20px 18px',
                        fontSize: '0.88rem',
                        color: 'var(--editorial-text)',
                        lineHeight: 1.6,
                        borderTop: '1px solid var(--editorial-border)',
                        backgroundColor: '#FFFFFF',
                        fontWeight: 500
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
            style={{
              padding: '32px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--editorial-border)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <h2 style={{ fontSize: '1.5rem', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase', marginBottom: '6px' }}>
              Send an Inquiry
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--editorial-text)', opacity: 0.85, marginBottom: '20px', fontWeight: 500 }}>
              Submit a question or report an issue. Our library staff will reply directly to your email.
            </p>

            {submitted ? (
              <div
                style={{
                  padding: '24px',
                  backgroundColor: 'var(--editorial-border)',
                  border: '1px solid var(--editorial-border)',
                  boxShadow: 'var(--shadow-card)',
                  textAlign: 'center'
                }}
              >
                <CheckCircle size={32} color="var(--editorial-text)" strokeWidth={2.4} style={{ margin: '0 auto 10px' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 6px' }}>
                  Inquiry Dispatched!
                </h4>
                <p style={{ fontSize: '0.88rem', margin: 0, fontWeight: 600 }}>
                  Thank you. A librarian will review your request and reply shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem' }}>Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-control"
                    placeholder="e.g. Aarav Sharma"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem' }}>Registered Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-control"
                    placeholder="e.g. aarav@libramind.edu"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem' }}>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-control"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Book Loan & Renewals">Book Loan & Renewals</option>
                    <option value="Study Pod Booking">Study Pod Booking</option>
                    <option value="Account & Membership">Account & Membership</option>
                    <option value="Catalog & Acquisitions">Catalog & Acquisitions</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem' }}>Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="form-control"
                    placeholder="Brief summary of inquiry..."
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem' }}>Message Details</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-control"
                    placeholder="Please specify any book IDs, due dates, or pod numbers..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
                >
                  Dispatch Inquiry →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
