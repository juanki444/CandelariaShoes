"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Edit, Link as LinkIcon, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { updateOrderStatus, updatePaymentProof } from '@/app/actions/orders'

export default function OrdersTable({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [paymentProofLink, setPaymentProofLink] = useState('')

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setIsUpdating(true)
      await updateOrderStatus(id, newStatus)
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o))
      toast.success(`Estado actualizado a ${newStatus}`)
    } catch (error) {
      toast.error('Error al actualizar el estado')
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePaymentProofSubmit = async () => {
    if (!selectedOrder) return
    try {
      setIsUpdating(true)
      await updatePaymentProof(selectedOrder.id, paymentProofLink)
      const updatedOrders = orders.map(o => 
        o.id === selectedOrder.id ? { ...o, payment_proof: paymentProofLink } : o
      )
      setOrders(updatedOrders)
      setSelectedOrder(updatedOrders.find(o => o.id === selectedOrder.id))
      toast.success('Comprobante guardado exitosamente')
      setPaymentProofLink('')
    } catch (error) {
      toast.error('Error al guardar el comprobante')
    } finally {
      setIsUpdating(false)
    }
  }

  const statusColors: Record<string, string> = {
    'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Pagado': 'bg-blue-100 text-blue-800 border-blue-200',
    'Enviado': 'bg-green-100 text-green-800 border-green-200',
    'Cancelado': 'bg-red-100 text-red-800 border-red-200',
  }

  return (
    <>
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="py-5 px-6 text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40 whitespace-nowrap">ID / Fecha</th>
                <th className="py-5 px-6 text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40 whitespace-nowrap">Cliente</th>
                <th className="py-5 px-6 text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40 whitespace-nowrap">Total</th>
                <th className="py-5 px-6 text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40 whitespace-nowrap">Método</th>
                <th className="py-5 px-6 text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40 whitespace-nowrap">Estado</th>
                <th className="py-5 px-6 text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40 text-right whitespace-nowrap">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="py-4 px-6 whitespace-nowrap">
                    <p className="font-serif text-base text-foreground font-medium">{order.id.split('-')[0].toUpperCase()}</p>
                    <p className="text-[10px] text-foreground/40 mt-1">{new Date(order.created_at).toLocaleDateString('es-CO')}</p>
                  </td>
                  <td className="py-4 px-6 min-w-[200px]">
                    <p className="text-sm font-semibold text-foreground">{order.customer_name}</p>
                    <p className="text-xs text-foreground/50">{order.email}</p>
                    <p className="text-xs text-foreground/50">{order.phone}</p>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <p className="text-sm font-semibold text-foreground">${Number(order.total_amount).toLocaleString('es-CO')}</p>
                    <p className="text-xs text-foreground/50">{order.items.length} items</p>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="text-xs font-medium text-foreground capitalize">
                      {order.payment_method === 'cod' ? 'Contra Entrega' : order.payment_method}
                    </span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <select
                      value={order.status}
                      disabled={isUpdating}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full inline-block border focus:outline-none appearance-none cursor-pointer ${statusColors[order.status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Pagado">Pagado</option>
                      <option value="Enviado">Enviado</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <button 
                      onClick={() => setSelectedOrder(order)} 
                      className="p-2 text-foreground/40 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors inline-flex"
                    >
                      <Eye size={16} strokeWidth={2} />
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-foreground/40 font-light">
                    No hay pedidos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[250]"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-[260] flex flex-col border-l border-primary/5"
            >
              <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white">
                <div>
                  <h2 className="font-serif text-2xl text-foreground">
                    Pedido #{selectedOrder.id.split('-')[0].toUpperCase()}
                  </h2>
                  <p className="text-sm text-foreground/50">{new Date(selectedOrder.created_at).toLocaleString('es-CO')}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 text-foreground/40 hover:text-foreground transition-colors rounded-full hover:bg-gray-50">
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                {/* Customer Details */}
                <section>
                  <h3 className="text-xs uppercase tracking-widest font-bold text-foreground/40 mb-4 border-b border-gray-100 pb-2">Cliente y Envío</h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                    <div>
                      <span className="block text-foreground/50 text-xs mb-1">Nombre</span>
                      <span className="font-medium text-foreground">{selectedOrder.customer_name}</span>
                    </div>
                    <div>
                      <span className="block text-foreground/50 text-xs mb-1">Email</span>
                      <span className="font-medium text-foreground">{selectedOrder.email}</span>
                    </div>
                    <div>
                      <span className="block text-foreground/50 text-xs mb-1">Teléfono</span>
                      <span className="font-medium text-foreground">{selectedOrder.phone}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="block text-foreground/50 text-xs mb-1">Dirección</span>
                      <span className="font-medium text-foreground">{selectedOrder.address}, {selectedOrder.city}, {selectedOrder.department}</span>
                    </div>
                  </div>
                </section>

                {/* Items */}
                <section>
                  <h3 className="text-xs uppercase tracking-widest font-bold text-foreground/40 mb-4 border-b border-gray-100 pb-2">Productos ({selectedOrder.items.length})</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-4 items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="relative w-16 h-20 rounded-lg overflow-hidden border border-black/5 shrink-0 bg-white">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-serif text-sm font-medium text-foreground">{item.name}</p>
                          <p className="text-[10px] text-foreground/50 uppercase tracking-wider mt-1">Talla {item.size} / {item.color}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-foreground/60">{item.quantity}x</p>
                          <p className="text-sm font-bold text-foreground">${Number(item.price * item.quantity).toLocaleString('es-CO')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Payment & Status */}
                <section>
                  <h3 className="text-xs uppercase tracking-widest font-bold text-foreground/40 mb-4 border-b border-gray-100 pb-2">Pago</h3>
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-foreground/60">Método</span>
                      <span className="font-medium text-sm capitalize">{selectedOrder.payment_method === 'cod' ? 'Contra Entrega' : selectedOrder.payment_method}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-foreground/60">Total Pagado</span>
                      <span className="font-bold text-lg text-primary">${Number(selectedOrder.total_amount).toLocaleString('es-CO')}</span>
                    </div>
                    
                    {/* Comprobante Section */}
                    <div className="pt-4 border-t border-gray-200/50 mt-4">
                      <span className="block text-xs uppercase tracking-widest font-bold text-foreground/40 mb-3">Comprobante de Pago</span>
                      {selectedOrder.payment_proof ? (
                        <div className="flex items-center gap-3">
                          <a href={selectedOrder.payment_proof} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center gap-2 bg-white border border-gray-200 px-4 py-3 rounded-lg text-sm text-primary hover:bg-primary/5 transition-colors group">
                            <LinkIcon size={16} />
                            <span className="truncate">Ver Comprobante</span>
                          </a>
                          <button onClick={() => setPaymentProofLink(selectedOrder.payment_proof)} className="p-3 text-foreground/40 hover:text-primary hover:bg-primary/5 rounded-lg border border-transparent hover:border-primary/10 transition-colors" title="Editar enlace">
                            <Edit size={16} />
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm text-foreground/50 mb-3">No hay comprobante registrado aún.</p>
                      )}

                      {(!selectedOrder.payment_proof || paymentProofLink) && (
                        <div className="flex gap-2 mt-2">
                          <input 
                            type="url" 
                            placeholder="Enlace del comprobante (Drive, Imgur, etc)" 
                            value={paymentProofLink}
                            onChange={(e) => setPaymentProofLink(e.target.value)}
                            className="flex-1 bg-white border border-gray-200 px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:border-primary transition-all" 
                          />
                          <button 
                            onClick={handlePaymentProofSubmit}
                            disabled={!paymentProofLink || isUpdating}
                            className="bg-primary text-white px-4 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase disabled:opacity-50"
                          >
                            {isUpdating ? <Loader2 size={14} className="animate-spin" /> : 'Guardar'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
