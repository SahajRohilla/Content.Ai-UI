import React, { useState } from 'react';

function App() {
  const [postType, setPostType] = useState('Personal story');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Professional');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPro, setIsPro] = useState(false); // Mock Pro state

  const handleGenerate = async () => {
    if (!topic) return;

    setLoading(true);
    // Don't clear content immediately for "Try another" feel, or maybe do? 
    // Usually better to show loading overlay or keep old content until new one arrives.
    // For simplicity, let's keep old content but show loader.

    try {
      const response = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_type: postType,
          topic: topic,
          tone: tone,
          is_pro: isPro,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setContent(data.content);
      } else {
        alert(`Error: ${data.detail || 'Failed to generate post'}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}. Is the backend running?`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      alert('Copied to clipboard! Ready to paste on LinkedIn.');
    }
  };

  const shareOnLinkedIn = () => {
    if (content) {
      const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(content)}`;
      window.open(url, '_blank', 'width=600,height=600');
    }
  };

  return (
    <div className="app-container">
      {/* Mock Pro Toggle */}
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 100 }}>
        <label style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--card-bg)', padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
          <input
            type="checkbox"
            checked={isPro}
            onChange={(e) => setIsPro(e.target.checked)}
          />
          <span>Pro Mode {isPro ? '💎' : ''}</span>
        </label>
      </div>

      {/* Input Section */}
      <div className="card input-section">
        <h1>Content.AI</h1>
        <p className="subtitle">Viral LinkedIn Posts in Seconds</p>

        <div className="form-group">
          <label>What do you want to post about?</label>
          <select value={postType} onChange={(e) => setPostType(e.target.value)}>
            <option>Personal story</option>
            <option>Tech explanation</option>
            <option>Hiring post</option>
            <option>Achievement / milestone</option>
            <option>Educational post</option>
          </select>
        </div>

        <div className="form-group">
          <label>Topic / Key Idea</label>
          <textarea
            rows="4"
            placeholder="e.g. How I debugged a production issue at 3 AM..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Tone</label>
          <select value={tone} onChange={(e) => setTone(e.target.value)}>
            <option>Professional</option>
            <option>Casual</option>
            <option>Bold</option>
          </select>
        </div>

        <button
          className="primary-btn"
          onClick={handleGenerate}
          disabled={loading || !topic}
        >
          {loading ? <div className="loader"></div> : '✨ Generate Post'}
        </button>
      </div>

      {/* Output Section */}
      <div className="card output-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label style={{ marginBottom: 0 }}>Your Post</label>
          {content && <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 500 }}>✔ Optimized for LinkedIn feed visibility</span>}
        </div>

        <div className="output-area">
          {content ? content : <div className="placeholder-text">Your generated post will appear here...</div>}
        </div>

        {content && (
          <div className="actions" style={{ flexDirection: 'column', gap: '0.75rem' }}>
            {/* Primary Action */}
            <button className="primary-btn" onClick={copyToClipboard} style={{ background: '#0A66C2' }}>
              🔗 Copy for LinkedIn
            </button>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="action-btn" onClick={handleGenerate} disabled={loading}>
                🔄 Try another version
              </button>
              <button className="action-btn share" onClick={shareOnLinkedIn}>
                🚀 Share
              </button>
            </div>

            {!isPro && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.5rem' }}>
                Free plan includes branding. <span style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => setIsPro(true)}>Upgrade to Remove</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
