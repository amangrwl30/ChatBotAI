import React, { useState } from 'react';

const ChatUI = () => {
  const [website, setWebsite] = useState('ncert.nic.in');
  const [query, setQuery] = useState('');
  const [restrictDomain, setRestrictDomain] = useState(true);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');
    try {
      const res = await fetch('http://localhost:4000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          website,
          use_site_operator: restrictDomain,
        }),
      });
      console.log('resp svnse', res);
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      setResponse('Error fetching chat response.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Dynamic Website Chatbot</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="website">Website Domain:</label>
          <input
            id="website"
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="e.g. ncert.nic.in"
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="restrict">
            <input
              id="restrict"
              type="checkbox"
              checked={restrictDomain}
              onChange={(e) => setRestrictDomain(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Restrict search to this domain
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="query">Your Question:</label>
          <textarea
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your question here..."
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px', minHeight: '80px' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>
      {response && (
        <div className="response-container" style={{ marginTop: '20px', backgroundColor: '#f9f9f9', padding: '15px' }}>
          <h2>Response</h2>
          {/* Using dangerouslySetInnerHTML because your response includes markdown/html formatting */}
          <div dangerouslySetInnerHTML={{ __html: response }} />
        </div>
      )}
    </div>
  );
};

export default ChatUI;
