"use client";
import { useState, useEffect } from 'react';
import { useProductStore } from '@/store/useProductStore';
import { Product } from '@/lib/products';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Search } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct, initializeProducts } = useProductStore();
  const [mounted, setMounted] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sizes: '', // comma separated numbers
    colors: '', // comma separated string
    featured: false
  });

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    initializeProducts();
    setMounted(true);
  }, [initializeProducts]);

  if (!mounted) return null;

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        sizes: product.sizes.join(', '),
        colors: product.colors.join(', '),
        featured: product.featured || false
      });
      setExistingImages(product.images);
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', sizes: '', colors: '', featured: false });
      setExistingImages([]);
    }
    setSelectedFiles([]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      const supabase = createClient();
      const uploadedUrls: string[] = [];

      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('products-images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('products-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      const finalImages = [...existingImages, ...uploadedUrls];

      if (finalImages.length === 0) {
        toast.error("Debes incluir al menos una imagen.");
        setIsUploading(false);
        return;
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        images: finalImages,
        sizes: formData.sizes.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)),
        colors: formData.colors.split(',').map(s => s.trim()).filter(Boolean),
        featured: formData.featured
      };

      if (editingProduct) {
        await updateProduct({ ...productData, id: editingProduct.id } as Product);
        toast.success("Producto actualizado exitosamente");
      } else {
        await addProduct(productData);
        toast.success("Producto creado exitosamente");
      }
      setIsUploading(false);
      handleCloseModal();
    } catch (error) {
      setIsUploading(false);
      console.error(error);
      toast.error("Error al guardar el producto o subir imágenes.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.")) {
      await deleteProduct(id);
      toast.info("Producto eliminado");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="font-serif text-4xl text-foreground mb-2">Gestión de Productos</h1>
          <p className="text-foreground/50 font-light text-sm">Administra el inventario, precios y detalles del catálogo.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary hover:bg-[#c2684b] text-white px-8 py-4 rounded-xl uppercase tracking-[0.2em] text-[10px] font-bold transition-all shadow-[0_10px_20px_-10px_rgba(217,119,87,0.8)] hover:shadow-[0_15px_25px_-10px_rgba(217,119,87,0.9)] hover:-translate-y-0.5 flex items-center gap-2 shrink-0"
        >
          <Plus size={16} strokeWidth={2} /> Nuevo Producto
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-8 flex items-center">
         <div className="relative flex-1 max-w-md">
           <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" />
           <input 
             type="text" 
             placeholder="Buscar productos por nombre..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full bg-gray-50 border border-gray-100 pl-12 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
           />
         </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="py-5 px-6 text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40 whitespace-nowrap">Producto</th>
                <th className="py-5 px-6 text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40 whitespace-nowrap">Precio</th>
                <th className="py-5 px-6 text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40 whitespace-nowrap">Variantes</th>
                <th className="py-5 px-6 text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40 whitespace-nowrap">Estado</th>
                <th className="py-5 px-6 text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40 text-right whitespace-nowrap">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => {
                const validImg = product.images.find(img => img.includes('sandalia')) || product.images[0] || '';
                return (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-6 min-w-[250px]">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-16 bg-[#FAF6F0] rounded-lg overflow-hidden relative shadow-sm border border-black/5 shrink-0">
                          {validImg ? (
                            <Image src={validImg} alt={product.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={20} /></div>
                          )}
                        </div>
                        <div>
                          <p className="font-serif text-base text-foreground font-medium">{product.name}</p>
                          <p className="text-[10px] text-foreground/40 uppercase tracking-widest mt-1">ID: {product.id.substring(0,8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <p className="text-sm font-semibold text-foreground">${product.price.toLocaleString('es-CO')}</p>
                    </td>
                    <td className="py-4 px-6 min-w-[200px]">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-foreground/60"><strong className="text-foreground font-medium">Tallas:</strong> {product.sizes.join(', ')}</span>
                        <span className="text-xs text-foreground/60"><strong className="text-foreground font-medium">Colores:</strong> {product.colors.join(', ')}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {product.featured ? (
                        <span className="bg-primary/10 text-primary text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full inline-block">Destacado</span>
                      ) : (
                        <span className="bg-gray-100 text-foreground/50 text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full inline-block">Estándar</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(product)} className="p-2 text-foreground/40 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                          <Edit2 size={16} strokeWidth={2} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 text-foreground/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-foreground/40 font-light">
                    No se encontraron productos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Slide Over for Form */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[250]"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-[260] flex flex-col border-l border-primary/5"
            >
              <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white">
                <h2 className="font-serif text-2xl text-foreground">
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <button onClick={handleCloseModal} className="p-2 text-foreground/40 hover:text-foreground transition-colors rounded-full hover:bg-gray-50">
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
                <form id="productForm" onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-foreground/60 mb-2">Nombre del Producto</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white transition-all shadow-inner" />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-foreground/60 mb-2">Descripción</label>
                    <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white transition-all shadow-inner resize-none" />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-foreground/60 mb-2">Precio (COP)</label>
                    <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white transition-all shadow-inner" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-foreground/60 mb-2">Tallas (Separadas por coma)</label>
                      <input type="text" required placeholder="35, 36, 37" value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})} className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white transition-all shadow-inner" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-foreground/60 mb-2">Colores (Separados por coma)</label>
                      <input type="text" required placeholder="Negro, Dorado" value={formData.colors} onChange={e => setFormData({...formData, colors: e.target.value})} className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white transition-all shadow-inner" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-foreground/60 mb-2">Imágenes</label>
                    <div className="relative border-2 border-dashed border-primary/20 rounded-xl p-8 hover:bg-primary/5 transition-colors flex flex-col items-center justify-center text-center group cursor-pointer">
                      <ImageIcon className="text-primary/40 group-hover:text-primary transition-colors mb-3" size={28} />
                      <span className="text-sm text-foreground/70 font-medium mb-1">Haz clic o arrastra imágenes aquí</span>
                      <span className="text-[10px] text-foreground/40 uppercase tracking-widest">PNG, JPG, WEBP</span>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        onChange={(e) => {
                          if (e.target.files) {
                            setSelectedFiles(Array.from(e.target.files));
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                    
                    {/* Previews */}
                    {(existingImages.length > 0 || selectedFiles.length > 0) && (
                      <div className="mt-4 flex gap-4 overflow-x-auto py-2 custom-scrollbar">
                        {existingImages.map((img, idx) => (
                          <div key={`existing-${idx}`} className="relative w-20 h-24 shrink-0 rounded-lg overflow-hidden border border-gray-200">
                            <Image src={img} alt="preview" fill className="object-cover" />
                            <button 
                              type="button"
                              onClick={() => setExistingImages(prev => prev.filter((_, i) => i !== idx))}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                        {selectedFiles.map((file, idx) => (
                          <div key={`new-${idx}`} className="relative w-20 h-24 shrink-0 rounded-lg overflow-hidden border border-primary/30">
                            <Image src={URL.createObjectURL(file)} alt="preview" fill className="object-cover" />
                            <button 
                              type="button"
                              onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== idx))}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input type="checkbox" id="featured" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="w-4 h-4 text-primary accent-primary rounded border-gray-300 focus:ring-primary cursor-pointer" />
                    <label htmlFor="featured" className="text-sm font-medium text-foreground cursor-pointer">Marcar como producto destacado</label>
                  </div>
                </form>
              </div>

              <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                <button disabled={isUploading} type="submit" form="productForm" className="w-full bg-foreground hover:bg-primary text-white py-4 rounded-xl uppercase tracking-widest text-xs font-bold transition-all shadow-md disabled:opacity-50 flex justify-center items-center gap-2">
                  {isUploading ? 'Subiendo imágenes y guardando...' : (editingProduct ? 'Guardar Cambios' : 'Crear Producto')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
