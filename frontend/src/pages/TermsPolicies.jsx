import React from 'react';
import {
  ShieldCheck,
  BookOpen,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle,
  FileText,
  UserCheck
} from 'lucide-react';

export default function TermsPolicies({ onNavigate }) {
  const policies = [
    {
      icon: BookOpen,
      title: 'Borrowing Limits & Loan Durations',
      rules: [
        'Each registered student member may borrow up to 5 concurrent physical volumes.',
        'Standard loan duration is 14 calendar days from the moment of desk or kiosk issuance.',
        'Due dates and countdown warnings are displayed prominently on the Student Dashboard.',
        'Automated background notifications trigger 2 days prior to loan expiry.'
      ]
    },
    {
      icon: Clock,
      title: 'Renewals & Extensions',
      rules: [
        'Loans may be renewed up to 2 times, each extending the borrowing window by an additional 14 days.',
        'Renewals are immediately granted unless another reader has placed an active reservation on that specific title.',
        'Overdue items cannot be renewed until any outstanding fees are settled at the circulation desk.'
      ]
    },
    {
      icon: AlertCircle,
      title: 'Overdue Fines & Late Return Protocols',
      rules: [
        'A standard fee of $1.00 per day is calculated for every calendar day a book remains overdue.',
        'Fines accrue automatically up to a maximum cap equal to the replacement value of the title.',
        'Borrowing privileges and pod reservations are paused once accrued fines exceed $15.00.'
      ]
    },
    {
      icon: UserCheck,
      title: 'Hold Queue & Reservation Expiry',
      rules: [
        'Readers may place reservations on checked-out books to enter the chronological FIFO waiting queue.',
        'When a book is returned, the next user in line is notified and the status changes to "Ready for Pickup".',
        'Physical volumes remain held at the desk for exactly 48 hours. If unclaimed, the hold automatically expires and advances to the next student.'
      ]
    },
    {
      icon: Calendar,
      title: 'Study Seat & Pod Reservation Etiquette',
      rules: [
        'Study seats can be reserved in 2-hour or 3-hour blocks through the Interactive Seat Map.',
        'To ensure community fairness, an individual may hold a maximum of 1 active seat reservation at a time.',
        'Study pods in the Quiet Study Zone must adhere strictly to zero audible noise guidelines.'
      ]
    },
    {
      icon: ShieldCheck,
      title: 'Privacy & Data Governance',
      rules: [
        'Personal reading history and AI preference vectors are encrypted and never shared with third parties.',
        'Administrative audit logs track borrowing events, returns, and security actions for compliance.',
        'Users can update their research interests anytime to tailor catalog recommendations.'
      ]
    }
  ];

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
            <FileText size={16} />
            Library Governance & Guidelines
          </div>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--forest-dark)', marginBottom: '12px' }}>
            Terms of Service & Borrowing Rules
          </h1>
          <p style={{ color: 'var(--muted-text)', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
            LibraMind operates on principles of academic honor, mutual respect for shared collections, and sustainable library stewardship.
          </p>
        </div>

        {/* Policy Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '48px'
          }}
        >
          {policies.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bio-card"
                style={{
                  padding: '28px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--soft-sage-light)',
                      color: 'var(--forest)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <h2 style={{ fontSize: '1.18rem', color: 'var(--forest-dark)', margin: 0 }}>
                    {p.title}
                  </h2>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {p.rules.map((rule, rIdx) => (
                    <li
                      key={rIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        fontSize: '0.88rem',
                        color: 'var(--dark-text)',
                        lineHeight: 1.5
                      }}
                    >
                      <CheckCircle size={16} color="var(--forest)" style={{ minWidth: '16px', marginTop: '3px' }} />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div
          className="bio-card"
          style={{
            padding: '32px',
            backgroundColor: 'var(--cream)',
            border: '1px solid var(--subtle-border)',
            borderRadius: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-dark)', margin: '0 0 6px' }}>
              Questions Regarding a Loan or Fee?
            </h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--muted-text)' }}>
              Our circulation librarians are available at the front desk to review loan records and assist with waiver petitions.
            </p>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="btn btn-primary btn-sm"
          >
            Contact Circulation Desk
          </button>
        </div>
      </div>
    </div>
  );
}
