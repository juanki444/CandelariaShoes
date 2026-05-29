"use client";
import Link from 'next/link';
import { ShoppingBag, Menu, X, User, Search, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { toggleCart, getTotalItems } = useCartStore();
  const { getWishlistCount } = useWishlistStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const textColor = isScrolled ? 'text-foreground' : 'text-white';
  const logoColor = isScrolled ? 'text-primary' : 'text-white';
  const hoverColor = isScrolled ? 'hover:text-primary' : 'hover:text-white/80';
  const subtextColor = isScrolled ? 'text-foreground/60' : 'text-white/80';

  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-500 border-b ${isScrolled ? 'bg-white/95 backdrop-blur-md border-primary/10 py-4 shadow-sm' : 'bg-gradient-to-b from-black/60 to-transparent border-transparent py-6'}`}>
        <div className="container mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <div className="flex-1 md:hidden flex justify-start">
            <button className={`transition-colors ${textColor} ${hoverColor}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
               {mobileMenuOpen ? <X size={26} strokeWidth={1.5} /> : <Menu size={26} strokeWidth={1.5} />}
            </button>
          </div>

          {/* Desktop Menu - Left */}
          <div className="hidden md:flex items-center gap-10 flex-1">
             <NavLink href="/" isScrolled={isScrolled}>Inicio</NavLink>
             <NavLink href="/shop" isScrolled={isScrolled}>Tienda</NavLink>
             <NavLink href="#footer" isScrolled={isScrolled}>Nosotros</NavLink>
          </div>

          {/* Logo - Center */}
          <Link href="/" className="hidden md:flex flex-col items-center justify-center md:flex-none">
             <div className="relative w-36 h-14 sm:w-48 sm:h-20 md:w-64 md:h-24 flex items-center justify-center overflow-hidden transition-all duration-500">
               <img 
                 src="/assets/logo-prueba.jpg" 
                 alt="Candelaria Shoes" 
                 className="object-contain w-full h-full transition-all duration-500"
                 style={{ 
                   filter: isScrolled ? 'brightness(0)' : 'none'
                 }}
               />
             </div>
          </Link>

          {/* Icons - Right */}
          <div className="flex items-center gap-6 flex-1 justify-end">
             <button onClick={() => setSearchOpen(true)} className={`transition-colors hidden sm:block ${textColor} ${hoverColor}`}>
                <Search size={22} strokeWidth={1.5} />
             </button>
             <Link href="/admin" className={`transition-colors hidden sm:block ${textColor} ${hoverColor}`}>
                <User size={22} strokeWidth={1.5} />
             </Link>
             <Link href="/wishlist" className={`relative transition-colors flex items-center gap-2 group hidden sm:flex ${textColor} ${hoverColor}`} aria-label="Lista de deseos">
                <Heart size={22} strokeWidth={1.5} />
                {mounted && getWishlistCount() > 0 && (
                  <span className={`absolute -top-1 -right-1 ${isScrolled ? 'bg-primary text-white' : 'bg-white text-black'} text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center`}>
                    {getWishlistCount()}
                  </span>
                )}
             </Link>
             <button onClick={toggleCart} className={`relative transition-colors flex items-center gap-2 group ${textColor} ${hoverColor}`}>
                <ShoppingBag size={24} strokeWidth={1.5} />
                <span className="hidden sm:block text-xs font-medium uppercase tracking-widest mt-0.5">
                  Cart {mounted && getTotalItems() > 0 && `(${getTotalItems()})`}
                </span>
                {/* Mobile cart badge */}
                {mounted && getTotalItems() > 0 && (
                  <span className={`sm:hidden absolute -top-1 -right-1 ${isScrolled ? 'bg-primary text-white' : 'bg-white text-black'} text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center`}>
                    {getTotalItems()}
                  </span>
                )}
             </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-primary/10 shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-[calc(100svh-70px)] opacity-100 overflow-y-auto' : 'max-h-0 opacity-0'}`}>
          <div className="p-6 pb-[max(2rem,env(safe-area-inset-bottom))] flex flex-col gap-6">
             <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-serif text-foreground hover:text-primary transition-colors">Inicio</Link>
             <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-serif text-foreground hover:text-primary transition-colors">Tienda</Link>
             <Link href="#footer" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-serif text-foreground hover:text-primary transition-colors">Nosotros</Link>
             <div className="h-px w-full bg-primary/10 my-4"></div>
             <button onClick={() => { setMobileMenuOpen(false); setSearchOpen(true); }} className="text-lg font-medium text-foreground/70 hover:text-primary flex items-center gap-3 text-left">
               <Search size={20} /> Buscar
             </button>
             <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-foreground/70 hover:text-primary flex items-center gap-3">
               <User size={20} /> Mi Cuenta
             </Link>
             <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-foreground/70 hover:text-primary flex items-center gap-3">
               <Heart size={20} /> Favoritos {mounted && getWishlistCount() > 0 && `(${getWishlistCount()})`}
             </Link>
          </div>
        </div>
      </nav>

      {/* Full screen elegant search overlay */}
      <div className={`fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl transition-all duration-500 flex flex-col items-center justify-center pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] ${searchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <button onClick={() => setSearchOpen(false)} className="absolute top-[max(1.5rem,env(safe-area-inset-top))] right-6 md:right-10 text-foreground/40 hover:text-primary transition-colors">
          <X size={32} strokeWidth={1} />
        </button>
        <div className="w-full max-w-4xl px-6">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input 
              type="text" 
              autoFocus={searchOpen}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Encuentra tu estilo ideal..."
              className="w-full text-4xl md:text-6xl lg:text-7xl font-serif bg-transparent border-b border-primary/20 pb-6 focus:outline-none focus:border-primary transition-colors text-foreground placeholder:text-foreground/20 text-center"
            />
          </form>
          <div className="mt-12 flex flex-col items-center gap-6">
            <span className="text-xs font-semibold text-foreground/40 uppercase tracking-[0.3em]">Búsquedas Populares</span>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/shop?q=brisa" onClick={() => setSearchOpen(false)} className="text-sm font-medium uppercase tracking-widest text-foreground hover:text-primary border border-primary/10 px-6 py-2 rounded-full hover:border-primary transition-all">Brisa</Link>
              <Link href="/shop?q=negro" onClick={() => setSearchOpen(false)} className="text-sm font-medium uppercase tracking-widest text-foreground hover:text-primary border border-primary/10 px-6 py-2 rounded-full hover:border-primary transition-all">Negro</Link>
              <Link href="/shop?q=dorado" onClick={() => setSearchOpen(false)} className="text-sm font-medium uppercase tracking-widest text-foreground hover:text-primary border border-primary/10 px-6 py-2 rounded-full hover:border-primary transition-all">Dorado</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function NavLink({ href, children, isScrolled }: { href: string, children: React.ReactNode, isScrolled: boolean }) {
  return (
    <Link href={href} className={`group relative text-xs uppercase tracking-[0.2em] font-semibold transition-colors py-2 ${isScrolled ? 'text-foreground/80 hover:text-primary' : 'text-white/90 hover:text-white'}`}>
      {children}
      <span className={`absolute bottom-0 left-0 w-full h-[1px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${isScrolled ? 'bg-primary' : 'bg-white'}`}></span>
    </Link>
  );
}
