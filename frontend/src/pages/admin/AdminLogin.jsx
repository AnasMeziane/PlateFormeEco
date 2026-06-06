import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { LayoutDashboard, LogIn } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Connexion réussie !');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Identifiants incorrects.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Left — Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-dark-card relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-royal-500/20 via-transparent to-gold-400/10" />
        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-[#F5C04A] rounded-full flex items-center justify-center relative">
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-r-[7px] border-t-[9px] border-l-transparent border-r-transparent border-t-[#F5C04A]"></div>
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold text-white leading-tight">CHRI LIYA <span className="text-[#F5C04A]">STORE</span></span>
            <span className="text-[10px] text-white/40 font-medium tracking-wider">ONLINE SHOPPING</span>
          </div>
        </div>
        {/* Center content */}
        <div className="relative z-10">
          <h2 className="text-5xl font-extrabold text-white leading-tight mb-4">
            Gérez votre<br />boutique<br />
            <span className="text-gold-400">avec style.</span>
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            Tableau de bord complet pour gérer vos produits, commandes, et clients CHRI LIYA STORE.
          </p>
        </div>
        {/* Decorative */}
        <span className="absolute -bottom-8 -right-8 text-[14rem] font-black text-white/[0.03] leading-none select-none">T</span>
        <div className="relative z-10 text-white/20 text-xs">© {new Date().getFullYear()} CHRI LIYA STORE</div>
      </div>

      {/* Right — Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-cream">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-[#F5C04A] rounded-full flex items-center justify-center relative">
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#F5C04A]"></div>
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-dark leading-tight">CHRI LIYA <span className="text-[#F5C04A]">STORE</span></span>
              <span className="text-[10px] text-dark/40 font-medium tracking-wider">ONLINE SHOPPING</span>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-dark mb-2">Connexion</h1>
          <p className="text-dark/40 text-sm mb-8 font-medium">Accédez à votre espace administrateur</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-dark/70 mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Tijara.shop00@gmail.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-dark/70 mb-2">Mot de passe</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-royal w-full justify-center py-3.5 mt-2">
              <LogIn className="w-4 h-4" />
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
