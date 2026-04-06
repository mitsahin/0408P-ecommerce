import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import axiosClient from '../api/axiosClient'

const OrdersPage = () => {
  const location = useLocation()
  const createdOrderId = location.state?.createdOrderId
  const [orders, setOrders] = useState([])
  const [openId, setOpenId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true)
        const response = await axiosClient.get('/order')
        setOrders(response?.data ?? [])
      } catch (error) {
        toast.error(error?.message || 'Failed to load previous orders.')
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [])

  useEffect(() => {
    if (!createdOrderId) return
    setOpenId(createdOrderId)
  }, [createdOrderId])

  const formatOrderDate = (value) => {
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return value || '-'
    return parsed.toLocaleString('tr-TR')
  }

  return (
    <section className="flex w-full flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-900">Previous Orders</h1>
      {createdOrderId ? (
        <div className="rounded border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Your order #{createdOrderId} has been created successfully.
        </div>
      ) : null}
      <div className="flex w-full flex-col gap-4">
        {isLoading ? (
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Loading
          </span>
        ) : null}
        {orders.length === 0 ? (
          <span className="text-sm text-slate-400">No orders found.</span>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="flex w-full flex-col gap-3 rounded border border-slate-200 bg-white p-4"
            >
              <div className="flex w-full flex-wrap items-center justify-between gap-3 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-slate-900">
                    Order #{order.id}
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatOrderDate(order.order_date)}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xs text-slate-500">
                    Items: {order.products?.length ?? 0}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {Number(order.price ?? 0).toFixed(2)} TL
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenId((prev) => (prev === order.id ? null : order.id))
                    }
                    className="rounded border border-slate-200 px-3 py-2 text-xs"
                  >
                    {openId === order.id ? 'Hide' : 'Details'}
                  </button>
                </div>
              </div>
              {openId === order.id ? (
                <div className="flex w-full flex-col gap-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                  <div className="grid grid-cols-3 rounded bg-slate-50 px-3 py-2 font-semibold text-slate-500">
                    <span>Product ID</span>
                    <span>Detail</span>
                    <span className="text-right">Count</span>
                  </div>
                  {(order.products ?? []).map((product, index) => (
                    <div
                      key={`${order.id}-${index}`}
                      className="grid grid-cols-3 items-center border-b border-slate-100 px-3 py-2 last:border-b-0"
                    >
                      <span>#{product.product_id}</span>
                      <span className="truncate">{product.detail || '-'}</span>
                      <span className="text-right">{product.count}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default OrdersPage
