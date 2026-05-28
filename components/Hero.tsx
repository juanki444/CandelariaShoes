import Link from 'next/link';

export default function Hero() {
  return (
    <div 
      className="relative w-full h-[100dvh] flex flex-col items-center justify-end overflow-hidden pb-12 sm:pb-16 md:pb-24 lg:bg-fixed bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/fondo-final.jpg')" }}
    >
      {/* Soft, sophisticated gradient: darker at bottom to ensure button pops and protects the navbar at the top */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/40 pointer-events-none z-0" />

      {/* Button */}
      <div className="relative z-10 container mx-auto px-6 flex justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
        <Link 
          href="/shop" 
          className="group relative inline-flex items-center justify-center bg-white/95 backdrop-blur-sm text-foreground px-8 py-4 sm:px-12 sm:py-5 rounded-full font-serif text-[11px] sm:text-[13px] uppercase tracking-[0.2em] sm:tracking-[0.25em] overflow-hidden transition-all hover:bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] md:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.6)] hover:shadow-2xl hover:-translate-y-1 border border-white/20"
        >
          <span className="relative z-10 font-medium">
            Explorar Colección
          </span>
        </Link>
      </div>
    </div>
  );
}
