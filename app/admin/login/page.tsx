"use client";
import { useState } from 'react';
import { Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    const supabase = createClient();
    
    // Attempt sign in
    let { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password: password,
    });

    if (error && error.message.includes("Invalid login")) {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: username,
        password: password,
      });
      
      if (signUpError) {
        toast.error(`Error: ${signUpError.message}`);
        setIsLoggingIn(false);
        return;
      } else {
        toast.success("Cuenta creada. Redirigiendo...");
        setIsLoggingIn(false);
        router.push('/');
        router.refresh();
        return;
      }
    } else if (error) {
      toast.error("Credenciales incorrectas.");
      setIsLoggingIn(false);
      return;
    }

    toast.success("Bienvenido al panel de administración");
    setIsLoggingIn(false);
    router.push('/admin');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center p-6 relative z-[200]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-primary/5"
      >
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
            <Lock size={32} strokeWidth={1.5} />
          </div>
        </div>
        <h1 className="font-serif text-3xl text-center text-foreground mb-2">Acceso Restringido</h1>
        <p className="text-center text-foreground/50 text-xs uppercase tracking-widest font-semibold mb-2">Candelaria Shoes Admin</p>
        <p className="text-center text-primary/70 text-[10px] mb-8 px-4">Ingresa con tus credenciales de administrador. Solo usuarios autorizados.</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/60 mb-2 ml-1">Correo Electrónico</label>
            <input 
              type="email" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl text-sm focus:outline-none focus:border-primary focus:bg-white transition-all shadow-inner placeholder:text-gray-400"
              placeholder="admin@tutienda.com"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/60 mb-2 ml-1">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl text-sm focus:outline-none focus:border-primary focus:bg-white transition-all shadow-inner placeholder:text-gray-400"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoggingIn}
            className="w-full bg-primary hover:bg-[#c2684b] text-white py-5 rounded-2xl uppercase tracking-[0.2em] text-[10px] font-bold transition-all shadow-[0_10px_20px_-10px_rgba(217,119,87,0.8)] hover:shadow-[0_15px_25px_-10px_rgba(217,119,87,0.9)] hover:-translate-y-0.5 mt-4 flex justify-center items-center"
          >
            {isLoggingIn ? <Loader2 size={16} className="animate-spin" /> : "Ingresar al Panel"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
