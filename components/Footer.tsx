"use client";
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return (
    <footer id="footer" className="bg-white pt-24 pb-12 border-t border-primary/10 mt-auto">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
          
          {/* Brand Info */}
          <div className="max-w-md">
            <h3 className="font-script text-6xl mb-6 text-primary">Candelaria</h3>
            <p className="text-foreground/60 font-light leading-relaxed mb-8">
              Diseño colombiano con alma tropical. Creamos calzado premium que abraza tus pasos, combinando confort absoluto con una estética atemporal.
            </p>
            <a 
              href="https://www.instagram.com/candelaria.shoes" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-3 bg-primary/5 hover:bg-primary/10 text-primary px-6 py-3 rounded-full transition-colors font-medium text-sm tracking-wide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              Síguenos en Instagram
            </a>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <h4 className="font-serif text-2xl text-foreground mb-2">Contáctanos</h4>
            
            <a href="mailto:candelaria.shoes7@gmail.com" className="flex items-center gap-4 text-foreground/60 hover:text-primary transition-colors group">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Mail size={18} />
              </div>
              <span className="font-light">candelaria.shoes7@gmail.com</span>
            </a>
            
            <a href="https://wa.me/573009831469" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-foreground/60 hover:text-primary transition-colors group">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Phone size={18} />
              </div>
              <span className="font-light">+57 300 9831469</span>
            </a>

            <div className="flex items-center gap-4 text-foreground/60 group cursor-default">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                <MapPin size={18} />
              </div>
              <span className="font-light">Chinú, Córdoba</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-foreground/40 font-semibold">
          <p>© {new Date().getFullYear()} CANDELARIA SHOES. DISEÑADO EN COLOMBIA.</p>
          <div className="flex gap-8 mt-6 md:mt-0">
             <Link href="#" className="hover:text-primary transition-colors">Políticas de Privacidad</Link>
             <Link href="#" className="hover:text-primary transition-colors">Términos y Condiciones</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
