import { createClient } from '@supabase/supabase-js'
import { initialProducts } from '../lib/products'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function seed() {
  console.log('Seeding products...')
  
  // Try to sign up admin user
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: 'admin@test.com',
    password: 'candelaria123',
  })
  
  console.log('Sign up result:', signUpError ? signUpError.message : 'Success')
  
  // Try to sign in
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: 'admin@test.com',
    password: 'candelaria123',
  })
  
  if (signInError) {
    console.error('Sign in error:', signInError.message)
    return
  }

  // Insert products
  for (const product of initialProducts) {
    const { id, ...productData } = product
    const { error } = await supabase.from('products').insert([productData])
    if (error) {
      console.error('Error inserting', product.name, error.message)
    } else {
      console.log('Inserted', product.name)
    }
  }

  console.log('Seed completed!')
}

seed()
