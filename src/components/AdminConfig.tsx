import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';

export function AdminConfig() {
  const [videoCvUrl, setVideoCvUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('/logo.png');
  const [heroTitle, setHeroTitle] = useState('Azad Hossain');
  const [heroSubtitle, setHeroSubtitle] = useState('Video Editor & Motion Designer');
  const [heroDescription, setHeroDescription] = useState('I craft high-retention, aesthetically driven visual experiences. Transforming simple footage into cinematic motion design that demands attention.');

  useEffect(() => {
    return onSnapshot(doc(db, 'config', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.videoCvUrl) setVideoCvUrl(data.videoCvUrl);
        if (data.logoUrl) setLogoUrl(data.logoUrl);
        if (data.heroTitle) setHeroTitle(data.heroTitle);
        if (data.heroSubtitle) setHeroSubtitle(data.heroSubtitle);
        if (data.heroDescription) setHeroDescription(data.heroDescription);
      }
    });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'config', 'main'), { videoCvUrl, logoUrl, heroTitle, heroSubtitle, heroDescription });
      alert('Config updated successfully!');
    } catch (err: any) {
      alert(`Error updating config: ${err.message}`);
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
        
        <button type="submit" className="w-full bg-[#F26B22] text-white font-bold py-2 rounded-lg hover:bg-orange-600 transition-colors">Update Config</button>
      </form>
    </div>
  );
}
