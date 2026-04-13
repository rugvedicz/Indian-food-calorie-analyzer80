import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, googleProvider } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { Mail, Lock, User, ArrowRight, LogIn, UserPlus, Github, Chrome, AlertCircle, Loader2 } from 'lucide-react';

interface AuthPageProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AuthPage({ onSuccess, onCancel }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(userCredential.user, { displayName: name });
        }
      }
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-primary-light/10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-navy/10 border border-light-gray/30 overflow-hidden"
      >
        <div className="p-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-display text-navy mb-3">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-medium-gray font-medium">
              {isLogin ? 'Sign in to track your nutrition journey' : 'Join us to start your healthy lifestyle'}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-5">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-medium-gray" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-light-gray/20 border border-transparent rounded-2xl outline-none focus:border-primary/30 focus:bg-white transition-all font-medium text-navy"
                  required
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-medium-gray" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-light-gray/20 border border-transparent rounded-2xl outline-none focus:border-primary/30 focus:bg-white transition-all font-medium text-navy"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-medium-gray" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-light-gray/20 border border-transparent rounded-2xl outline-none focus:border-primary/30 focus:bg-white transition-all font-medium text-navy"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gradient py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Register'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-light-gray/50"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] font-black text-medium-gray">
              <span className="bg-white px-4">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-4 bg-white border border-light-gray/50 rounded-2xl font-bold text-navy flex items-center justify-center gap-3 hover:bg-light-gray/20 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            <Chrome className="w-5 h-5 text-primary" />
            Google Account
          </button>

          <div className="mt-10 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-bold text-medium-gray hover:text-primary transition-colors"
            >
              {isLogin ? (
                <>Don't have an account? <span className="text-primary">Register now</span></>
              ) : (
                <>Already have an account? <span className="text-primary">Sign in</span></>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onCancel}
              className="text-xs font-black text-medium-gray uppercase tracking-widest hover:text-navy transition-colors"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
