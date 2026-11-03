import React, { useState, useRef, useEffect } from 'react';
import { api } from '../api';
import { Sparkles, Send, X, Bot, User, CornerDownRight } from 'lucide-react';

export default function AiAssistantModal({ isOpen, onClose, onNavigate }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! I am LibraMind AI. How can I assist your reading journey today? You can ask where to find books, check your due dates, or explore study seats.",
      time: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg = { sender: 'user', text: text.trim(), time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.askAiAssistant(text.trim());
      const botMsg = {
        sender: 'bot',
        text: res.reply,
        suggestedBooks: res.suggestedBooks,
        suggestedLink: res.suggestedLink,
        time: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: "I could not reach the library catalog server. Please verify network or backend status.",
          time: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    "Where can I find Clean Code?",
    "When is my borrowed book due?",
    "Are study seats available right now?",
    "Suggest beginner books for Python"
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(18, 18, 18, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '580px',
          maxWidth: '100%',
          height: '660px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--editorial-border)',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Stripe */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            background: 'linear-gradient(90deg, var(--editorial-accent) 0% 33.3%, var(--editorial-green) 33.3% 66.6%, var(--editorial-border) 66.6% 100%)',
            zIndex: 10
          }}
        />

        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: 'var(--editorial-text)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2.5px solid var(--editorial-text)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: 'var(--editorial-border)',
                border: '1px solid var(--editorial-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sparkles size={18} color="var(--editorial-text)" strokeWidth={2.4} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#FFFFFF', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                LibraMind AI Assistant
              </h3>
              <span style={{ fontSize: '0.74rem', color: 'var(--editorial-border)', fontWeight: 800, textTransform: 'uppercase' }}>
                TF-IDF & Database Knowledge Agent
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Assistant"
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--editorial-border)',
              color: 'var(--editorial-text)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} strokeWidth={2.4} />
          </button>
        </div>

        {/* Message Log */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            backgroundColor: 'var(--editorial-bg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '10px',
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}
            >
              {m.sender === 'bot' && (
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'var(--editorial-green)',
                    border: '1px solid var(--editorial-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Bot size={16} color="#FFFFFF" strokeWidth={2.4} />
                </div>
              )}

              <div
                style={{
                  backgroundColor: m.sender === 'user' ? 'var(--editorial-accent)' : '#FFFFFF',
                  color: m.sender === 'user' ? '#FFFFFF' : 'var(--editorial-text)',
                  padding: '12px 16px',
                  border: '1px solid var(--editorial-border)',
                  boxShadow: 'var(--shadow-md)',
                  fontSize: '0.92rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-line',
                  fontWeight: 500
                }}
              >
                {m.text}

                {/* Optional suggested link pill */}
                {m.suggestedLink && (
                  <button
                    onClick={() => {
                      onNavigate(m.suggestedLink);
                      onClose();
                    }}
                    style={{
                      marginTop: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 12px',
                      border: '1px solid var(--editorial-border)',
                      backgroundColor: 'var(--editorial-border)',
                      color: 'var(--editorial-text)',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      cursor: 'pointer'
                    }}
                  >
                    Open Page <CornerDownRight size={13} strokeWidth={2.4} />
                  </button>
                )}
              </div>

              {m.sender === 'user' && (
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'var(--editorial-border)',
                    border: '1px solid var(--editorial-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <User size={16} color="var(--editorial-text)" strokeWidth={2.4} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '10px', alignSelf: 'flex-start' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'var(--editorial-green)',
                  border: '1px solid var(--editorial-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Bot size={16} color="#FFFFFF" strokeWidth={2.4} />
              </div>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '10px 16px',
                  border: '1px solid var(--editorial-border)',
                  boxShadow: 'var(--shadow-sm)',
                  fontSize: '0.85rem',
                  color: 'var(--editorial-text)',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}
              >
                Analyzing catalog records...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Sample Prompts */}
        <div
          style={{
            padding: '8px 16px',
            backgroundColor: 'var(--editorial-bg-subtle)',
            borderTop: '1px solid var(--editorial-border)',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}
        >
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--editorial-border)',
                boxShadow: 'var(--shadow-sm)',
                padding: '4px 10px',
                fontSize: '0.76rem',
                color: 'var(--editorial-text)',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{
            padding: '12px 16px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid var(--editorial-border)',
            display: 'flex',
            gap: '10px'
          }}
        >
          <input
            type="text"
            className="form-control"
            placeholder="Ask about books, shelf locations, or your loans..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !input.trim()}
            style={{ padding: '0 20px' }}
          >
            <Send size={16} strokeWidth={2.4} />
          </button>
        </form>
      </div>
    </div>
  );
}
