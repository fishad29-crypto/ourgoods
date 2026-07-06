import React, { useState, useEffect, useRef } from 'react';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm your Customer Support Assistant 👋 How can I help you today?", isBot: true }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), text: inputValue, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let botResponse = "I'm still learning! But I can help you find products, track orders, or connect you with a human agent.";
      
      const lowerInput = userMsg.text.toLowerCase();
      if (lowerInput.includes('order') || lowerInput.includes('track')) {
        botResponse = "To track an order, please provide your Order ID (e.g. #OG-12345) and I'll look it up for you!";
      } else if (lowerInput.includes('pre-order') || lowerInput.includes('preorder') || lowerInput.includes('international')) {
        botResponse = "Pre-orders from our International Market usually take 21-28 days. Express delivery is available!";
      } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        botResponse = "Hello there! Let me know what you're looking for.";
      } else if (lowerInput.includes('price') || lowerInput.includes('discount') || lowerInput.includes('sale')) {
        botResponse = "We have flash sales going on! Check the homepage for up to 50% off select items.";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, isBot: true }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="hide-on-desktop">
      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '80px', // Above bottom nav
          right: '20px',
          width: '300px',
          height: '400px',
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 9999,
          overflow: 'hidden',
          border: '1px solid #eaeaea'
        }}>
          {/* Header */}
          <div style={{ background: 'var(--brand-pink)', padding: '15px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ background: '#fff', color: 'var(--brand-pink)', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '18px' }}>
                <i className="las la-headset"></i>
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '0.5px' }}>Customer Support</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)' }}>Typically replies instantly</div>
              </div>
            </div>
            <i className="las la-times" style={{ fontSize: '20px', cursor: 'pointer' }} onClick={() => setIsOpen(false)}></i>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, padding: '15px', overflowY: 'auto', background: '#fcfcfc', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: 'flex', justifyContent: msg.isBot ? 'flex-start' : 'flex-end' }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  borderBottomLeftRadius: msg.isBot ? '4px' : '12px',
                  borderBottomRightRadius: !msg.isBot ? '4px' : '12px',
                  background: msg.isBot ? '#fff' : '#111',
                  color: msg.isBot ? '#333' : '#fff',
                  fontSize: '12px',
                  lineHeight: '1.4',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                  border: msg.isBot ? '1px solid #eaeaea' : 'none'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: '#fff', padding: '10px 14px', borderRadius: '12px', fontSize: '12px', color: '#999', border: '1px solid #eaeaea', borderBottomLeftRadius: '4px' }}>
                  <i className="las la-ellipsis-h" style={{ fontSize: '16px' }}></i>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={{ padding: '10px', borderTop: '1px solid #eaeaea', background: '#fff', display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              style={{ flex: 1, padding: '10px 12px', border: '1px solid #eaeaea', borderRadius: '20px', outline: 'none', fontSize: '12px', background: '#f5f5f5' }}
            />
            <button type="submit" style={{ background: 'var(--brand-pink)', color: '#fff', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', opacity: inputValue.trim() ? 1 : 0.5 }}>
              <i className="las la-paper-plane" style={{ fontSize: '16px' }}></i>
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '80px', // Sits above bottom nav
          right: '20px',
          width: '56px',
          height: '56px',
          background: 'var(--brand-pink)',
          color: '#fff',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 4px 15px rgba(228, 27, 35, 0.4)',
          cursor: 'pointer',
          zIndex: 9999,
          transition: 'transform 0.2s',
          transform: isOpen ? 'scale(0)' : 'scale(1)'
        }}
      >
        <i className="las la-headset" style={{ fontSize: '28px' }}></i>
      </div>
    </div>
  );
};

export default AIChatbot;
