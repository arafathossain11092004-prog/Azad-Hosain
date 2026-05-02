import React, { useState, useEffect } from 'react';
import { auth, db } from '../utils/firebase';
import { onAuthStateChanged, signOut, User, signInWithEmailAndPassword, updatePassword } from 'firebase/auth';
import { collection, deleteDoc, doc, updateDoc, onSnapshot, addDoc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { AdminService } from '../components/AdminService';
import { AdminPackage } from '../components/AdminPackage';
import { AdminSocial } from '../components/AdminSocial';
import { AdminConfig } from '../components/AdminConfig';
import firebaseConfig from '../../firebase-applet-config.json';

const secondaryApp = initializeApp(firebaseConfig, "Secondary");
const secondaryAuth = getAuth(secondaryApp);

const getAdminEmail = (username: string) => `${username.toLowerCase().replace(/[^a-z0-9]/g, '')}@fxstudioazad.com`;

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [admins, setAdmins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Auth states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // New Admin state
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  
  // Password Update State
  const [newPassword, setNewPassword] = useState('');

  // Admin UI State
  const [activeTab, setActiveTab] = useState('dashboard');

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [type, setType] = useState('short-form');
  const [order, setOrder] = useState(0);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (user) {
      const q = collection(db, 'videos');
      const unsubVideos = onSnapshot(q, (snapshot) => {
        const vids = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        vids.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        setVideos(vids);
      }, (error) => console.error("Error fetching videos", error));

      const unsubProfile = onSnapshot(doc(db, 'profile', 'main'), (docSnap) => {
        if (docSnap.exists()) {
          setProfile((prev: any) => ({
            name: 'Azad Hossain',
            bio: "A passionate video editor and motion designer. I combine technical precision with creative storytelling to deliver visuals that don't just look good — they perform.",
            yearsExperience: '4+',
            projectsDelivered: '50+',
            clientSatisfaction: '100%',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300',
            ...prev,
            ...docSnap.data() 
          }));
        } else {
          setProfile({
            name: 'Azad Hossain',
            bio: "A passionate video editor and motion designer. I combine technical precision with creative storytelling to deliver visuals that don't just look good — they perform.",
            yearsExperience: '4+',
            projectsDelivered: '50+',
            clientSatisfaction: '100%',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300'
          });
        }
      }, (error) => console.error("Error fetching profile", error));

      const unsubAdmins = onSnapshot(collection(db, 'admins'), (snapshot) => {
        setAdmins(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (error) => console.error("Error fetching admins", error));

      return () => {
        unsubVideos();
        unsubProfile();
        unsubAdmins();
      };
    }
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginEmail = getAdminEmail(username);
    try {
      await signInWithEmailAndPassword(auth, loginEmail, password);
    } catch (err: any) {
      if (username.toLowerCase() === 'azad' && password === 'Azad@2006') {
        try {
          const res = await createUserWithEmailAndPassword(auth, loginEmail, password);
          await setDoc(doc(db, 'admins', res.user.uid), { username: 'Azad', email: loginEmail });
          return;
        } catch (bootstrapErr: any) {
          console.error('Bootstrap error:', bootstrapErr);
          if (bootstrapErr.code === 'auth/configuration-not-found') {
            alert('Firebase Error: Email/Password Authentication is not enabled in your Firebase Console. Please go to your Firebase project, open Authentication -> Sign-in method, and enable "Email/Password".');
          } else {
            alert('Login failed. ' + bootstrapErr.message);
          }
          return;
        }
      }
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleLogout = () => signOut(auth);

  const [videoStatus, setVideoStatus] = useState<{type: 'success'|'error', msg: string}|null>(null);
  const [videoSaving, setVideoSaving] = useState(false);

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setVideoSaving(true);
    setVideoStatus(null);
    try {
      await addDoc(collection(db, 'videos'), {
        title,
        category,
        videoUrl,
        type,
        order: Number(order),
      });
      setTitle(''); setCategory(''); setVideoUrl(''); setOrder(0);
      setVideoStatus({ type: 'success', msg: 'Video added successfully!' });
      setTimeout(() => setVideoStatus(null), 3000);
    } catch (err: any) {
      setVideoStatus({ type: 'error', msg: 'Error adding video: ' + err.message });
    } finally {
      setVideoSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this video?')) return;
    try {
      await deleteDoc(doc(db, 'videos', id));
    } catch (err: any) {
      alert('Error deleting: ' + err.message);
    }
  };

  const [profileStatus, setProfileStatus] = useState<{type: 'success'|'error', msg: string}|null>(null);
  const [profileSaving, setProfileSaving] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setProfileSaving(true);
    setProfileStatus(null);
    try {
      if (!auth.currentUser) {
        setProfileStatus({ type: 'error', msg: 'Authentication Error: You must be signed in to perform this update.' });
        setProfileSaving(false);
        return;
      }
      
      const docRef = doc(db, 'profile', 'main');
      await setDoc(docRef, profile, { merge: true });
      setProfileStatus({ type: 'success', msg: 'Profile updated successfully!' });
      setTimeout(() => setProfileStatus(null), 3000);
    } catch (err: any) {
      console.error("Error updating document:", err);
      if (err.code === 'permission-denied') {
        setProfileStatus({ type: 'error', msg: `Missing or insufficient permissions. Please check if your email (${auth.currentUser?.email}) has admin privileges.` });
      } else {
        setProfileStatus({ type: 'error', msg: 'Error updating: ' + err.message });
      }
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newEmail = getAdminEmail(newAdminUsername);
      const res = await createUserWithEmailAndPassword(secondaryAuth, newEmail, newAdminPassword);
      await setDoc(doc(db, 'admins', res.user.uid), {
        username: newAdminUsername,
        email: newEmail
      });
      secondaryAuth.signOut();
      setNewAdminUsername('');
      setNewAdminPassword('');
      alert('Admin added successfully!');
    } catch (err: any) {
      alert('Error adding admin: ' + err.message);
    }
  };

  const handleRemoveAdmin = async (id: string) => {
    if (!confirm('Remove this admin?')) return;
    try {
      await deleteDoc(doc(db, 'admins', id));
    } catch (err: any) {
      alert('Error removing admin: ' + err.message);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await updatePassword(user, newPassword);
      setNewPassword('');
      alert('Password updated successfully');
    } catch (err: any) {
      alert('Error updating password: ' + err.message);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-2xl">
          <h1 className="text-3xl font-bold mb-8 text-center">Admin Access</h1>
          
          <form onSubmit={handleLogin} className="space-y-4 mb-8">
            <div>
              <label className="block text-sm text-neutral-400 mb-1">Username</label>
              <input type="text" required value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm text-neutral-400 mb-1">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors" />
            </div>
            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors">
              Sign In
            </button>
          </form>
          
          <p className="mt-6 text-xs text-neutral-500 text-center">
            Note: Ensure "Email/Password" Authentication provider is enabled in your Firebase Console under Build &gt; Authentication &gt; Sign-in method.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4 bg-neutral-900 px-4 py-2 rounded-full border border-neutral-800">
            <span className="text-sm font-medium">{user.email}</span>
            <div className="w-px h-4 bg-neutral-700"></div>
            <button onClick={handleLogout} className="text-red-500 hover:text-red-400 text-sm font-bold">Logout</button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto mb-8 border-b border-neutral-800 pb-2 custom-scrollbar">
          {['Dashboard', 'Videos', 'Services', 'Packages', 'Config', 'Security'].map(tab => {
            const tabId = tab.toLowerCase();
            return (
              <button 
                key={tabId} 
                onClick={() => setActiveTab(tabId)}
                className={`px-4 py-2 font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tabId ? 'border-[#F26B22] text-[#F26B22]' : 'border-transparent text-neutral-400 hover:text-white'}`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-[1fr] gap-8">
          <div className="space-y-8">
            
            {/* Dashboard / Profile Tab */}
            {activeTab === 'dashboard' && profile && (
              <div className="bg-neutral-900 border border-neutral-800 p-6 md:p-8 rounded-2xl shadow-xl max-w-4xl">
                <h2 className="text-xl font-bold mb-6">Edit Public Profile</h2>
                <form onSubmit={handleUpdateProfile} className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-neutral-400 mb-1">Name</label>
                      <input required value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F26B22]" />
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-400 mb-1">Avatar URL</label>
                      <input required type="url" value={profile.avatarUrl} onChange={e => setProfile({...profile, avatarUrl: e.target.value})} className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F26B22]" />
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-400 mb-1">Bio</label>
                      <textarea required value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} rows={4} className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F26B22] resize-none" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-neutral-400 mb-1">Years Experience</label>
                      <input required value={profile.yearsExperience} onChange={e => setProfile({...profile, yearsExperience: e.target.value})} className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F26B22]" />
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-400 mb-1">Projects Delivered</label>
                      <input required value={profile.projectsDelivered} onChange={e => setProfile({...profile, projectsDelivered: e.target.value})} className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F26B22]" />
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-400 mb-1">Client Satisfaction</label>
                      <input required value={profile.clientSatisfaction} onChange={e => setProfile({...profile, clientSatisfaction: e.target.value})} className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F26B22]" />
                    </div>
                    <div className="pt-2">
                      {profileStatus && (
                        <div className={`mb-3 text-sm p-3 rounded-lg ${profileStatus.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                          {profileStatus.msg}
                        </div>
                      )}
                      <button type="submit" disabled={profileSaving} className="w-full bg-[#F26B22] hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors">
                        {profileSaving ? 'Saving...' : 'Save Profile'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Videos Tab */}
            {activeTab === 'videos' && (
              <div className="grid lg:grid-cols-[1fr_400px] gap-8">
                <div className="bg-neutral-900 p-6 md:p-8 rounded-2xl border border-neutral-800 shadow-xl relative overflow-hidden">
                  <h2 className="text-xl font-bold mb-6">Manage Videos</h2>
                  {videos.length === 0 ? (
                    <div className="text-neutral-500 bg-black border border-neutral-800 p-8 rounded-xl text-center">
                      No videos yet. Add one!
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {videos.map(vid => (
                        <div key={vid.id} className="bg-black border border-neutral-800 rounded-xl overflow-hidden group">
                          <div className="aspect-video relative bg-neutral-900 flex items-center justify-center">
                            {vid.type === 'short-form' ? (
                              <svg className="w-12 h-12 text-neutral-600" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"/></svg>
                            ) : (
                              <svg className="w-12 h-12 text-neutral-600" fill="currentColor" viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-3v6H5V7h2v6l5-3 5 3v-6h2v6l-5 3z"/></svg> // just some dummy icon indicating video
                            )}
                            <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-bold uppercase backdrop-blur-sm">
                              {vid.type === 'short-form' ? '9:16' : '16:9'}
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold truncate" title={vid.title}>{vid.title}</h3>
                            <p className="text-sm text-neutral-400 mb-4">{vid.category}</p>
                            <button onClick={() => handleDelete(vid.id)} className="text-sm bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer w-full">Delete Video</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add New Video Form */}
                <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-xl h-fit">
                  <h2 className="text-xl font-bold mb-6 text-red-500">Add New Video</h2>
                  <form onSubmit={handleAddVideo} className="space-y-4">
                    <div>
                      <label className="block text-sm text-neutral-400 mb-1">Title</label>
                      <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F26B22]" />
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-400 mb-1">Category / Info</label>
                      <input required value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F26B22]" />
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-400 mb-1">Video URL (MP4/Vimeo/YouTube)</label>
                      <input required type="url" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F26B22]" />
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-400 mb-1">Format Type</label>
                      <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F26B22]">
                        <option value="short-form">Short-Form (9:16)</option>
                        <option value="long-form">Long-Form (16:9)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-400 mb-1">Sort Order (Lower = First)</label>
                      <input type="number" value={order} onChange={e => setOrder(Number(e.target.value))} className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F26B22]" />
                    </div>
                    {videoStatus && (
                      <div className={`text-sm p-3 rounded-lg mt-2 ${videoStatus.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {videoStatus.msg}
                      </div>
                    )}
                    <button type="submit" disabled={videoSaving} className="w-full bg-[#F26B22] hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl mt-4 transition-colors">
                      {videoSaving ? 'Saving...' : 'Save Video'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div className="max-w-4xl">
                 <AdminService />
              </div>
            )}

            {/* Packages Tab */}
            {activeTab === 'packages' && (
              <div className="max-w-4xl">
                 <AdminPackage />
              </div>
            )}

            {/* Config Tab */}
            {activeTab === 'config' && (
              <div className="grid lg:grid-cols-2 gap-8 max-w-6xl">
                 <AdminConfig />
                 <AdminSocial />
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="max-w-2xl">
                {/* Admin Management Widget */}
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl">
                   <h2 className="text-xl font-bold mb-4">Admins & Security</h2>
                   
                   <div className="mb-6 pb-6 border-b border-neutral-800">
                     <h3 className="text-sm text-neutral-400 mb-3 font-medium uppercase tracking-wider">Add Sub-Admin</h3>
                     <form onSubmit={handleAddAdmin} className="space-y-3">
                       <input required type="text" placeholder="Admin Username" value={newAdminUsername} onChange={e => setNewAdminUsername(e.target.value)} className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#F26B22]" />
                       <input required type="password" placeholder="Password" value={newAdminPassword} onChange={e => setNewAdminPassword(e.target.value)} className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#F26B22]" />
                       <button type="submit" className="w-full bg-white hover:bg-neutral-200 text-black font-bold py-2 rounded-lg transition-colors text-sm">
                         Create Admin
                       </button>
                     </form>
                   </div>

                   <div className="mb-6 pb-6 border-b border-neutral-800">
                     <h3 className="text-sm text-neutral-400 mb-3 font-medium uppercase tracking-wider">Active Admins</h3>
                     <ul className="space-y-2">
                       {admins.length === 0 && <li className="text-xs text-neutral-500">No extra admins found</li>}
                       {admins.map(admin => (
                         <li key={admin.id} className="flex justify-between items-center bg-black p-2 rounded-lg border border-neutral-800">
                           <span className="text-xs truncate max-w-[150px]">{admin.username || admin.email}</span>
                           <button onClick={() => handleRemoveAdmin(admin.id)} className="text-xs text-red-500 hover:text-red-400 font-bold px-2">Revoke</button>
                         </li>
                       ))}
                     </ul>
                   </div>

                   <div>
                     <h3 className="text-sm text-neutral-400 mb-3 font-medium uppercase tracking-wider">Change My Password</h3>
                     <form onSubmit={handleChangePassword} className="space-y-3">
                       <input required minLength={6} type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#F26B22]" />
                       <button type="submit" className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-2 rounded-lg transition-colors text-sm cursor-pointer">
                         Update Password
                       </button>
                     </form>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

