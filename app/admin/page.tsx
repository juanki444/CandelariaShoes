"use client";
import { motion } from 'framer-motion';
import { useProductStore } from '@/store/useProductStore';
import { DollarSign, ShoppingBag, Eye, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function AdminDashboard() {
  const { products } = useProductStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const stats = [
    { title: "Ventas (Mes)", value: "$12,450,000", icon: DollarSign, trend: "+14.5%", color: "text-green-600", bg: "bg-green-50" },
    { title: "Pedidos (Mes)", value: "84", icon: ShoppingBag, trend: "+5.2%", color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Prod. Activos", value: products.length.toString(), icon: TrendingUp, trend: "Estable", color: "text-primary", bg: "bg-primary/10" },
    { title: "Visitas", value: "3,402", icon: Eye, trend: "+22.1%", color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-serif text-4xl text-foreground mb-2">Panel de Control</h1>
        <p className="text-foreground/50 mb-12 font-light text-sm">Resumen del rendimiento de tu boutique.</p>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <stat.icon size={22} strokeWidth={1.5} />
                </div>
                <span className={`text-[10px] uppercase font-bold tracking-widest ${stat.color} bg-white px-3 py-1 rounded-full shadow-sm border border-gray-50`}>{stat.trend}</span>
              </div>
              <h3 className="text-foreground/40 text-[10px] uppercase tracking-widest font-bold mb-1">{stat.title}</h3>
              <p className="text-3xl font-serif text-foreground tracking-tight">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl text-foreground">Últimos Productos Añadidos</h2>
            <Link href="/admin/products" className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] hover:text-primary/70 transition-colors bg-primary/5 px-5 py-2.5 rounded-full">Ver todos</Link>
          </div>
          
          <div className="space-y-4">
             {products.slice(0, 4).map(product => {
               const validImg = product.images.find((img: string) => img.includes('sandalia')) || product.images[0];
               return (
                 <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100/50 transition-colors rounded-2xl border border-transparent hover:border-gray-100">
                   <div className="flex items-center gap-5">
                     <div className="w-14 aspect-[4/5] bg-white rounded-xl overflow-hidden relative shadow-sm">
                        <Image src={validImg} alt={product.name} fill className="object-cover" />
                     </div>
                     <div>
                       <h4 className="font-serif text-lg text-foreground mb-1">{product.name}</h4>
                       <p className="text-[9px] uppercase tracking-widest text-foreground/50 font-bold">{product.colors.length} Colores • Tallas {Math.min(...product.sizes)}-{Math.max(...product.sizes)}</p>
                     </div>
                   </div>
                   <div className="text-right">
                     <p className="text-sm font-semibold text-foreground">${product.price.toLocaleString('es-CO')}</p>
                   </div>
                 </div>
               )
             })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
