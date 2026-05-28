"use client";
import { useWishlistStore } from '@/store/useWishlistStore';
import { useProductStore } from '@/store/useProductStore';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';

export default function WishlistPage() {
  const { items, toggleItem } = useWishlistStore();
  const { products } = useProductStore();
  const { addItem, openCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const wishlistProducts = products.filter(p => items.includes(p.id));

  return (
    <div className="min-h-screen bg-white pt-40 pb-32">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <Heart size={20} className="text-primary fill-primary" />
          </div>
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">Lista de Deseos</h1>
          <p className="text-foreground/60 font-light text-lg">
            Tus sandalias favoritas guardadas en un solo lugar.
          </p>
        </motion.div>

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-32 bg-[#FAF6F0] rounded-[2rem]">
            <Heart size={48} className="mx-auto text-foreground/20 mb-6" />
            <h2 className="font-serif text-3xl text-foreground mb-4">Aún no tienes favoritos</h2>
            <p className="text-foreground/50 font-light max-w-md mx-auto mb-10">
              Explora nuestra colección y guarda los modelos que más te enamoren para comprarlos después.
            </p>
            <Link 
              href="/shop" 
              className="inline-flex items-center gap-3 bg-foreground text-white px-10 py-4 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-primary transition-colors"
            >
              Explorar Colección <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {wishlistProducts.map(product => {
              const validImage = product.images.find(img => img.toLowerCase().includes("sandalia")) || product.images[0];
              
              return (
                <div key={product.id} className="group flex flex-col h-full relative">
                  {/* Remove Button */}
                  <button 
                    onClick={() => toggleItem(product.id)}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-white backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                    aria-label="Quitar de favoritos"
                  >
                    <Heart size={18} className="text-primary fill-primary" />
                  </button>

                  <Link href={`/shop/${product.id}`} className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#FAF6F0] mb-6 block">
                    <Image 
                      src={validImage} 
                      alt={product.name} 
                      fill 
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                    />
                  </Link>

                  <div className="flex-grow flex flex-col px-2">
                    <Link href={`/shop/${product.id}`}>
                      <h3 className="font-serif text-lg text-foreground mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
                      <p className="text-foreground/50 font-medium tracking-widest text-sm mb-4">${product.price.toLocaleString('es-CO')}</p>
                    </Link>
                    
                    <button 
                      onClick={() => {
                        addItem({
                          productId: product.id,
                          name: product.name,
                          price: product.price,
                          image: validImage,
                          size: product.sizes[0], // Default size
                          color: product.colors[0],
                          quantity: 1
                        });
                        toast.success(`${product.name} añadido al carrito`);
                        openCart();
                      }}
                      className="mt-auto flex items-center justify-center gap-2 w-full border border-gray-200 py-3 rounded-full uppercase tracking-widest text-[10px] font-bold text-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                      <ShoppingBag size={14} /> Añadir al Carrito
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}
