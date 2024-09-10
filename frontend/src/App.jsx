import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: "Hey there! 👋 Ready to tackle some coding challenges? What have you been working on? Maybe I can offer some insights! 😄",
    },
  ]);
  const [loading, setLoading] = useState(false); // Loading state

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user input to messages
    setMessages([...messages, { role: 'user', text: input }]);
    setInput(''); // Clear input immediately

    try {
      setLoading(true); // Set loading to true
      // Send user input to backend API
      const response = await axios.post('http://localhost:5000/api/chat', { input });
      
      // Add AI response to messages
      setMessages((prevMessages) => [...prevMessages, { role: 'model', text: response.data }]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="App" style={{ padding: '20px', maxWidth: '600px', margin: 'auto', backgroundColor: '#f0f0f0' }}>
      <h1 style={{ textAlign: 'center' }}>Rider's AI Chatbot</h1>
      <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px', height: '400px', overflowY: 'auto', marginBottom: '20px', backgroundColor: '#ffffff' }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.role === 'user' ? 'right' : 'left',
              marginBottom: '10px', // Add space between messages
            }}
          >
            <strong>{msg.role === 'user' ? 'You' : 'Rider\'s AI'}:</strong> {msg.text}
          </div>
        ))}
        {loading && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <div style={{ border: '4px solid #f3f3f3', borderRadius: '50%', borderTop: '4px solid #007bff', width: '30px', height: '30px', animation: 'spin 1s linear infinite' }}></div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          style={{ flex: 1, padding: '10px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '10px', borderRadius: '4px', backgroundColor: '#007bff', color: '#fff', border: 'none' }} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
