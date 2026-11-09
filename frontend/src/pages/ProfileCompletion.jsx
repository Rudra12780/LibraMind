import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import {
  User,
  Camera,
  CheckCircle2,
  Sparkles,
  BookOpen,
  ArrowRight,
  Heart,
  Layers,
  Compass
} from 'lucide-react';

const WEBSITE_CATEGORIES = [
  { id: 'Emotional Fiction', label: 'Emotional Fiction', desc: 'Heartwarming narratives, drama & human empathy' },
  { id: 'Motivation & Self-Help', label: 'Motivation & Self-Help', desc: 'Mindset mastery, resilience & daily focus' },
  { id: 'Spiritual & Wisdom', label: 'Spiritual & Wisdom', desc: 'Ancient philosophy, inner peace & mindfulness' },
  { id: 'Science & Technology', label: 'Science & Technology', desc: 'AI, computing, physics & future innovation' },
  { id: 'Philosophy & Ethics', label: 'Philosophy & Ethics', desc: 'Moral thinking, logic & classical debates' },
  { id: 'History & Culture', label: 'History & Culture', desc: 'World civilizations, archival lore & memoirs' },
  { id: 'Classics & Literature', label: 'Classics & Literature', desc: 'Timeless masterpieces and literary canon' },
  { id: 'Psychology & Mind', label: 'Psychology & Mind', desc: 'Human behavior, cognition & emotional depth' }
];

