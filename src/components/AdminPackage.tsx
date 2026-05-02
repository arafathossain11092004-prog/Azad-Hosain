import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { Plus, X } from 'lucide-react';

const PACKAGE_NAMES = [
  "Social Media Starter",
  "Content Creator Pro",
  "Commercial / Brand"
];

export function AdminPackage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [name, setName] = useState(PACKAGE_NAMES[0]);
  const [price, setPrice] = useState('');
  const [interval, setInterval] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>(['']);
  const [popular, setPopular] = useState(false);
  const [order, setOrder] = useState(0);

  useEffect(() => {
    return onSnapshot(collection(db, 'packages'), (snapshot) => {
      const fetched = snapshot.docs.map(d => ({id: d.id, ...d.data()}));
      fetched.sort((a: any, b: any) => a.order - b.order);
      setPackages(fetched);
    }, (error) => console.error("Error fetching admin packages:", error));
  }, []);

  const handleAddFeature = () => {
    setFeatures([...features, '']);
  };

  const handleFeatureChange = (index: number, val: string) => {
    const newFeatures = [...features];
    newFeatures[index] = val;
    setFeatures(newFeatures);
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalFeatures = features.filter(f => f.trim() !== '');
    if (finalFeatures.length === 0) {
      alert('Please add at least one feature');
      return;
    }
    try {
      await addDoc(collection(db, 'packages'), { name, price, interval, description, features: finalFeatures, popular, order: Number(order) });
      setName(PACKAGE_NAMES[0]); setPrice(''); setInterval(''); setDescription(''); setFeatures(['']); setPopular(false); setOrder(order + 1);
      alert('Package added successfully!');
    } catch(err: any) {
      alert(`Error adding package: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if(confirm('Delete this package?')) {
      try {
        await deleteDoc(doc(db, 'packages', id));
      } catch(err: any) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl">
      <h2 className="text-xl font-bold mb-4">Manage Pricing Packages</h2>
      <form onSubmit={handleAdd} className="space-y-4 mb-6">
        <div>
          <label className="block text-neutral-400 text-sm mb-1">Package Name</label>
          <select 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white focus:border-[#F26B22] focus:outline-none"
          >
            {PACKAGE_NAMES.map(pkgName => (
              <option key={pkgName} value={pkgName}>{pkgName}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-neutral-400 text-sm mb-1">Price (e.g. $500)</label>
            <input required placeholder="Custom or $500" value={price} onChange={e=>setPrice(e.target.value)} className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white focus:border-[#F26B22] focus:outline-none" />
          </div>
          <div className="flex-1">
            <label className="block text-neutral-400 text-sm mb-1">Interval (e.g. /month)</label>
            <input placeholder="/month or empty" value={interval} onChange={e=>setInterval(e.target.value)} className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white focus:border-[#F26B22] focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-neutral-400 text-sm mb-1">Description</label>
          <textarea required placeholder="Short description" value={description} onChange={e=>setDescription(e.target.value)} className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white focus:border-[#F26B22] focus:outline-none resize-none" rows={2} />
        </div>

        <div>
          <label className="block text-neutral-400 text-sm mb-2">Features</label>
          <div className="space-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input 
                  value={feature} 
                  onChange={(e) => handleFeatureChange(index, e.target.value)} 
                  placeholder={`Feature ${index + 1}`} 
                  className="flex-1 bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white focus:border-[#F26B22] focus:outline-none text-sm" 
                  required
                />
                <button type="button" onClick={() => handleRemoveFeature(index)} className="p-2 border border-neutral-800 rounded-lg text-neutral-500 hover:text-red-500 hover:border-red-500/50 bg-black transition-colors shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddFeature} className="flex items-center gap-2 text-sm text-[#F26B22] hover:text-orange-400 font-medium py-1">
              <Plus className="w-4 h-4" /> Add Feature
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-neutral-800">
          <input type="checkbox" checked={popular} onChange={e=>setPopular(e.target.checked)} id="pop" className="w-4 h-4 accent-[#F26B22]" />
          <label htmlFor="pop" className="text-sm font-medium">Highlight this package (Most Popular)</label>
        </div>

        <div>
          <label className="block text-neutral-400 text-sm mb-1">Sort Order</label>
          <input type="number" placeholder="Sort Order" value={order} onChange={e=>setOrder(Number(e.target.value))} className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white focus:border-[#F26B22] focus:outline-none" />
        </div>

        <button type="submit" className="w-full bg-[#F26B22] hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors">Add Package</button>
      </form>
      <div className="space-y-2">
        {packages.map(pkg => (
          <div key={pkg.id} className="flex justify-between items-start bg-black p-3 rounded-lg border border-neutral-800">
            <div>
              <p className="font-bold">{pkg.name} {pkg.popular && <span className="text-[#F26B22] text-xs font-bold tracking-wider ml-2">POPULAR</span>}</p>
              <p className="text-sm font-light text-neutral-400">{pkg.price} {pkg.interval}</p>
              <p className="text-xs text-neutral-500 mt-1">{pkg.features?.length || 0} features</p>
            </div>
            <button onClick={() => handleDelete(pkg.id)} className="text-red-500 text-sm font-bold shrink-0 ml-2 bg-red-500/10 hover:bg-red-500 hover:text-white px-2 py-1 rounded transition-colors">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
