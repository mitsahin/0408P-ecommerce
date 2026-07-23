import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import axiosClient from '../api/axiosClient'

const formatPrice = (value) =>
  `${Number(value ?? 0).toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} TL`

const getProductImage = (product) =>
  product?.images?.[0]?.url ??
  product?.image ??
  product?.thumbnail ??
  product?.img ??
  ''

const getProductName = (product, fallback) =>
  product?.name ?? product?.title ?? fallback ?? 'Ürün'

const parseLineSnapshot = (detail) => {
  if (!detail || detail === 'default' || detail === '-') return null
  if (typeof detail !== 'string') return null
  try {
    const parsed = JSON.parse(detail)
    if (parsed && typeof parsed === 'object') return parsed
  } catch (_error) {
    return { name: detail }
  }
  return null
}

const getLineProductId = (line) =>
  line?.product_id ??
  line?.productId ??
  line?.product?.id ??
  line?.id ??
  null

const normalizeOrderLine = (line) => {
  const snapshot = parseLineSnapshot(line?.detail)
  const productId = getLineProductId(line)
  return {
    productId,
    count: Number(line?.count ?? line?.quantity ?? 1),
    snapshot,
    rawDetail: typeof line?.detail === 'string' ? line.detail : '',
  }
}

const OrdersPage = () => {
  const location = useLocation()
  const createdOrderId = location.state?.createdOrderId
  const [orders, setOrders] = useState([])
  const [openId, setOpenId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [productMap, setProductMap] = useState({})
  const [loadingProductsFor, setLoadingProductsFor] = useState(null)

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true)
        const response = await axiosClient.get('/order')
        setOrders(Array.isArray(response?.data) ? response.data : [])
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

  useEffect(() => {
    if (!openId) return

    const order = orders.find((item) => String(item.id) === String(openId))
    if (!order) return

    const missingIds = (order.products ?? [])
      .map((item) => getLineProductId(item))
      .filter((id) => {
        if (id == null || id === '' || id === 0 || id === '0') return false
        if (!Number.isFinite(Number(id)) || Number(id) <= 0) return false
        return productMap[String(id)] === undefined
      })

    if (missingIds.length === 0) return

    let cancelled = false
    const loadProducts = async () => {
      setLoadingProductsFor(openId)
      const entries = await Promise.all(
        missingIds.map(async (productId) => {
          try {
            const response = await axiosClient.get(`/products/${productId}`)
            return [String(productId), response?.data ?? null]
          } catch (_error) {
            return [String(productId), null]
          }
        })
      )
      if (cancelled) return
      setProductMap((prev) => {
        const next = { ...prev }
        entries.forEach(([id, product]) => {
          next[id] = product
        })
        return next
      })
      setLoadingProductsFor(null)
    }

    loadProducts()
    return () => {
      cancelled = true
    }
  }, [openId, orders, productMap])

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
        {orders.length === 0 && !isLoading ? (
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
                    {formatPrice(order.price)}
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
                <div className="flex w-full flex-col gap-3 border-t border-slate-100 pt-3">
                  {loadingProductsFor === order.id ? (
                    <span className="text-xs text-slate-400">
                      Loading product details...
                    </span>
                  ) : null}
                  {(order.products ?? []).map((line, index) => {
                    const normalized = normalizeOrderLine(line)
                    const nestedProduct =
                      line?.product && typeof line.product === 'object'
                        ? line.product
                        : null
                    const fetched = normalized.productId
                      ? productMap[String(normalized.productId)]
                      : null
                    const snapshot = normalized.snapshot
                    const source = fetched || nestedProduct

                    const image =
                      getProductImage(source) ||
                      snapshot?.image ||
                      getProductImage(line) ||
                      ''
                    const name = getProductName(
                      source,
                      snapshot?.name ||
                        line?.name ||
                        line?.title ||
                        (normalized.rawDetail &&
                        normalized.rawDetail !== 'default' &&
                        !normalized.rawDetail.startsWith('{')
                          ? normalized.rawDetail
                          : null) ||
                        (normalized.productId
                          ? `Product #${normalized.productId}`
                          : 'Ürün')
                    )
                    const unitPrice = Number(
                      source?.price ??
                        source?.list_price ??
                        snapshot?.price ??
                        line?.price ??
                        0
                    )
                    const lineTotal = unitPrice * normalized.count
                    const displayId =
                      normalized.productId &&
                      Number(normalized.productId) > 0
                        ? normalized.productId
                        : snapshot?.id || '-'

                    return (
                      <div
                        key={`${order.id}-${displayId}-${index}`}
                        className="flex w-full flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:flex-row sm:items-center"
                      >
                        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white">
                          {image ? (
                            <img
                              src={image}
                              alt={name}
                              className="h-full w-full object-contain object-center"
                            />
                          ) : (
                            <span className="px-1 text-center text-[10px] uppercase tracking-wide text-slate-400">
                              No image
                            </span>
                          )}
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                          <span className="truncate text-sm font-semibold text-slate-900">
                            {name}
                          </span>
                          <span className="text-xs text-slate-500">
                            Product ID: {displayId}
                          </span>
                          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-600">
                            <span>Adet: {normalized.count}</span>
                            {unitPrice > 0 ? (
                              <>
                                <span>Birim: {formatPrice(unitPrice)}</span>
                                <span className="font-semibold text-slate-900">
                                  Ara toplam: {formatPrice(lineTotal)}
                                </span>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {(order.products ?? []).length === 0 ? (
                    <span className="text-xs text-slate-400">
                      No products in this order.
                    </span>
                  ) : null}
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
