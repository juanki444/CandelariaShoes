import { create } from 'zustand';
import { Product } from '../lib/products';
import { getProducts, createProduct, updateProduct as updateProductAction, deleteProduct as deleteProductAction } from '../app/actions/products';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  initializeProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product | null>;
  updateProduct: (product: Product) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  initializeProducts: async () => {
    if (get().products.length > 0) return;
    set({ isLoading: true });
    try {
      const data = await getProducts();
      set({ products: data || [], isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
  addProduct: async (productData) => {
    try {
      const newProduct = await createProduct(productData);
      if (newProduct) {
        set({ products: [newProduct, ...get().products] });
      }
      return newProduct;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  updateProduct: async (product) => {
    try {
      const updated = await updateProductAction(product.id, product);
      if (updated) {
        set({
          products: get().products.map((p) => p.id === product.id ? updated : p)
        });
      }
      return updated;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  deleteProduct: async (id) => {
    try {
      await deleteProductAction(id);
      set({
        products: get().products.filter((p) => p.id !== id)
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}));
