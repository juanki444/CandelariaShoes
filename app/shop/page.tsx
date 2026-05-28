"use client";
import { useProductStore } from "@/store/useProductStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useEffect, useState, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { SlidersHorizontal, ChevronDown, X, Loader2, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

function ShopContent() {
  const { products, initializeProducts } = useProductStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryQ = searchParams.get("q") || "";

  const [mounted, setMounted] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(queryQ);
  const [selectedSizes, setSelectedSizes] = useState<number[]>(() => {
    const sizeParam = searchParams.get('sizes');
    return sizeParam ? sizeParam.split(',').map(Number) : [];
  });
  const [maxPrice, setMaxPrice] = useState<number>(() => {
    const priceParam = searchParams.get('maxPrice');
    return priceParam ? Number(priceParam) : 250000;
  });
  const [sortBy, setSortBy] = useState<string>(() => {
    return searchParams.get('sort') || 'featured';
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Set to 6 to ensure pagination triggers with 8 products

  // Sync URL query with local state
  useEffect(() => {
    setSearchQuery(queryQ);
  }, [queryQ]);

  useEffect(() => {
    initializeProducts();
    setMounted(true);
  }, [initializeProducts]);

  // Sync local state to URL params
  useEffect(() => {
    if (!mounted) return;
    const params = new URLSearchParams(searchParams.toString());
    
    if (selectedSizes.length > 0) {
      params.set('sizes', selectedSizes.join(','));
    } else {
      params.delete('sizes');
    }

    if (maxPrice < 250000) {
      params.set('maxPrice', maxPrice.toString());
    } else {
      params.delete('maxPrice');
    }

    if (sortBy !== 'featured') {
      params.set('sort', sortBy);
    } else {
      params.delete('sort');
    }
    
    const newPath = params.toString() ? `/shop?${params.toString()}` : '/shop';
    router.replace(newPath, { scroll: false });
  }, [selectedSizes, maxPrice, sortBy, router, mounted, searchParams]);

  // Derived filter options
  const allSizes = useMemo(() => {
    const sizes = new Set<number>();
    products.forEach(p => p.sizes.forEach(s => sizes.add(s)));
    return Array.from(sizes).sort();
  }, [products]);

  // Handle fake loading state on filter change
  useEffect(() => {
    setIsFiltering(true);
    setCurrentPage(1); // Reset page on filter
    const timer = setTimeout(() => setIsFiltering(false), 500);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedSizes, maxPrice, sortBy]);

  // Filter logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    // Size
    if (selectedSizes.length > 0) {
      result = result.filter(p => p.sizes.some(s => selectedSizes.includes(s)));
    }

    // Price
    result = result.filter(p => p.price <= maxPrice);

    // Sort
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else {
      // featured
      result.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
    }

    return result;
  }, [products, searchQuery, selectedSizes, maxPrice, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSize = (size: number) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white pt-40 pb-32">
      {/* Header Premium y Elegante */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="container mx-auto px-6 md:px-12 mb-20 text-center flex flex-col items-center"
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-12 h-[1px] bg-primary/40"></div>
          <span className="text-primary font-medium tracking-[0.3em] uppercase text-[10px]">Candelaria Shoes</span>
          <div className="w-12 h-[1px] bg-primary/40"></div>
        </div>
        
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-foreground mb-6 tracking-tight">
          La Colección
        </h1>
        
        <p className="text-foreground/60 font-light text-lg leading-relaxed max-w-xl mx-auto">
          Nuestras siluetas atemporales elaboradas a mano. Un manifiesto de elegancia cálida y confort para la mujer contemporánea.
        </p>
        
        {searchQuery && (
          <p className="mt-8 text-foreground font-serif italic text-xl">
            Resultados para: "{searchQuery}"
          </p>
        )}
      </motion.div>

      <div className="container mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-3 bg-white px-6 py-3 border border-gray-200 rounded-full text-xs uppercase tracking-widest font-medium hover:border-primary transition-colors"
          >
            <SlidersHorizontal size={14} strokeWidth={1.5} /> Filtros
          </button>
          <span className="text-[10px] text-foreground/50 font-medium tracking-[0.2em] uppercase">{filteredProducts.length} Modelos</span>
        </div>

        {/* Sidebar Filters */}
        <aside className={`fixed inset-0 z-[60] bg-white lg:static lg:block lg:w-1/4 lg:z-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${showMobileFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} overflow-y-auto lg:overflow-visible h-full lg:h-auto`}>
          <div className="p-8 lg:p-0 h-full flex flex-col lg:sticky lg:top-40">
            <div className="flex items-center justify-between lg:hidden mb-12 border-b border-gray-100 pb-6">
              <h2 className="font-serif text-3xl text-foreground">Filtros</h2>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-gray-50 rounded-full transition-colors"><X size={24} strokeWidth={1.5} /></button>
            </div>

            {searchQuery && (
              <div className="mb-10 flex items-center justify-between bg-gray-50 px-5 py-4 rounded-xl border border-gray-100 shadow-sm">
                 <span className="text-[10px] uppercase tracking-[0.2em] text-foreground font-medium truncate">Búsqueda: {searchQuery}</span>
                 <button onClick={() => router.push('/shop')} className="text-foreground/40 hover:text-foreground transition-colors p-1"><X size={14} /></button>
              </div>
            )}

            {/* Sizes */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="uppercase tracking-[0.2em] text-[10px] font-semibold text-foreground/60">Talla</h3>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {allSizes.map(size => (
                  <button 
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`aspect-square rounded-full flex items-center justify-center text-xs transition-all duration-300 font-medium ${selectedSizes.includes(size) ? 'bg-foreground text-white shadow-md' : 'bg-white border border-gray-200 hover:border-foreground/40 text-foreground/70 hover:bg-gray-50'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-12">
              <h3 className="uppercase tracking-[0.2em] text-[10px] font-semibold text-foreground/60 mb-6">Precio Máximo</h3>
              <input 
                type="range" 
                min="50000" 
                max="250000" 
                step="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-foreground h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer outline-none"
              />
              <div className="flex justify-between mt-5 text-[10px] tracking-[0.2em] text-foreground/50 uppercase font-medium">
                <span>$50k</span>
                <span className="text-foreground font-bold">${maxPrice.toLocaleString('es-CO')}</span>
              </div>
            </div>

            {/* Mobile apply button */}
            <div className="mt-auto pt-8 pb-8 lg:hidden sticky bottom-0 bg-white border-t border-gray-100">
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-foreground text-white py-4 rounded-full uppercase tracking-[0.2em] text-xs font-semibold shadow-xl"
              >
                Ver {filteredProducts.length} Resultados
              </button>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="w-full lg:w-3/4 flex flex-col">
          <div className="hidden lg:flex items-center justify-between mb-10 pb-4 border-b border-gray-100">
            <span className="text-[10px] text-foreground/50 font-medium tracking-[0.2em] uppercase">{filteredProducts.length} Modelos Encontrados</span>
            <div className="flex items-center gap-4">
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-foreground/40">Ordenar:</span>
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-transparent border-none focus:outline-none text-xs font-semibold uppercase tracking-[0.1em] pr-6 cursor-pointer text-foreground hover:text-primary transition-colors"
                >
                  <option value="featured">Destacados</option>
                  <option value="price-asc">Menor a Mayor</option>
                  <option value="price-desc">Mayor a Menor</option>
                </select>
                <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/40" />
              </div>
            </div>
          </div>

          {/* Grid Area */}
          <div className="flex-grow">
            {isFiltering ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="flex flex-col animate-pulse">
                    <div className="aspect-[4/5] bg-gray-100 rounded-2xl mb-6"></div>
                    <div className="h-5 bg-gray-100 rounded-full w-3/4 mb-2 mx-auto"></div>
                    <div className="h-4 bg-gray-100 rounded-full w-1/4 mx-auto"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-32 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="font-serif text-3xl text-foreground mb-4">No encontramos sandalias</h3>
                <p className="text-foreground/50 font-light mb-8 max-w-md mx-auto leading-relaxed">No hay modelos que coincidan con tus filtros actuales. Intenta ampliando tu búsqueda o limpiando los filtros.</p>
                <button 
                  onClick={() => {
                    if (searchQuery) router.push('/shop');
                    setSelectedSizes([]);
                    setMaxPrice(250000);
                  }}
                  className="px-10 py-4 bg-white border border-gray-300 text-foreground rounded-full uppercase tracking-[0.2em] text-xs font-semibold hover:border-foreground hover:shadow-lg transition-all duration-300"
                >
                  Limpiar Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16">
                {paginatedProducts.map(product => {
                  // Strictly ensure the image contains "sandalia"
                  const validImage = product.images.find(img => img.toLowerCase().includes("sandalia")) || product.images[0];
                  
                  const isSaved = isInWishlist(product.id);
                  return (
                    <div key={product.id} className="group cursor-pointer flex flex-col h-full text-center relative">
                      {/* Wishlist Button */}
                      <button 
                        onClick={(e) => { e.preventDefault(); toggleItem(product.id); }}
                        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                      >
                        <Heart size={18} className={isSaved ? "fill-primary text-primary" : "text-foreground/40"} />
                      </button>
                      
                      <Link href={`/shop/${product.id}`} className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#FAF6F0] mb-6 transition-all duration-500 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] group-hover:-translate-y-2 block">
                        <Image 
                          src={validImage} 
                          alt={product.name} 
                          fill 
                          className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-[1500ms] ease-out" 
                        />
                        {/* Dark overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                        
                        {/* Floating Button */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-8 py-3.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-xl text-foreground whitespace-nowrap">
                          Ver Detalles
                        </div>
                      </Link>

                      <Link href={`/shop/${product.id}`} className="flex-grow flex flex-col px-2">
                        <h3 className="font-serif text-lg text-foreground mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                        <p className="text-foreground/50 font-medium tracking-widest text-sm">${product.price.toLocaleString('es-CO')}</p>
                      </Link>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          {!isFiltering && totalPages > 1 && (
            <div className="mt-20 pt-8 border-t border-gray-100 flex justify-center items-center gap-8">
               <button 
                 onClick={() => {
                   setCurrentPage(p => Math.max(1, p - 1));
                   window.scrollTo({ top: 0, behavior: 'smooth' });
                 }}
                 disabled={currentPage === 1}
                 className="p-3 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 text-foreground/60 hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-transparent transition-all"
               >
                 <ChevronLeft strokeWidth={1.5} />
               </button>
               
               <div className="flex gap-2">
                 {Array.from({length: totalPages}).map((_, i) => (
                   <button
                     key={i}
                     onClick={() => {
                       setCurrentPage(i + 1);
                       window.scrollTo({ top: 0, behavior: 'smooth' });
                     }}
                     className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${currentPage === i + 1 ? 'bg-foreground text-white shadow-md' : 'text-foreground/60 hover:bg-gray-50 hover:text-foreground'}`}
                   >
                     {i + 1}
                   </button>
                 ))}
               </div>

               <button 
                 onClick={() => {
                   setCurrentPage(p => Math.min(totalPages, p + 1));
                   window.scrollTo({ top: 0, behavior: 'smooth' });
                 }}
                 disabled={currentPage === totalPages}
                 className="p-3 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 text-foreground/60 hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-transparent transition-all"
               >
                 <ChevronRight strokeWidth={1.5} />
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-foreground/50"><Loader2 size={40} className="animate-spin" /></div>}>
      <ShopContent />
    </Suspense>
  )
}
