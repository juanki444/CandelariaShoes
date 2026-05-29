import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative w-full h-[100svh] min-h-[500px] md:min-h-[600px] flex flex-col items-center justify-end overflow-hidden pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:pb-16 md:pb-24">
      {/* Mobile Background Image (Visible only on small screens) */}
      <Image
        src="/assets/fondo-movil.jpg"
        alt="Candelaria Shoes Collection"
        fill
        priority
        className="object-cover object-center sm:hidden z-0"
        sizes="100vw"
        quality={90}
      />

      {/* Desktop Background Image (Visible on sm and up) */}
      <Image
        src="/assets/fondo-final.jpg"
        alt="Candelaria Shoes Collection"
        fill
        priority
        className="object-cover object-center hidden sm:block lg:fixed z-0"
        sizes="100vw"
        quality={90}
      />

      {/* Soft, sophisticated gradient: darker at bottom to ensure button pops and protects the navbar at the top */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/40 pointer-events-none z-0" />

      {/* Content wrapper with container constraints and safe padding */}
      <div className="relative z-10 w-full container mx-auto px-4 sm:px-6 flex justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out mb-2 sm:mb-0">
        <Link 
          href="/shop" 
          className="group relative inline-flex items-center justify-center bg-white/95 backdrop-blur-sm text-foreground w-[85%] max-w-[320px] sm:w-auto sm:max-w-none px-6 py-4 sm:px-12 sm:py-5 rounded-full font-serif text-[clamp(11px,3vw,13px)] uppercase tracking-[0.15em] sm:tracking-[0.25em] overflow-hidden transition-all hover:bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] md:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.6)] hover:shadow-2xl hover:-translate-y-1 border border-white/20 text-center"
        >
          <span className="relative z-10 font-medium whitespace-nowrap">
            Explorar Colección
          </span>
        </Link>
      </div>
    </section>
  );
}
