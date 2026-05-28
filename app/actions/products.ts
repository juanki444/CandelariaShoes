"use server"
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
  if (error) {
    console.error("Error fetching products:", error)
    return []
  }
  return data
}

export async function createProduct(productData: any) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('products').insert([productData]).select().single()
  if (error) throw error
  revalidatePath('/shop')
  revalidatePath('/admin/products')
  return data
}

export async function updateProduct(id: string, productData: any) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('products').update(productData).eq('id', id).select().single()
  if (error) throw error
  revalidatePath('/shop')
  revalidatePath('/admin/products')
  return data
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/shop')
  revalidatePath('/admin/products')
}
