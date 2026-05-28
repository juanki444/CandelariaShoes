"use client";
import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag, Truck, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useProductStore } from "@/store/useProductStore";
import { useCartStore } from "@/store/useCartStore";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { products, initializeProducts } = useProductStore();
  const { addItem } = useCartStore();
  
  const [mounted, setMounted] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  
  // Selection states
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    initializeProducts();
    setMounted(true);
  }, [initializeProducts]);

  useEffect(() => {
    if (products.length > 0) {
      const foundProduct = products.find(p => p.id === resolvedParams.id);
      if (foundProduct) {
        setProduct(foundProduct);
        // Default selections
        if (foundProduct.colors.length > 0) setSelectedColor(foundProduct.colors[0]);
        
        // Related products (random subset excluding current)
        const related = [...products]
          .filter(p => p.id !== foundProduct.id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        setRelatedProducts(related);
      } else {
        router.push('/shop'); // Redirect if not found
      }
    }
  }, [products, resolvedParams.id, router]);

  if (!mounted || !product) {
    return (
      <div className="min-h-screen pt-40 pb-20 flex flex-col items-center justify-center gap-4 text-primary">
        <Loader2 size={32} className="animate-spin" />
        <span className="text-xs uppercase tracking-[0.2em] font-medium text-foreground/50">Cargando producto...</span>
      </div>
    );
  }

  // Predefined standard sizes 35 to 42
  const standardSizes = [35, 36, 37, 38, 39, 40, 41, 42];

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;
    
    setIsAdding(true);
    
    // Simulate slight delay for premium feedback feeling
    setTimeout(() => {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: selectedSize,
        color: selectedColor,
        quantity: quantity
      });
      setIsAdding(false);
      toast.success("Agregado a tu carrito", {
        description: `${product.name} (Talla ${selectedSize}, ${selectedColor})`,
        duration: 3000,
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-32">
      <div className="container mx-auto px-6 md:px-12">
        {/* Breadcrumb / Back */}
        <Link href="/shop" className="inline-flex items-center gap-3 text-foreground/50 hover:text-foreground transition-colors text-[10px] uppercase tracking-[0.2em] font-semibold mb-12">
          <ArrowLeft size={16} strokeWidth={1.5} /> Volver a la Colección
        </Link>

        {/* Product Section */}
        <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
          
          {/* Gallery (Left) */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-[#FAF6F0]"
            >
              <Image 
                src={product.images[selectedImage]} 
                alt={product.name} 
                fill 
                className="object-cover object-center"
                priority
              />
            </motion.div>
            
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {product.images.map((img: string, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-24 aspect-[4/5] rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 ${selectedImage === idx ? 'ring-2 ring-offset-4 ring-primary opacity-100 shadow-md' : 'opacity-50 hover:opacity-100 hover:ring-1 hover:ring-offset-2 hover:ring-gray-200'}`}
                  >
                    <Image src={img} alt={`${product.name} - vista ${idx + 1}`} fill className="object-cover object-center" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details (Right) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2 flex flex-col pt-4"
          >
            <span className="text-secondary text-[10px] uppercase tracking-[0.4em] font-bold mb-4">Candelaria Shoes</span>
            <h1 className="font-serif text-4xl lg:text-5xl text-foreground mb-4 leading-tight">{product.name}</h1>
            <p className="font-serif text-2xl text-foreground/50 italic mb-8">${product.price.toLocaleString('es-CO')}</p>
            
            <p className="text-foreground/70 font-light leading-relaxed mb-10 max-w-lg text-lg">
              {product.description}
            </p>

            <div className="h-[1px] w-full bg-gray-100 mb-10"></div>

            {/* Colors */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground">Color</span>
                <span className="text-xs text-foreground/50 font-medium italic">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-4">
                {product.colors.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${selectedColor === color ? 'bg-foreground text-white shadow-lg' : 'bg-white border border-gray-200 text-foreground/60 hover:border-foreground/30 hover:bg-gray-50'}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-14">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground">Talla</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {standardSizes.map(size => {
                  const isAvailable = product.sizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={`aspect-square flex items-center justify-center text-sm font-medium rounded-full transition-all duration-300
                        ${!isAvailable ? 'opacity-20 cursor-not-allowed border border-gray-200 text-gray-500 line-through' : 
                          selectedSize === size ? 'bg-foreground text-white shadow-lg scale-110' : 'bg-white border border-gray-200 text-foreground/70 hover:border-foreground hover:text-foreground hover:bg-gray-50'
                        }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {!selectedSize && (
                <p className="text-primary text-[10px] uppercase tracking-widest font-semibold mt-4 opacity-80">* Por favor selecciona una talla</p>
              )}
            </div>

            {/* Add to Cart Area */}
            <div className="flex flex-col sm:flex-row gap-6 mb-12">
              {/* Quantity */}
              <div className="flex items-center justify-between border border-gray-200 rounded-full px-6 py-4 sm:w-1/3 bg-white">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="text-foreground/40 hover:text-foreground transition-colors"
                >
                  <Minus size={18} strokeWidth={1.5} />
                </button>
                <span className="font-semibold text-sm">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="text-foreground/40 hover:text-foreground transition-colors"
                >
                  <Plus size={18} strokeWidth={1.5} />
                </button>
              </div>
              
              {/* Add Button */}
              <button 
                onClick={handleAddToCart}
                disabled={!selectedSize || isAdding}
                className="flex-grow flex items-center justify-center gap-3 bg-primary text-white rounded-full py-4 uppercase tracking-[0.2em] text-xs font-semibold hover:bg-[#c2684b] transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(217,119,87,0.8)] hover:shadow-[0_15px_25px_-10px_rgba(217,119,87,0.9)] hover:-translate-y-0.5 disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none disabled:translate-y-0"
              >
                {isAdding ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <ShoppingBag size={20} strokeWidth={1.5} />
                    Agregar al Carrito
                  </>
                )}
              </button>
            </div>

            {/* Benefits */}
            <div className="bg-[#FAF6F0]/50 rounded-3xl p-8 flex flex-col gap-5 border border-primary/5">
               <div className="flex items-center gap-4 text-sm text-foreground/70 font-medium">
                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-primary">
                    <CheckCircle2 size={20} strokeWidth={1.5} />
                 </div>
                 Hecho a mano por artesanos en Colombia
               </div>
               <div className="flex items-center gap-4 text-sm text-foreground/70 font-medium">
                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-primary">
                    <Truck size={20} strokeWidth={1.5} />
                 </div>
                 Envíos nacionales en 3-5 días hábiles
               </div>
            </div>

          </motion.div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="container mx-auto px-6 md:px-12 mt-40 pt-20 border-t border-gray-100">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-foreground mb-6">También te podría gustar</h2>
            <div className="w-16 h-[1px] bg-primary/40 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {relatedProducts.map(relProduct => {
              const validImg = relProduct.images.find((i: string) => i.toLowerCase().includes("sandalia")) || relProduct.images[0];
              return (
                <Link href={`/shop/${relProduct.id}`} key={relProduct.id} className="group cursor-pointer flex flex-col text-center">
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#FAF6F0] mb-6 transition-all duration-500 group-hover:shadow-lg group-hover:-translate-y-2">
                    <Image 
                      src={validImg} 
                      alt={relProduct.name} 
                      fill 
                      className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-[1500ms] ease-out" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                  </div>
                  <h3 className="font-serif text-lg text-foreground mb-2 group-hover:text-primary transition-colors">{relProduct.name}</h3>
                  <p className="text-foreground/50 font-medium tracking-widest text-sm">${relProduct.price.toLocaleString('es-CO')}</p>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  );
}
