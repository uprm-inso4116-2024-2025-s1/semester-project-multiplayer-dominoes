// src/ChatPopup.js
import React, { useState } from 'react';

// Define styles using JSS to match the provided CSS
const styles = {
  chatPopup: {
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    bottom: '80px',
    right: '20px',
    width: '300px',
    borderRadius: '15px',
    backgroundColor: 'rgb(161, 167, 252)',
    boxShadow: '0 4px 8px rgb(0, 0, 0)',
    padding: '10px',
    zIndex: 1000,
    fontFamily: "'Press Start 2P', sans-serif",
  },
  chatMessages: {
    maxHeight: '150px',
    overflowY: 'auto',
    marginBottom: '10px',
  },
  chatMessage: {
    padding: '5px',
    margin: '5px 0',
    backgroundColor: '#FFFEC9',
    borderRadius: '5px',
    color: '#282c34',
  },
  
  input: {
    width: '93%',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: '#FFFEC9',
    border: '1px solid #ccc',
    fontFamily: "'Press Start 2P', sans-serif",
    fontSize: '16px',
  },
  sendButton: {
    width: '25%',
    padding: '5px 10px',
    backgroundColor: 'rgb(244, 213, 75)',
    color: 'black',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    fontFamily: "'Press Start 2P', sans-serif",
    marginLeft: 'auto', 
  },
};

const ChatPopup = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput('');
    }
  };

  return (
    <div style={styles.chatPopup}>
      <div style={styles.chatMessages}>
        {messages.map((msg, index) => (
          <div key={index} style={styles.chatMessage}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        style={styles.input}
      />
      <button onClick={handleSend} style={styles.sendButton}>Send</button>
    </div>
  );
};

export default ChatPopup;
