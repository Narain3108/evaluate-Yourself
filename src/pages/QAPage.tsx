"use client";

import React, { useState, useRef, useEffect } from 'react';
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
    <div className="qa-page">
      <div className="qa-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft /> Back
        </button>
        <div className="qa-title">
          <FileText />
          <h3>{fileName}</h3>
        </div>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <div className="avatar">
                {msg.role === 'user' ? <User /> : <Bot />}
              </div>
              <div className="content">{msg.content}</div>
            </div>
          ))}
          {isLoading && (
            <div className="message ai">
              <div className="avatar"><Bot /></div>
              <div className="content typing-indicator">...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
          placeholder="Ask a question about the document..."
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading}>
          <Send />
        </button>
      </div>
    </div>
  );
};