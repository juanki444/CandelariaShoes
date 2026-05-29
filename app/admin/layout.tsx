"use client";
import { useState, useEffect } from 'react';
import { LayoutDashboard, Package, LogOut, Loader2, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  // If we are on the login page, do not render the sidebar.
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Pedidos', href: '/admin/orders', icon: Package },
    { name: 'Productos', href: '/admin/products', icon: Package },
  ];

  const handleLogout = async () => {
    try {
      const { createClient } = await import('@/utils/supabase/client');
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.info("Has cerrado sesión exitosamente", {
        description: "Esperamos verte pronto.",
      });
      router.push('/admin/login');
      router.refresh(); // Force a full re-evaluation of the middleware
    } catch (error) {
      toast.error("Hubo un error al cerrar sesión.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex relative z-[200]">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full bg-white border-b border-primary/10 px-6 py-4 flex items-center justify-between z-20">
         <div className="w-36 h-12 relative">
           <img src="/assets/logo-prueba.jpg" alt="Candelaria Shoes" className="object-contain object-left w-full h-full" style={{ filter: 'brightness(0)' }} />
         </div>
         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-foreground/60 hover:text-primary transition-colors">
           {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
         </button>
      </div>

      {/* Overlay for mobile sidebar */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-72 bg-white border-r border-primary/10 flex flex-col fixed h-full z-30 shadow-[5px_0_40px_rgba(0,0,0,0.03)] transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-10 flex items-center justify-center hidden lg:flex">
          <div className="w-56 h-20 relative mt-2">
            <img src="/assets/logo-prueba.jpg" alt="Candelaria Shoes" className="object-contain object-center w-full h-full" style={{ filter: 'brightness(0)' }} />
          </div>
        </div>
        <div className="lg:hidden flex justify-between items-center p-6 border-b border-gray-100">
           <div className="w-48 h-14 relative">
             <img src="/assets/logo-prueba.jpg" alt="Candelaria Shoes" className="object-contain object-left w-full h-full" style={{ filter: 'brightness(0)' }} />
           </div>
           <button onClick={() => setMobileMenuOpen(false)}><X size={24} className="text-foreground/40" /></button>
        </div>
        
        <div className="flex-1 px-6 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/30 ml-4 mb-6 block">Gestión</span>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
            return (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-medium text-sm ${isActive ? 'bg-primary text-white shadow-md' : 'text-foreground/60 hover:bg-gray-50 hover:text-foreground'}`}
              >
                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                {link.name}
              </Link>
            )
          })}
        </div>

        <div className="p-6 border-t border-primary/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-5 py-4 w-full rounded-2xl transition-all font-medium text-sm text-red-500/80 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} strokeWidth={1.5} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 pt-24 lg:pt-10 p-6 lg:p-16 overflow-x-hidden w-full">
        {children}
      </main>
    </div>
  );
}
