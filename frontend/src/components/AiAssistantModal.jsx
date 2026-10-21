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
          text: "I couldn't reach the library catalog server. Please ensure the backend is running.",
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
        backgroundColor: 'rgba(35, 52, 43, 0.45)',
        backdropFilter: 'blur(5px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        className="bio-card"
        style={{
          width: '560px',
          maxWidth: '100%',
          height: '640px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          boxShadow: '0 20px 50px rgba(24, 38, 30, 0.25)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: 'var(--forest)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sparkles size={20} color="#DCE5D5" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#FFFFFF', fontWeight: 700 }}>
                LibraMind AI Assistant
              </h3>
              <span style={{ fontSize: '0.74rem', color: 'var(--soft-sage)' }}>
                Powered by TF-IDF & Library Catalog Knowledge
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Assistant"
            style={{
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Message Log */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            backgroundColor: 'var(--cream)',
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
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--botanical)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Bot size={16} color="#FFFFFF" />
                </div>
              )}

              <div
                style={{
                  backgroundColor: m.sender === 'user' ? 'var(--forest)' : '#FFFFFF',
                  color: m.sender === 'user' ? '#FFFFFF' : 'var(--dark-text)',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  borderTopLeftRadius: m.sender === 'bot' ? '2px' : '14px',
                  borderTopRightRadius: m.sender === 'user' ? '2px' : '14px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  border: m.sender === 'bot' ? '1px solid rgba(52, 78, 65, 0.1)' : 'none',
                  fontSize: '0.92rem',
                  lineHeight: 1.45,
                  whiteSpace: 'pre-line'
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
                      borderRadius: '8px',
                      border: '1px solid var(--botanical)',
                      backgroundColor: 'var(--soft-sage-light)',
                      color: 'var(--forest-dark)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Open Page <CornerDownRight size={14} />
                  </button>
                )}
              </div>

              {m.sender === 'user' && (
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--sage)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <User size={16} color="#FFFFFF" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '10px', alignSelf: 'flex-start' }}>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--botanical)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Bot size={16} color="#FFFFFF" />
              </div>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '10px 16px',
                  borderRadius: '14px',
                  fontSize: '0.85rem',
                  color: 'var(--muted-text)',
                  border: '1px solid rgba(52, 78, 65, 0.1)'
                }}
              >
                Searching library catalog & analyzing records...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Sample Prompts */}
        <div
          style={{
            padding: '8px 16px',
            backgroundColor: '#FAF5EC',
            borderTop: '1px solid rgba(52, 78, 65, 0.08)',
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
                border: '1px solid var(--subtle-border)',
                borderRadius: '12px',
                padding: '4px 10px',
                fontSize: '0.76rem',
                color: 'var(--forest-dark)',
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
            borderTop: '1px solid rgba(52, 78, 65, 0.1)',
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
            style={{ padding: '0 18px' }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
