import React, { useState } from 'react';
import './InputBox.css';

function InputBox({ onSend, isLoading, placeholder, buttonText }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <form className="input-box" onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder || "Type your message..."}
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading || !message.trim()}>
        {isLoading ? 'Sending...' : buttonText || 'Send'}
      </button>
    </form>
  );
}

export default InputBox;
