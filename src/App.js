import React, { useState, useEffect } from 'react';
import './App.css';
import ChatArea from './components/ChatArea';
import InputBox from './components/InputBox';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiKeyEntered, setApiKeyEntered] = useState(false);
  const [useMockApi, setUseMockApi] = useState(true); // Toggle for development

  // Check if API key exists in localStorage on load
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setApiKeyEntered(true);
    }
  }, []);

  const handleSubmitApiKey = (key) => {
    setApiKey(key);
    setApiKeyEntered(true);
    // Save API key in localStorage for convenience
    localStorage.setItem('openai_api_key', key);
  };

  // Mock responses for development
  const getMockResponse = (message) => {
    const responses = [
      `I've analyzed your request: "${message}" and here's my response.`,
      `Based on my understanding, "${message}" refers to a common pattern in software development.`,
      `Regarding "${message}", I recommend considering these factors...`,
      `Your question about "${message}" is interesting. Here's what I think.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    
    try {
      let response;
      
      if (useMockApi) {
        // Use mock API for development
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        response = {
          data: {
            choices: [
              { 
                message: {
                  content: getMockResponse(message)
                }
              }
            ]
          }
        };
      } else {
        // Use real MetaGPT API with OpenAI key
        response = await axios.post('http://localhost:8000/api/chat', {
          messages: [
            {
              role: "user",
              content: message
            }
          ],
          api_key: apiKey,
          model: "gpt-3.5-turbo" // or another model
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      
      // Add AI response to chat
      const aiMessage = {
        id: Date.now() + 1,
        text: response.data.choices?.[0]?.message?.content || 
              response.data.response ||
              response.data.message ||
              "No response from API",
        sender: 'ai'
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I couldn\'t connect. Please try again.',
        sender: 'system',
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const toggleMockApi = () => {
    setUseMockApi(!useMockApi);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>MetaGPT Chat</h1>
        {apiKeyEntered && (
          <div className="header-controls">
            <button onClick={clearChat} className="clear-btn">Clear Chat</button>
            <button onClick={toggleMockApi} className="api-toggle">
              {useMockApi ? 'Using Mock API' : 'Using Real API'}
            </button>
          </div>
        )}
      </header>
      
      <main className="App-main">
        {!apiKeyEntered ? (
          <div className="api-key-container">
            <h2>Enter your OpenAI API Key</h2>
            <p>Your key will be stored locally and used to access MetaGPT services.</p>
            <InputBox 
              onSend={handleSubmitApiKey} 
              placeholder="Paste your API key here"
              buttonText="Submit"
            />
            <div className="api-key-info">
              <p>Don't have an API key? Get one from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">OpenAI</a></p>
            </div>
          </div>
        ) : (
          <>
            <ChatArea messages={messages} />
            <InputBox 
              onSend={handleSendMessage} 
              isLoading={loading}
              placeholder="Type your message..."
              buttonText="Send"
            />
          </>
        )}
      </main>
      
      <footer className="App-footer">
        <p>MetaGPT Frontend Demo | {useMockApi ? 'Development Mode' : 'Production Mode'}</p>
      </footer>
    </div>
  );
}

export default App;