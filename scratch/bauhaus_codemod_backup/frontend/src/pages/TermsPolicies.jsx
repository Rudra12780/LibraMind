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
            <FileText size={15} strokeWidth={2.4} />
            Library Governance & Policies
          </div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', marginBottom: '12px' }}>
            Terms of Service & Rules
          </h1>
          <p style={{ color: 'var(--editorial-text)', opacity: 0.85, fontSize: '1rem', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
            LibraMind operates on principles of academic honor, mutual respect for shared collections, and rational library stewardship.
          </p>
        </div>

        {/* Policy Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}
        >
          {policies.map((pol, idx) => {
            const Icon = pol.icon;
            const borderColors = ['var(--editorial-accent)', 'var(--editorial-green)', 'var(--editorial-border)'];
            return (
              <div
                key={idx}
                style={{
                  padding: '28px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--editorial-border)',
                  boxShadow: 'var(--shadow-card)',
                  borderTop: `6px solid ${borderColors[idx % 3]}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      backgroundColor: 'var(--editorial-border)',
                      border: '1px solid var(--editorial-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--editorial-text)'
                    }}
                  >
                    <Icon size={22} strokeWidth={2.4} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>
                    {pol.title}
                  </h3>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {pol.rules.map((rule, rIdx) => (
                    <li
                      key={rIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                        fontSize: '0.88rem',
                        color: 'var(--editorial-text)',
                        lineHeight: 1.55,
                        fontWeight: 500
                      }}
                    >
                      <span style={{ color: 'var(--editorial-accent)', fontWeight: 900, flexShrink: 0, marginTop: '2px' }}>■</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