export default function ProfileCompletion({ onNavigate }) {
  const { user, reloadProfile } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('Male');
  const [bio, setBio] = useState('');
  const [department, setDepartment] = useState('Literature & Humanities');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([
    'Emotional Fiction',
    'Motivation & Self-Help'
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Pre-fill existing user info if available
  useEffect(() => {
    if (user) {
      if (user.first_name) setFirstName(user.first_name);
      if (user.last_name) setLastName(user.last_name);
      if (user.name && user.name !== 'New Scholar') setFullName(user.name);
      if (user.gender) setGender(user.gender);
      if (user.bio) setBio(user.bio);
      if (user.profile_photo) setProfilePhoto(user.profile_photo);
      if (user.interests) {
        const catList = user.interests.split(',').map(s => s.trim()).filter(Boolean);
        if (catList.length > 0) setSelectedCategories(catList);
      }
    }
  }, [user]);

  // Auto-sync full name from first and last name if user hasn't typed custom
  const handleFirstNameChange = (val) => {
    setFirstName(val);
    setFullName(`${val} ${lastName}`.trim());
  };

  const handleLastNameChange = (val) => {
    setLastName(val);
    setFullName(`${firstName} ${val}`.trim());
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Photo size exceeds 5MB limit. Please choose a smaller file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePhoto(reader.result);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCategory = (catId) => {
    setSelectedCategories(prev => {
      if (prev.includes(catId)) {
        return prev.filter(c => c !== catId);
      } else {
        return [...prev, catId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const computedName = fullName.trim() || `${firstName} ${lastName}`.trim() || user?.name || 'Library Scholar';

      await api.updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        name: computedName,
        gender,
        bio: bio.trim(),
        profile_photo: profilePhoto,
        interests: selectedCategories.join(', ')
      });

      if (reloadProfile) {
        await reloadProfile();
      }

      setSuccess('Profile completed successfully! Welcome to your personalized reading sanctuary.');
      setTimeout(() => {
        onNavigate('dashboard');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        padding: '50px 20px',
        minHeight: '85vh',
        backgroundColor: 'var(--editorial-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        className="bio-card"
        style={{
          width: '740px',
          maxWidth: '100%',
          backgroundColor: '#FFFFFF',
          padding: '40px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--editorial-border)',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative'
        }}
      >
        {/* Top Accent Ribbon */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            borderTopLeftRadius: 'var(--radius-sm)',
            borderTopRightRadius: 'var(--radius-sm)',
            background: 'linear-gradient(90deg, var(--editorial-accent) 0%, var(--editorial-green) 100%)'
          }}
        />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--editorial-bg-subtle)',
              border: '1px solid var(--editorial-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px'
            }}
          >
            <Sparkles size={26} color="var(--editorial-accent)" />
          </div>
          <span className="editorial-kicker" style={{ color: 'var(--editorial-accent)' }}>
            PATRON ONBOARDING • STEP 2 OF 2
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2rem',
              color: 'var(--editorial-text)',
              fontWeight: 700,
              margin: '4px 0 8px'
            }}
          >
            Complete Your Scholar Profile
          </h2>
          <p style={{ fontSize: '0.90rem', color: 'var(--editorial-text-muted)', margin: 0, maxWidth: '520px', marginInline: 'auto' }}>
            Provide your member information and choose your favorite genres so our recommendation engine can curate your reading journey.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#FDECE7',
              color: '#C5221F',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid #FCA5A5',
              fontSize: '0.86rem',
              fontWeight: 600,
              marginBottom: '20px'
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#F0FDF4',
              color: '#15803D',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid #86EFAC',
              fontSize: '0.86rem',
              fontWeight: 600,
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* 1. Profile Photo Upload */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '30px',
              padding: '20px',
              backgroundColor: 'var(--editorial-bg-subtle)',
              borderRadius: 'var(--radius-sm)',
              border: '1px dashed var(--editorial-border)'
            }}
          >
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: '3px solid var(--editorial-accent)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: 'var(--shadow-md)',
                marginBottom: '12px'
              }}
            >
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <User size={48} color="var(--editorial-text-muted)" />
              )}
            </div>

            <label
              className="btn btn-outline btn-sm"
              style={{
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.80rem',
                fontWeight: 600
              }}
            >
              <Camera size={14} />
              {profilePhoto ? 'Change Profile Photo' : 'Upload Profile Photo'}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
            </label>
            <span style={{ fontSize: '0.72rem', color: 'var(--editorial-text-muted)', marginTop: '4px' }}>
              JPG, PNG or WebP up to 5MB
            </span>
          </div>

          {/* 2. Names */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '18px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.80rem', fontWeight: 700 }}>
                First Name *
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Aarav"
                value={firstName}
                onChange={(e) => handleFirstNameChange(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.80rem', fontWeight: 700 }}>
                Last Name *
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Sharma"
                value={lastName}
                onChange={(e) => handleLastNameChange(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label" style={{ fontSize: '0.80rem', fontWeight: 700 }}>
              Full Display Name *
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Aarav Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--editorial-text-muted)', marginTop: '3px', display: 'block' }}>
              This name will be displayed across your library membership card, reservations, and reading pod desks.
            </span>
          </div>

          {/* 3. Gender & Department */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '18px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.80rem', fontWeight: 700 }}>
                Gender *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setGender('Male')}
                  className={`btn btn-sm ${gender === 'Male' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ fontWeight: 600, padding: '8px' }}
                >
                  {gender === 'Male' ? '✓ Male' : 'Male'}
                </button>
                <button
                  type="button"
                  onClick={() => setGender('Female')}
                  className={`btn btn-sm ${gender === 'Female' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ fontWeight: 600, padding: '8px' }}
                >
                  {gender === 'Female' ? '✓ Female' : 'Female'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.80rem', fontWeight: 700 }}>
                Academic Department / Focus
              </label>
              <select
                className="form-control"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="Literature & Humanities">Literature & Humanities</option>
                <option value="Computer Science & AI">Computer Science & AI</option>
                <option value="Philosophy & Ethics">Philosophy & Ethics</option>
                <option value="Historical Studies">Historical Studies</option>
                <option value="Psychology & Cognitive Sciences">Psychology & Cognitive Sciences</option>
                <option value="General Research Scholar">General Research Scholar</option>
              </select>
            </div>
          </div>

          {/* 4. Bio Section */}
          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label" style={{ fontSize: '0.80rem', fontWeight: 700 }}>
              Scholar Bio Section
            </label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Tell us about your reading style, favorite authors, research topics, or what inspires your curiosity..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {/* 5. Selectable Favorite Book Categories */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="form-label" style={{ fontSize: '0.84rem', fontWeight: 700, margin: 0 }}>
                Select Your Favourite Book Categories *
              </label>
              <span style={{ fontSize: '0.74rem', color: 'var(--editorial-accent)', fontWeight: 600 }}>
                {selectedCategories.length} Selected
              </span>
            </div>
            <p style={{ fontSize: '0.80rem', color: 'var(--editorial-text-muted)', marginBottom: '14px' }}>
              Click to select the categories you enjoy most. These choices personalize your recommendations on the landing page and catalog stacks.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '10px'
              }}
            >
              {WEBSITE_CATEGORIES.map(cat => {
                const isSelected = selectedCategories.includes(cat.id);
                return (
                  <div
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      border: isSelected ? '2px solid var(--editorial-green)' : '1px solid var(--editorial-border)',
                      backgroundColor: isSelected ? 'rgba(38, 61, 50, 0.06)' : '#FFFFFF',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.86rem', fontWeight: 700, color: isSelected ? 'var(--editorial-green)' : 'var(--editorial-text)' }}>
                        {cat.label}
                      </span>
                      {isSelected ? (
                        <CheckCircle2 size={16} color="var(--editorial-green)" />
                      ) : (
                        <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1.5px solid var(--editorial-border)' }} />
                      )}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--editorial-text-muted)', lineHeight: 1.3 }}>
                      {cat.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '0.96rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {saving ? 'Saving Profile...' : 'Save & Enter LibraMind Sanctuary →'}
          </button>
        </form>
      </div>
    </div>
  );
}

