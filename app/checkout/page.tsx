"use client";
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, CheckCircle2, Lock, Loader2, ArrowRight, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { createOrder } from '@/app/actions/orders';

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('transfer');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Redirect to shop if cart is empty and not in success state
  if (items.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center p-6 pt-32">
        <h1 className="font-serif text-4xl text-foreground mb-4">Tu carrito está vacío</h1>
        <p className="text-foreground/50 mb-8 max-w-md mx-auto">No tienes productos en tu carrito para proceder al pago.</p>
        <Link href="/shop" className="bg-primary text-white px-10 py-4 rounded-full uppercase tracking-widest text-[10px] font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
          Volver a la Tienda
        </Link>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal > 200000 ? 0 : 15000;
  const total = subtotal + shipping;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("¡Copiado al portapapeles!", {
      description: text,
    });
  };

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      
      const orderData = {
        customer_name: `${formData.get('firstName')} ${formData.get('lastName')}`,
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: `${formData.get('address')} ${formData.get('address2') || ''}`.trim(),
        city: formData.get('city'),
        department: formData.get('department'),
        payment_method: paymentMethod,
        total_amount: total,
        items: items
      };

      const order = await createOrder(orderData);
      
      setOrderId(order.id.split('-')[0].toUpperCase()); // Short ID for display
      setIsSuccess(true);
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast.error("Ocurrió un error al procesar tu pedido. Intenta nuevamente.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 pb-32"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
              className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-8 shadow-sm"
            >
              <CheckCircle2 size={48} strokeWidth={1.5} />
            </motion.div>
            
            <span className="text-primary text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">Pedido Confirmado</span>
            <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-4">Gracias por tu compra</h1>
            
            <div className="bg-gray-50 border border-gray-100 px-6 py-4 rounded-xl mb-6 inline-block">
               <span className="text-sm text-foreground/60 mr-2">Tu número de orden es:</span>
               <span className="font-bold text-primary tracking-wider">{orderId}</span>
            </div>

            <p className="text-foreground/60 font-light max-w-md mx-auto mb-10 leading-relaxed">
              Tu pedido ha sido registrado. Recuerda <strong>enviarnos el comprobante de pago por WhatsApp</strong> citando tu número de orden para procesar el envío de tus Candelaria.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
               <Link href="/shop" className="w-full sm:w-auto flex justify-center items-center gap-4 bg-white border border-gray-200 hover:border-primary text-foreground px-10 py-4 rounded-full uppercase tracking-widest text-[10px] font-bold shadow-sm hover:shadow-md transition-all">
                 Seguir Explorando
               </Link>
               <a href="https://wa.me/573009831469" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto flex justify-center items-center gap-4 bg-[#25D366] hover:bg-[#128C7E] text-white px-10 py-4 rounded-full uppercase tracking-widest text-[10px] font-bold shadow-md transition-colors">
                 Enviar Comprobante
               </a>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="checkout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col lg:flex-row min-h-screen"
          >
            {/* Left Side - Form */}
            <div className="w-full lg:w-[55%] xl:w-[60%] pt-32 pb-20 px-6 lg:px-16 xl:px-24">
              <Link href="/shop" className="inline-flex items-center gap-2 text-foreground/40 hover:text-foreground transition-colors text-[10px] uppercase tracking-[0.2em] font-bold mb-10">
                <ChevronLeft size={16} strokeWidth={1.5} /> Volver a la Tienda
              </Link>

              <h1 className="font-serif text-4xl text-foreground mb-12">Información de Envío</h1>

              <form onSubmit={handleCheckout} className="space-y-10">
                
                {/* Contact */}
                <section>
                  <h2 className="text-xs uppercase tracking-widest font-semibold text-foreground/50 mb-6">Contacto</h2>
                  <div className="space-y-4">
                    <input name="email" aria-label="Correo electrónico" type="email" placeholder="Correo electrónico" required className="w-full bg-white border border-gray-200 px-5 py-4 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-400" />
                    <input name="phone" aria-label="Teléfono celular" type="tel" placeholder="Teléfono celular" required className="w-full bg-white border border-gray-200 px-5 py-4 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-400" />
                  </div>
                </section>

                {/* Address */}
                <section>
                  <h2 className="text-xs uppercase tracking-widest font-semibold text-foreground/50 mb-6">Dirección de Envío</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input name="firstName" aria-label="Nombre" type="text" placeholder="Nombre" required className="w-full bg-white border border-gray-200 px-5 py-4 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-400" />
                      <input name="lastName" aria-label="Apellidos" type="text" placeholder="Apellidos" required className="w-full bg-white border border-gray-200 px-5 py-4 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-400" />
                    </div>
                    <input name="address" aria-label="Dirección de envío" type="text" placeholder="Dirección (Calle, Carrera, Número)" required className="w-full bg-white border border-gray-200 px-5 py-4 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-400" />
                    <input name="address2" aria-label="Apartamento o local" type="text" placeholder="Apartamento, local, etc. (Opcional)" className="w-full bg-white border border-gray-200 px-5 py-4 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-400" />
                    <div className="grid grid-cols-2 gap-4">
                      <input name="city" aria-label="Ciudad" type="text" placeholder="Ciudad" required className="w-full bg-white border border-gray-200 px-5 py-4 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-400" />
                      <select name="department" aria-label="Departamento" required className="w-full bg-white border border-gray-200 px-5 py-4 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground appearance-none">
                        <option value="">Departamento</option>
                        <option value="antioquia">Antioquia</option>
                        <option value="cundinamarca">Cundinamarca</option>
                        <option value="valle">Valle del Cauca</option>
                        <option value="atlantico">Atlántico</option>
                        <option value="bolivar">Bolívar</option>
                        <option value="other">Otro</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* Payment */}
                <section>
                  <h2 className="text-xs uppercase tracking-widest font-semibold text-foreground/50 mb-6 flex items-center justify-between">
                    Método de Pago
                    <Lock size={14} className="text-primary" />
                  </h2>
                  <div className="space-y-3">
                    
                    {/* Transferencia */}
                    <label className={`block border rounded-xl p-5 cursor-pointer transition-all ${paymentMethod === 'transfer' ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                      <div className="flex items-center gap-4">
                        <input type="radio" name="paymentMethod" value="transfer" checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} className="sr-only" />
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${paymentMethod === 'transfer' ? 'border-primary' : 'border-gray-300'}`}>
                          {paymentMethod === 'transfer' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                        </div>
                        <span className="font-medium text-sm text-foreground">Transferencia Bancaria</span>
                      </div>
                      {paymentMethod === 'transfer' && (
                        <div className="mt-4 pt-4 border-t border-primary/10">
                           <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm text-sm space-y-3">
                             <div className="flex justify-between items-center">
                               <span className="text-foreground/60 text-xs uppercase tracking-wider">Titular</span>
                               <span className="font-medium">Kelly Vergara</span>
                             </div>
                             <div className="flex justify-between items-center">
                               <span className="text-foreground/60 text-xs uppercase tracking-wider">Cuenta Bancolombia</span>
                               <div className="flex items-center gap-2">
                                 <span className="font-medium">506 000884 05</span>
                                 <button type="button" onClick={() => copyToClipboard('506 000884 05')} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded text-foreground/60 transition-colors" title="Copiar">
                                   <Copy size={14} />
                                 </button>
                               </div>
                             </div>
                           </div>
                           <p className="text-xs text-foreground/50 leading-relaxed mt-4">
                             Una vez realices el pago, envíanos el comprobante por WhatsApp para confirmar tu pedido.
                           </p>
                        </div>
                      )}
                    </label>

                    {/* Nequi */}
                    <label className={`block border rounded-xl p-5 cursor-pointer transition-all ${paymentMethod === 'nequi' ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                      <div className="flex items-center gap-4">
                        <input type="radio" name="paymentMethod" value="nequi" checked={paymentMethod === 'nequi'} onChange={() => setPaymentMethod('nequi')} className="sr-only" />
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${paymentMethod === 'nequi' ? 'border-primary' : 'border-gray-300'}`}>
                          {paymentMethod === 'nequi' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                        </div>
                        <span className="font-medium text-sm text-foreground">Nequi</span>
                      </div>
                      {paymentMethod === 'nequi' && (
                        <div className="mt-4 pt-4 border-t border-primary/10">
                           <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm text-sm space-y-3">
                             <div className="flex justify-between items-center">
                               <span className="text-foreground/60 text-xs uppercase tracking-wider">Número Nequi</span>
                               <div className="flex items-center gap-2">
                                 <span className="font-medium">3009831469</span>
                                 <button type="button" onClick={() => copyToClipboard('3009831469')} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded text-foreground/60 transition-colors" title="Copiar">
                                   <Copy size={14} />
                                 </button>
                               </div>
                             </div>
                           </div>
                           <p className="text-xs text-foreground/50 leading-relaxed mt-4">
                             Una vez realices el pago, envíanos el comprobante por WhatsApp para confirmar tu pedido.
                           </p>
                        </div>
                      )}
                    </label>

                  </div>
                </section>

                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full bg-primary hover:bg-[#c2684b] text-white py-5 rounded-xl font-bold tracking-[0.2em] uppercase text-[10px] transition-all flex items-center justify-center gap-3 shadow-[0_10px_20px_-10px_rgba(217,119,87,0.8)] hover:shadow-[0_15px_25px_-10px_rgba(217,119,87,0.9)] hover:-translate-y-0.5 mt-8 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Procesando Pedido...
                    </>
                  ) : (
                    <>Confirmar Pedido - ${(total).toLocaleString('es-CO')}</>
                  )}
                </button>
              </form>
            </div>

            {/* Right Side - Summary (Sticky) */}
            <div className="w-full lg:w-[45%] xl:w-[40%] bg-[#FAF6F0] lg:border-l border-gray-200/50 pt-16 lg:pt-32 pb-20 px-6 lg:px-12 xl:px-16">
              <div className="lg:sticky lg:top-32">
                <h2 className="font-serif text-2xl text-foreground mb-8">Resumen del Pedido</h2>
                
                <div className="space-y-6 mb-10 max-h-[40vh] overflow-y-auto custom-scrollbar pr-4">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4">
                      <div className="relative w-16 aspect-[4/5] rounded-lg overflow-hidden bg-white shrink-0 border border-black/5">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                        <span className="absolute -top-2 -right-2 bg-foreground text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold z-10 shadow-sm border border-white">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h3 className="font-serif text-sm text-foreground mb-1">{item.name}</h3>
                        <p className="text-[9px] uppercase tracking-widest text-foreground/50 font-semibold mb-2">Talla {item.size} / {item.color}</p>
                        <p className="text-sm font-medium text-foreground">${(item.price * item.quantity).toLocaleString('es-CO')}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 border-t border-black/5 pt-6 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-foreground/60 font-medium">Subtotal</span>
                    <span className="text-foreground font-semibold">${subtotal.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-foreground/60 font-medium">Envío</span>
                    {shipping === 0 ? (
                      <span className="text-primary font-bold uppercase tracking-widest text-[10px]">Gratis</span>
                    ) : (
                      <span className="text-foreground font-semibold">${shipping.toLocaleString('es-CO')}</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-black/10 pt-6">
                  <span className="text-base uppercase tracking-widest font-bold text-foreground">Total</span>
                  <div className="flex items-end gap-2">
                    <span className="text-[10px] text-foreground/40 font-semibold uppercase mb-1">COP</span>
                    <span className="text-2xl font-bold text-foreground">${total.toLocaleString('es-CO')}</span>
                  </div>
                </div>
                
                <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-foreground/40 font-semibold uppercase tracking-widest">
                  <Lock size={12} /> Pago seguro
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
