import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../utils/firebase';

export function AdminService() {
  const [services, setServices] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [svgCode, setSvgCode] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState(0);

  useEffect(() => {
    return onSnapshot(collection(db, 'services'), (snapshot) => {
      const fetched = snapshot.docs.map(d => ({id: d.id, ...d.data()}));
      fetched.sort((a: any, b: any) => a.order - b.order);
      setServices(fetched);
    }, (error) => console.error("Error fetching admin services:", error));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'services'), { title, svgCode, description, order: Number(order) });
      setTitle(''); setSvgCode(''); setDescription(''); setOrder(order + 1);
      alert('Service added successfully!');
    } catch (err: any) {
      alert(`Error adding service: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if(confirm('Delete this service?')) {
      try {
        await deleteDoc(doc(db, 'services', id));
      } catch(err: any) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl">
      <h2 className="text-xl font-bold mb-4">Manage Services</h2>
      <form onSubmit={handleAdd} className="space-y-4 mb-6">
        <input required placeholder="Service Title" value={title} onChange={e=>setTitle(e.target.value)} className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white focus:border-[#F26B22] focus:outline-none" />
        <textarea required placeholder="SVG Code (<svg>...</svg>)" value={svgCode} onChange={e=>setSvgCode(e.target.value)} className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white focus:border-[#F26B22] focus:outline-none resize-none font-mono text-xs" rows={4} />
        <textarea required placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white focus:border-[#F26B22] focus:outline-none resize-none" rows={3} />
        <input type="number" placeholder="Sort Order" value={order} onChange={e=>setOrder(Number(e.target.value))} className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white focus:border-[#F26B22] focus:outline-none" />
        <button type="submit" className="w-full bg-[#F26B22] text-white font-bold py-2 rounded-lg hover:bg-orange-600 transition-colors">Add Service</button>
      </form>
      <div className="space-y-2">
        {services.map(svc => (
          <div key={svc.id} className="flex justify-between items-start bg-black p-3 rounded-lg border border-neutral-800">
            <div className="flex gap-3 items-center">
              <div 
                className="w-8 h-8 text-[#F26B22] shrink-0 [&>svg]:w-full [&>svg]:h-full" 
                dangerouslySetInnerHTML={{ __html: svc.svgCode || '<svg></svg>' }} 
              />
              <div>
                <p className="font-bold text-sm tracking-tight">{svc.title}</p>
                <p className="text-xs text-neutral-400 line-clamp-2">{svc.description}</p>
              </div>
            </div>
            <button onClick={() => handleDelete(svc.id)} className="text-red-500 text-sm font-bold shrink-0 ml-2">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
