import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, auth } from '../utils/firebase';

export function AdminConfig() {
  const [videoCvUrl, setVideoCvUrl] = useState('');
  const [heroTitle, setHeroTitle] = useState('Azad Hossain');
  const [heroSubtitle, setHeroSubtitle] = useState('Video Editor & Motion Designer');
  const [heroDescription, setHeroDescription] = useState('I craft high-retention, aesthetically driven visual experiences. Transforming simple footage into cinematic motion design that demands attention.');
  const [youtubeLink, setYoutubeLink] = useState('https://youtube.com');

  useEffect(() => {
    return onSnapshot(doc(db, 'config', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.videoCvUrl) setVideoCvUrl(data.videoCvUrl);
        if (data.heroTitle) setHeroTitle(data.heroTitle);
        if (data.heroSubtitle) setHeroSubtitle(data.heroSubtitle);
        if (data.heroDescription) setHeroDescription(data.heroDescription);
        if (data.youtubeLink) setYoutubeLink(data.youtubeLink);
      }
    }, (error) => console.error("Error fetching admin config:", error));
  }, []);

  const [status, setStatus] = useState<{type: 'success'|'error', msg: string}|null>(null);
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      // Best Practice: Verify user is authenticated before attempting an update
      if (!auth.currentUser) {
        setStatus({ type: 'error', msg: "Authentication Error: You must be logged in to update the configuration." });
        setSaving(false);
        return;
      }

      await setDoc(doc(db, 'config', 'main'), { videoCvUrl, heroTitle, heroSubtitle, heroDescription, youtubeLink }, { merge: true });
      setStatus({ type: 'success', msg: 'Config updated successfully!' });
      setTimeout(() => setStatus(null), 3000);
    } catch (err: any) {
      console.error("Firestore Update Error:", err);
      if (err.code === 'permission-denied') {
        setStatus({ type: 'error', msg: `Error: Missing or insufficient permissions. Verify that your account (${auth.currentUser?.email}) has admin access in Firestore rules.` });
      } else {
        setStatus({ type: 'error', msg: `Error updating config: ${err.message}` });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-[#F26B22]">Site Configuration</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-neutral-400 text-sm mb-2">Video CV URL</label>
          <input 
            required 
            placeholder="e.g. https://storage.googleapis.com/.../video.mp4" 
            value={videoCvUrl} 
            onChange={e=>setVideoCvUrl(e.target.value)} 
            className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white focus:border-[#F26B22]" 
          />
        </div>

        <div>
          <label className="block text-neutral-400 text-sm mb-2">Hero Name / Title</label>
          <input 
            required 
            value={heroTitle} 
            onChange={e=>setHeroTitle(e.target.value)} 
            className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white focus:border-[#F26B22]" 
          />
        </div>

        <div>
          <label className="block text-neutral-400 text-sm mb-2">Hero Subtitle</label>
          <input 
            required 
            value={heroSubtitle} 
            onChange={e=>setHeroSubtitle(e.target.value)} 
            className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white focus:border-[#F26B22]" 
          />
        </div>

        <div>
          <label className="block text-neutral-400 text-sm mb-2">Hero Description</label>
          <textarea 
            required 
            rows={3}
            value={heroDescription} 
            onChange={e=>setHeroDescription(e.target.value)} 
            className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white focus:border-[#F26B22] resize-none" 
          />
        </div>

        <div>
          <label className="block text-neutral-400 text-sm mb-2">YouTube Channel URL (For 'View All Projects')</label>
          <input 
            required 
            type="url"
            value={youtubeLink} 
            onChange={e=>setYoutubeLink(e.target.value)} 
            className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white focus:border-[#F26B22]" 
          />
        </div>
        
        {status && (
          <div className={`text-sm p-3 rounded-lg ${status.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            {status.msg}
          </div>
        )}
        <button type="submit" disabled={saving} className="w-full bg-[#F26B22] hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-2 rounded-lg transition-colors">
          {saving ? 'Updating...' : 'Update Config'}
        </button>
      </form>
    </div>
  );
}
