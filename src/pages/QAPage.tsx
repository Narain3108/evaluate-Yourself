"use client";

import React, { useState, useRef, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { ArrowLeft, Send, FileText, User, Bot } from 'lucide-react';
import { askQuestion } from '../api/upload';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

interface QAPageProps {
  docId: string;
  fileName: string;
  onBack: () => void;
}

// FIX: Added inline styles as a JavaScript object
const styles: { [key: string]: CSSProperties } = {
  qaPage: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#e0e0e0',
  },
  qaHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    backgroundColor: '#222',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    flexShrink: 0,
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginRight: '20px',
    background: 'none',
    border: 'none',
    color: '#ccc',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  qaTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: 600,
    color: '#eee',
  },
  chatContainer: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '20px',
  },
  chatMessages: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  message: {
    display: 'flex',
    gap: '12px',
    maxWidth: '80%',
  },
  messageUser: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  messageAi: {
    alignSelf: 'flex-start',
  },
  avatar: {
    flexShrink: 0,
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarUser: {
    backgroundColor: '#4f46e5',
  },
  avatarAi: {
    backgroundColor: '#333',
  },
  content: {
    padding: '12px 16px',
    borderRadius: '18px',
    lineHeight: 1.6,
    fontSize: '0.95rem',
    whiteSpace: 'pre-wrap',
  },
  contentUser: {
    background: 'linear-gradient(to right, #4f46e5, #6366f1)',
    color: 'white',
    borderTopRightRadius: '4px',
  },
  contentAi: {
    backgroundColor: '#2a2a2e',
    color: '#e0e0e0',
    borderTopLeftRadius: '4px',
  },
  typingIndicator: {
    fontStyle: 'italic',
    color: '#aaa',
  },
  chatInputArea: {
    display: 'flex',
    padding: '16px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    backgroundColor: '#222',
    gap: '12px',
  },
  input: {
    flexGrow: 1,
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #444',
    backgroundColor: '#333',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
  },
  inputDisabled: {
    backgroundColor: '#2a2a2e',
    cursor: 'not-allowed',
  },
  sendButton: {
    flexShrink: 0,
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    backgroundColor: '#6366f1',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
  },
  sendButtonDisabled: {
    backgroundColor: '#444',
    cursor: 'not-allowed',
    opacity: 0.6,
  },
};

export const QAPage: React.FC<QAPageProps> = ({ docId, fileName, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.slice(-6); // Send last 3 Q&A pairs for context
      const result = await askQuestion(docId, input, history);
      const aiMessage: Message = { role: 'ai', content: result.answer };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      let errorMsg = "Sorry, I encountered an error.";
      if (error && typeof error === "object" && "message" in error) {
        errorMsg = `Sorry, I encountered an error: ${(error as { message: string }).message}`;
      }
      const errorMessage: Message = { role: 'ai', content: errorMsg };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // FIX: Replaced all classNames with inline style objects
    <div style={styles.qaPage}>
      <div style={styles.qaHeader}>
        <button style={styles.backButton} onClick={onBack}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={styles.qaTitle}>
          <FileText size={20} />
          <h3>{fileName}</h3>
        </div>
      </div>

      <div style={styles.chatContainer}>
        <div style={styles.chatMessages}>
          {messages.map((msg, index) => (
            <div key={index} style={{ ...styles.message, ...(msg.role === 'user' ? styles.messageUser : styles.messageAi) }}>
              <div style={{ ...styles.avatar, ...(msg.role === 'user' ? styles.avatarUser : styles.avatarAi) }}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div style={{ ...styles.content, ...(msg.role === 'user' ? styles.contentUser : styles.contentAi) }}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{ ...styles.message, ...styles.messageAi }}>
              <div style={{ ...styles.avatar, ...styles.avatarAi }}><Bot size={20} /></div>
              <div style={{ ...styles.content, ...styles.contentAi, ...styles.typingIndicator }}>
                Typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div style={styles.chatInputArea}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
          placeholder="Ask a question about the document..."
          disabled={isLoading}
          style={{ ...styles.input, ...(isLoading ? styles.inputDisabled : {}) }}
        />
        <button onClick={handleSend} disabled={isLoading} style={{ ...styles.sendButton, ...(isLoading ? styles.sendButtonDisabled : {}) }}>
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};