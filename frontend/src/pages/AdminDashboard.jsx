import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Users,
  FileText,
  Database,
  Check,
  AlertCircle,
  Download,
  Key
} from 'lucide-react';

export default function AdminDashboard({ onNavigate }) {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const [auditLogs, setAuditLogs] = useState([]);
  const [triggeringCron, setTriggeringCron] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const [userData, logsData] = await Promise.all([
        api.getAllUsers(),
        api.getAuditLogs().catch(() => [])
      ]);
      setUsers(userData || []);
      setAuditLogs(logsData || []);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const showToast = (msg, isError = false) => {
    setToastMessage({ msg, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await api.updateUserRole(userId, newRole);
      showToast(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleRunScheduler = async () => {
    setTriggeringCron(true);
    try {
      const res = await api.triggerScheduler();
      showToast(res.message || 'Scheduler cycle completed!');
      fetchUsers();
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setTriggeringCron(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      {/* Toast */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            backgroundColor: toastMessage.isError ? '#C5221F' : 'var(--forest)',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem'
          }}
        >
          {toastMessage.isError ? <AlertCircle size={18} /> : <Check size={18} />}
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--botanical)', fontSize: '0.84rem', fontWeight: 700, textTransform: 'uppercase' }}>
          <Shield size={16} /> Security & System Governance
        </div>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--forest-dark)', marginTop: '4px', marginBottom: '8px' }}>
          Admin Control Center
        </h1>
        <p style={{ color: 'var(--muted-text)', fontSize: '1rem', margin: 0 }}>
          Manage user permissions, review system audit trail, and export archival reports.
        </p>
      </div>

      {/* System Integrity Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '36px'
        }}
      >
        <div className="bio-card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Database size={20} color="var(--forest)" />
            <strong style={{ fontSize: '1rem', color: 'var(--forest-dark)' }}>Database Engine</strong>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--muted-text)', margin: 0 }}>
            SQLite with WAL journal mode. Enforces ACID transactions for all loans, returns, and hold cancellations.
          </p>
        </div>

        <div className="bio-card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Key size={20} color="var(--botanical)" />
            <strong style={{ fontSize: '1rem', color: 'var(--forest-dark)' }}>Role-Based Access Control</strong>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--muted-text)', margin: 0 }}>
            JWT authentication with role validation on all protected endpoints (`student`, `librarian`, `admin`).
          </p>
        </div>

        <div className="bio-card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Download size={20} color="var(--sage)" />
            <strong style={{ fontSize: '1rem', color: 'var(--forest-dark)' }}>Data Export</strong>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--muted-text)', marginBottom: '10px' }}>
            Download complete library catalog with shelf coordinates in CSV format.
          </p>
          <a
            href={api.exportBooksCsvUrl()}
            className="btn btn-outline btn-sm"
            download
          >
            Download Catalog CSV
          </a>
        </div>
      </div>

      {/* User Management Table */}
      <div className="bio-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={20} color="var(--forest)" />
          Registered Users & Access Roles ({users.length})
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--cream)', borderBottom: '1px solid var(--subtle-border)' }}>
                <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--forest-dark)' }}>User Name</th>
                <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--forest-dark)' }}>Email Address</th>
                <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--forest-dark)' }}>Membership ID</th>
                <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--forest-dark)' }}>Active Loans</th>
                <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--forest-dark)' }}>Current Role</th>
                <th style={{ padding: '12px 14px', textAlign: 'right', color: 'var(--forest-dark)' }}>Modify Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(52, 78, 65, 0.08)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--forest-dark)' }}>
                    {u.name}
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--muted-text)' }}>
                    {u.email}
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>
                    {u.membership_id}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    {u.active_loans} books
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span
                      className={`badge ${
                        u.role === 'admin'
                          ? 'badge-danger'
                          : u.role === 'librarian'
                          ? 'badge-available'
                          : 'badge-category'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    {u.email !== user?.email && (
                      <select
                        value={u.role}
                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          border: '1px solid var(--subtle-border)',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="student">Student</option>
                        <option value="librarian">Librarian</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Logs & Security Integrity Trail */}
      <div className="bio-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', marginTop: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={20} color="var(--forest)" />
              System Audit Trail & Security Logs ({auditLogs.length})
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--muted-text)' }}>
              Immutable record of borrowing, returns, holds, seat bookings, and role changes.
            </span>
          </div>

          <button
            onClick={handleRunScheduler}
            disabled={triggeringCron}
            className="btn btn-primary btn-sm"
          >
            {triggeringCron ? 'Running Due-Date & Expiry Cycle...' : 'Run Due-Date & Expiry Scheduler Now'}
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--cream)', borderBottom: '1px solid var(--subtle-border)' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--forest-dark)' }}>Timestamp</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--forest-dark)' }}>Action</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--forest-dark)' }}>Initiator</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--forest-dark)' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: 'var(--muted-text)' }}>
                    No administrative audit logs recorded yet.
                  </td>
                </tr>
              ) : (
                auditLogs.slice(0, 30).map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid rgba(52, 78, 65, 0.06)' }}>
                    <td style={{ padding: '10px 12px', color: 'var(--muted-text)', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--forest-dark)' }}>
                      {log.action}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      {log.user_name ? `${log.user_name} (${log.user_role})` : 'System / Guest'}
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--dark-text)' }}>
                      {log.details || 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
