"use client";
import Hero from "@/components/Hero";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FAQ from "@/components/FAQ";
import { useProductStore } from "@/store/useProductStore";
import { useEffect, useState } from "react";
import { Product } from "@/lib/products";

export default function Home() {
  const { products, initializeProducts } = useProductStore();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    initializeProducts();
  }, [initializeProducts]);

  useEffect(() => {
    // Tomar 4 productos destacados (featured: true)
    const featured = products.filter(p => p.featured).slice(0, 4);
    setFeaturedProducts(featured);
  }, [products]);

  return (
    <>
      <Hero />
      
      {/* Best Sellers Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 border-b border-primary/10 pb-6">
            <div>
              <span className="text-secondary font-medium tracking-[0.3em] uppercase text-[10px] mb-4 block">Catálogo Exclusivo</span>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground">Best Sellers</h2>
            </div>
            <Link href="/shop" className="group flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-primary hover:text-foreground transition-colors mb-2">
              Ver Todo el Catálogo <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Link href={`/shop/${product.id}`} key={product.id} className="group cursor-pointer flex flex-col h-full">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#FAF6F0] mb-5 border border-primary/5">
                  <Image 
                    src={product.images[0]} 
                    alt={product.name} 
                    fill 
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-widest translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-lg text-primary">
                    Ver Detalles
                  </div>
                </div>
                <div className="text-center px-2 flex-grow flex flex-col justify-between">
                  <h3 className="font-serif text-xl text-foreground mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-primary font-medium tracking-widest text-sm mt-auto">${product.price.toLocaleString('es-CO')}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />
    </>
  );
}
