"use client";
import { useCartStore } from '@/store/useCartStore';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CartDrawer() {
  const { isOpen, closeCart, items, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          
          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 h-[100dvh] w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
              <h2 className="font-serif text-3xl text-foreground flex items-center gap-3">
                <span className="text-primary italic">Mi</span> Carrito
              </h2>
              <button onClick={closeCart} className="p-2 -mr-2 text-foreground/40 hover:text-foreground transition-colors rounded-full hover:bg-gray-50">
                <X size={24} strokeWidth={1} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar bg-white">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-primary/30 mb-2">
                    <ShoppingBag size={40} strokeWidth={1} />
                  </div>
                  <p className="text-2xl text-foreground font-serif">Tu carrito está vacío</p>
                  <p className="text-foreground/50 font-light text-sm max-w-[250px]">Parece que aún no has agregado tus sandalias favoritas.</p>
                  <button onClick={closeCart} className="mt-8 border-b border-primary text-primary uppercase tracking-[0.2em] text-[10px] font-bold pb-1 hover:text-primary/70 transition-colors">
                    Continuar Explorando
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {items.map((item) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      key={`${item.productId}-${item.size}-${item.color}`} 
                      className="flex gap-5 group"
                    >
                      <div className="w-28 aspect-[4/5] rounded-xl overflow-hidden bg-[#FAF6F0] relative shrink-0">
                         <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <div className="flex-1 flex flex-col py-1">
                         <div className="flex justify-between items-start gap-4 mb-1">
                           <h3 className="font-serif text-lg text-foreground leading-tight">{item.name}</h3>
                           <button onClick={() => removeItem(item.productId, item.size, item.color)} className="text-foreground/30 hover:text-red-500 transition-colors mt-0.5">
                             <Trash2 size={16} strokeWidth={1.5} />
                           </button>
                         </div>
                         <p className="text-[10px] text-foreground/50 uppercase tracking-widest font-semibold mb-auto">Talla {item.size} / {item.color}</p>
                         
                         <div className="flex items-center justify-between mt-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-full px-3 py-1.5">
                                <button onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)} className="text-foreground/40 hover:text-foreground transition-colors p-1">
                                  <Minus size={12} strokeWidth={2} />
                                </button>
                                <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)} className="text-foreground/40 hover:text-foreground transition-colors p-1">
                                  <Plus size={12} strokeWidth={2} />
                                </button>
                            </div>
                            <p className="font-medium text-foreground">${(item.price * item.quantity).toLocaleString('es-CO')}</p>
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-8 bg-white border-t border-gray-100 shadow-[0_-20px_40px_rgba(0,0,0,0.03)] relative z-10">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-foreground/50 uppercase text-[10px] tracking-[0.2em] font-bold">Subtotal</span>
                  <span className="font-serif text-3xl text-foreground">${getTotalPrice().toLocaleString('es-CO')}</span>
                </div>
                <p className="text-[10px] text-foreground/40 uppercase tracking-widest mb-6 font-semibold">Impuestos incluidos. Envío calculado en el checkout.</p>
                <Link href="/checkout" onClick={closeCart} className="w-full bg-primary hover:bg-[#c2684b] text-white py-5 rounded-full font-bold tracking-[0.2em] uppercase text-[10px] transition-all flex items-center justify-center gap-3 shadow-[0_10px_20px_-10px_rgba(217,119,87,0.8)] hover:shadow-[0_15px_25px_-10px_rgba(217,119,87,0.9)] hover:-translate-y-0.5">
                  Proceder al Pago <ArrowRight size={14} strokeWidth={2} />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
