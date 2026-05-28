"use server"

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createOrder(orderData: any) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        customer_name: orderData.customer_name,
        email: orderData.email,
        phone: orderData.phone,
        address: orderData.address,
        city: orderData.city,
        department: orderData.department,
        payment_method: orderData.payment_method,
        total_amount: orderData.total_amount,
        items: orderData.items,
        status: 'Pendiente'
      }
    ])
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return data[0]
}

export async function getOrders() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateOrderStatus(id: string, status: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/orders')
}

export async function updatePaymentProof(id: string, payment_proof: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('orders')
    .update({ payment_proof })
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/orders')
}
