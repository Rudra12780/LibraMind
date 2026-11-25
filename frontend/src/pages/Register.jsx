import React from 'react';
import Login from './Login';

export default function Register({ onNavigate }) {
  return <Login onNavigate={onNavigate} initialMode="register" />;
}
