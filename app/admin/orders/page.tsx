import { getOrders } from '@/app/actions/orders'
import OrdersTable from './OrdersTable'

export const dynamic = 'force-dynamic'

export default async function AdminOrders() {
  const orders = await getOrders()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl text-foreground mb-2">Pedidos</h1>
        <p className="text-foreground/60">Gestiona los pedidos de tus clientes.</p>
      </div>

      <OrdersTable initialOrders={orders} />
    </div>
  )
}
