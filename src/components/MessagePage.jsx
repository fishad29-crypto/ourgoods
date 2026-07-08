import React, { useState, useEffect, useRef } from 'react';

const MessagePage = ({ onClose, onChatOpen }) => {
  const [activeChatId, setActiveChatId] = useState(null);
  
  const inboxList = [
    { id: 1, name: 'Ourgoods Customer Support', type: 'support', icon: 'la-headset', lastMessage: 'I can help with that!', time: '9:41 AM', unread: 2 },
    { id: 2, name: 'Global Store', type: 'vendor', icon: 'la-store', lastMessage: 'Yes, the item is available in XL.', time: 'Yesterday', unread: 0 },
    { id: 3, name: 'Style Icon', type: 'vendor', icon: 'la-tshirt', lastMessage: 'Thank you for your purchase!', time: '28 Jun', unread: 0 },
    { id: 4, name: 'Tech World', type: 'vendor', icon: 'la-laptop', lastMessage: 'Your warranty has been activated.', time: '25 Jun', unread: 1 }
  ];

  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm your Customer Support Assistant 👋 How can I help you today?", isBot: true },
    { id: 2, text: "I need help tracking my last order.", isBot: false },
    { id: 3, text: "I can help with that! Please provide your Order ID.", isBot: true }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Lock body scroll and remove padding so the chat takes up the exact viewport
    const originalOverflow = document.body.style.overflow;
    const originalPadding = document.body.style.paddingBottom;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingBottom = '0';
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingBottom = originalPadding;
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeChatId) {
      scrollToBottom();
    }
  }, [messages, isTyping, activeChatId]);

  useEffect(() => {
    if (onChatOpen) {
      onChatOpen(activeChatId !== null);
    }
  }, [activeChatId, onChatOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = { id: Date.now(), text: inputValue, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

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

  if (activeChatId === null) {
    // INBOX VIEW
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 65px)', background: '#fff' }}>
        {/* Inbox Header */}
        <div style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eaeaea', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <i className="las la-arrow-left" style={{ fontSize: '20px', cursor: 'pointer', color: '#111' }} onClick={onClose}></i>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#111' }}>Messages</div>
          </div>
          <i className="las la-search" style={{ fontSize: '22px', color: '#111', cursor: 'pointer' }}></i>
        </div>

        {/* Chat List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {inboxList.map((chat) => (
            <div 
              key={chat.id} 
              onClick={() => setActiveChatId(chat.id)}
              style={{ display: 'flex', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid #f5f5f5', cursor: 'pointer', background: chat.unread > 0 ? '#fcfcfc' : '#fff' }}
            >
              {/* Avatar */}
              <div style={{ position: 'relative', marginRight: '15px' }}>
                <div style={{ background: chat.type === 'support' ? 'var(--brand-pink)' : '#f0f0f0', color: chat.type === 'support' ? '#fff' : '#555', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px' }}>
                  <i className={`las ${chat.icon}`}></i>
                </div>
                {chat.type === 'support' && (
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', background: '#00D166', borderRadius: '50%', border: '2px solid #fff' }}></div>
                )}
              </div>

              {/* Text Info */}
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ fontSize: '14px', fontWeight: chat.unread > 0 ? 800 : 700, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {chat.name}
                  </div>
                  <div style={{ fontSize: '10px', color: chat.unread > 0 ? 'var(--brand-pink)' : '#999', flexShrink: 0, marginLeft: '10px', fontWeight: chat.unread > 0 ? 700 : 500 }}>
                    {chat.time}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '12px', color: chat.unread > 0 ? '#111' : '#888', fontWeight: chat.unread > 0 ? 600 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {chat.lastMessage}
                  </div>
                  {chat.unread > 0 && (
                    <div style={{ background: 'var(--brand-pink)', color: '#fff', borderRadius: '10px', minWidth: '18px', height: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px', fontWeight: 900, padding: '0 5px' }}>
                      {chat.unread}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // CHAT VIEW
  const activeChat = inboxList.find(c => c.id === activeChatId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 65px)', background: '#f5f5f5', position: 'relative' }}>
      
      {/* Header */}
      <div style={{ 
        background: '#fff', 
        padding: '15px 20px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #eaeaea',
        flexShrink: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <i className="las la-arrow-left" style={{ fontSize: '20px', cursor: 'pointer', color: '#111' }} onClick={() => setActiveChatId(null)}></i>
          <div style={{ position: 'relative' }}>
            <div style={{ background: 'var(--brand-pink)', color: '#fff', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px' }}>
              <i className={`las ${activeChat?.icon}`}></i>
            </div>
            <div style={{ position: 'absolute', bottom: 2, right: 0, width: '10px', height: '10px', background: '#00D166', borderRadius: '50%', border: '2px solid #fff' }}></div>
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#111' }}>{activeChat?.name}</div>
            <div style={{ fontSize: '11px', color: '#00D166', fontWeight: 600 }}>
              Online
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '15px', color: '#111' }}>
          <i className="las la-phone" style={{ fontSize: '22px', cursor: 'pointer' }}></i>
          <i className="las la-ellipsis-v" style={{ fontSize: '22px', cursor: 'pointer' }}></i>
        </div>
      </div>

      {/* Messages List Area */}
      <div style={{ flex: 1, padding: '20px', paddingBottom: '20px', display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto' }}>
        <div style={{ textAlign: 'center', fontSize: '11px', color: '#999', margin: '10px 0', flexShrink: 0 }}>Today, 9:41 AM</div>
        
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', justifyContent: msg.isBot ? 'flex-start' : 'flex-end' }}>
            {msg.isBot && (
               <div style={{ background: 'var(--brand-pink)', color: '#fff', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '16px', marginRight: '8px', flexShrink: 0, alignSelf: 'flex-end' }}>
                 <i className={`las ${activeChat?.icon}`}></i>
               </div>
            )}
            <div style={{
              maxWidth: '75%',
              padding: '12px 18px',
              borderRadius: '20px',
              borderBottomLeftRadius: msg.isBot ? '4px' : '20px',
              borderBottomRightRadius: !msg.isBot ? '4px' : '20px',
              background: msg.isBot ? '#fff' : '#111',
              color: msg.isBot ? '#333' : '#fff',
              fontSize: '13.5px',
              lineHeight: '1.5',
              boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
              border: msg.isBot ? '1px solid #eaeaea' : 'none'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
             <div style={{ background: 'var(--brand-pink)', color: '#fff', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '16px', marginRight: '8px', flexShrink: 0 }}>
               <i className={`las ${activeChat?.icon}`}></i>
             </div>
             <div style={{ background: '#fff', padding: '12px 18px', borderRadius: '20px', fontSize: '14px', color: '#999', border: '1px solid #eaeaea', borderBottomLeftRadius: '4px', display: 'flex', alignItems: 'center' }}>
               <i className="las la-ellipsis-h la-spin" style={{ fontSize: '20px' }}></i>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area (No longer fixed, sits naturally at bottom) */}
      <div style={{ 
        background: '#fff', 
        padding: '12px 15px', 
        borderTop: '1px solid #eaeaea',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexShrink: 0,
        zIndex: 10
      }}>
        <i className="las la-plus-circle" style={{ fontSize: '28px', color: '#888', cursor: 'pointer' }}></i>
        <i className="las la-camera" style={{ fontSize: '26px', color: '#888', cursor: 'pointer' }}></i>
        
        <form onSubmit={handleSend} style={{ flex: 1, display: 'flex', background: '#f5f5f5', borderRadius: '25px', padding: '5px 5px 5px 15px', alignItems: 'center' }}>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '16px', color: '#111' }}
          />
          <button type="submit" style={{ 
            background: inputValue.trim() ? 'var(--brand-pink)' : '#ccc', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '50%', 
            width: '36px', 
            height: '36px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            cursor: inputValue.trim() ? 'pointer' : 'default',
            transition: 'background 0.3s'
          }}>
            <i className="las la-paper-plane" style={{ fontSize: '18px', marginLeft: '-2px' }}></i>
          </button>
        </form>
      </div>

    </div>
  );
};

export default MessagePage;
