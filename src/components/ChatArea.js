import React, { useRef, useEffect } from 'react';
import './ChatArea.css';

function ChatArea({ messages }) {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-area">
      {messages.length === 0 ? (
        <div className="empty-chat">
          <p>Start a conversation with MetaGPT!</p>
        </div>
      ) : (
        messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`message ${msg.sender} ${msg.isError ? 'error' : ''}`}
          >
            <div className="message-content">
              {msg.text}
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatArea;