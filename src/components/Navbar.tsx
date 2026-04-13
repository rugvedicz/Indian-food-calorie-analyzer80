import { motion } from 'motion/react';
import { Apple, LayoutDashboard, MessageSquare, Scan, LogOut, User } from 'lucide-react';
import { auth } from '../firebase';
import { signOut, User as FirebaseUser } from 'firebase/auth';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: FirebaseUser | null;
  onLoginClick: () => void;
}

export default function Navbar({ activeTab, setActiveTab, user, onLoginClick }: NavbarProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Apple },
    { id: 'analyzer', label: 'Analyzer', icon: Scan },
    { id: 'chatbot', label: 'Nutritionist', icon: MessageSquare },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-light-gray/50 shadow-sm">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex justify-between h-20 items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setActiveTab('home')}
          >
            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Apple className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold font-display tracking-tight text-navy">
              AI Food <span className="text-primary">Calorie Analyzer</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-1 py-1 text-sm font-bold transition-all hover:text-primary ${
                  activeTab === item.id ? 'text-primary' : 'text-medium-gray'
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-light-gray/20 rounded-xl border border-light-gray/50">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-navy truncate max-w-[100px]">
                    {user.displayName || user.email}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-3 text-medium-gray hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="btn-gradient px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
