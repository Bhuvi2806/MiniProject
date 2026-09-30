import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../../services/api';
import './Chatbot.css';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm the BloodLink AI Assistant. I can help you check eligibility or find a donation center.", sender: "bot" }
  ]);
  const [input, setInput] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { text: input, sender: "user" };
    // We must pass the conversation history to the API in the format: { role: 'user'|'assistant', content: '...' }
    const apiMessages = messages.map(m => ({
      role: m.sender === 'bot' ? 'assistant' : 'user',
      content: m.text
    }));
    apiMessages.push({ role: 'user', content: input });

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(apiMessages);
      setMessages(prev => [...prev, { 
        text: response.message.content, 
        sender: "bot" 
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble connecting to my AI right now.", 
        sender: "bot" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`chatbot-wrapper ${isOpen ? 'is-open' : ''}`}>
      {!isOpen && (
        <button 
          className="chatbot-fab" 
          onClick={() => setIsOpen(true)}
          aria-label="Open Chatbot"
        >
          💬
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window card">
          <div className="chatbot-header">
            <span className="label-lg">🩸 BloodLink Assistant</span>
            <button 
              className="chatbot-close" 
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>
          <div className="chatbot-body">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message chat-message--${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="chat-message chat-message--bot">
                <span className="pulse-dot" style={{ display: 'inline-block' }}></span> Typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSend} className="chatbot-footer">
            <input 
              type="text" 
              className="input chatbot-input" 
              placeholder="Ask me anything..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" className="btn btn-primary btn-sm chatbot-send" disabled={isLoading}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
