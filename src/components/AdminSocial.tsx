import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { 
  MessageCircle, Instagram, Facebook, Linkedin, 
  Mail, MessageSquare, Twitter, Youtube, Video,
  Trash2, Plus, ExternalLink
} from 'lucide-react';

const SOCIAL_OPTIONS = [
  { name: 'WhatsApp', icon: 'MessageCircle' },
  { name: 'Instagram', icon: 'Instagram' },
  { name: 'Facebook', icon: 'Facebook' },
  { name: 'LinkedIn', icon: 'Linkedin' },
  { name: 'Email', icon: 'Mail' },
  { name: 'Discord', icon: 'MessageSquare' },
  { name: 'Twitter / X', icon: 'Twitter' },
  { name: 'YouTube', icon: 'Youtube' },
  { name: 'Vimeo', icon: 'Video' }
];

const iconMap: Record<string, any> = {
  MessageCircle, Instagram, Facebook, Linkedin, 
  Mail, MessageSquare, Twitter, Youtube, Video
};

export function AdminSocial() {
  const [links, setLinks] = useState<any[]>([]);
  const [selectedSocial, setSelectedSocial] = useState(SOCIAL_OPTIONS[0]);
  const [href, setHref] = useState('');
  const [order, setOrder] = useState(0);

  useEffect(() => {
    return onSnapshot(collection(db, 'socialLinks'), (snapshot) => {
      const fetchedLinks = snapshot.docs.map(d => ({id: d.id, ...d.data()}));
      fetchedLinks.sort((a: any, b: any) => a.order - b.order);
      setLinks(fetchedLinks);
    }, (error) => console.error("Error fetching social links:", error));
  }, []);

  const [status, setStatus] = useState<{type: 'success'|'error', msg: string}|null>(null);
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!href.trim()) return;

    setSaving(true);
    setStatus(null);
    try {
      await addDoc(collection(db, 'socialLinks'), { 
        name: selectedSocial.name, 
        iconName: selectedSocial.icon, 
        href, 
        order: Number(order) 
      });
      setHref(''); setOrder(links.length + 1);
      setStatus({ type: 'success', msg: 'Social link added successfully!' });
      setTimeout(() => setStatus(null), 3000);
    } catch(err: any) {
      setStatus({ type: 'error', msg: `Error adding link: ${err.message}` });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(confirm('Are you sure you want to delete this link?')) {
      try {
        await deleteDoc(doc(db, 'socialLinks', id));
      } catch(err: any) {
        setStatus({ type: 'error', msg: err.message });
      }
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl flex flex-col h-full">
      <h2 className="text-xl font-bold mb-6 text-[#F26B22]">Social Links</h2>
      
      <form onSubmit={handleAdd} className="space-y-4 mb-8 bg-black/50 p-5 rounded-xl border border-neutral-800/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-neutral-400 text-xs font-medium uppercase tracking-wider mb-2">Platform</label>
            <div className="relative">
              <select 
                value={selectedSocial.name} 
                onChange={e => {
                  const found = SOCIAL_OPTIONS.find(opt => opt.name === e.target.value);
                  if (found) setSelectedSocial(found);
                }} 
                className="w-full bg-black border border-neutral-800 rounded-lg pl-10 pr-3 py-2.5 text-white focus:border-[#F26B22] focus:ring-1 focus:ring-[#F26B22] focus:outline-none appearance-none transition-all"
              >
                {SOCIAL_OPTIONS.map(opt => (
                  <option key={opt.name} value={opt.name}>{opt.name}</option>
                ))}
              </select>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
                {(() => {
                  const Icon = iconMap[selectedSocial.icon] || Mail;
                  return <Icon className="w-4 h-4" />;
                })()}
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-neutral-400 text-xs font-medium uppercase tracking-wider mb-2">Sort Order</label>
            <input 
              type="number" 
              placeholder="0" 
              value={order} 
              onChange={e=>setOrder(Number(e.target.value))} 
              className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2.5 text-white focus:border-[#F26B22] focus:ring-1 focus:ring-[#F26B22] focus:outline-none transition-all" 
            />
          </div>
        </div>
        
        <div>
          <label className="block text-neutral-400 text-xs font-medium uppercase tracking-wider mb-2">Link / Username / Email</label>
          <input 
            required 
            placeholder="https://... or email address" 
            value={href} 
            onChange={e=>setHref(e.target.value)} 
            className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2.5 text-white focus:border-[#F26B22] focus:ring-1 focus:ring-[#F26B22] focus:outline-none transition-all" 
          />
        </div>
        
        {status && (
          <div className={`text-sm p-3 rounded-lg ${status.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            {status.msg}
          </div>
        )}
        <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 bg-[#F26B22] hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all active:scale-[0.98] shadow-lg shadow-[#F26B22]/20 mt-2">
          <Plus className="w-5 h-5" />
          <span>{saving ? 'Adding...' : 'Add Social Link'}</span>
        </button>
      </form>

      <div className="flex-1">
        <h3 className="text-sm font-medium text-neutral-400 mb-3 px-1">Added Links ({links.length})</h3>
        
        {links.length === 0 ? (
          <div className="text-center p-8 border border-dashed border-neutral-800 rounded-xl bg-black/20 text-neutral-500 flex flex-col items-center justify-center">
            <ExternalLink className="w-8 h-8 mb-3 opacity-20" />
            <p>No social links added yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map(link => {
              const Icon = iconMap[link.iconName] || Mail;
              
              return (
                <div 
                  key={link.id} 
                  className="group flex items-center justify-between bg-black p-3.5 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-all"
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 group-hover:text-[#F26B22] group-hover:border-[#F26B22]/30 transition-colors shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-sm text-white flex items-center gap-2">
                        {link.name}
                        <span className="text-[10px] font-mono bg-neutral-900 text-neutral-500 px-1.5 py-0.5 rounded leading-none">Order: {link.order}</span>
                      </p>
                      <p className="text-xs text-neutral-500 truncate mt-0.5" title={link.href}>
                        {link.href}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleDelete(link.id)} 
                    className="p-2 ml-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                    title="Delete Link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
