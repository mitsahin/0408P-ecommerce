import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { CreditCard, Package, Tag, Truck } from 'lucide-react'
import axiosClient from '../api/axiosClient'

const formatPrice = (value) =>
  `${Number(value ?? 0).toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} TL`

const maskCard = (cardNo) => {
  const digits = String(cardNo ?? '').replace(/\D/g, '')
  if (digits.length < 4) return null
  return `**** **** **** ${digits.slice(-4)}`
}

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
  const productId = getLineProductId(line) ?? snapshot?.id ?? null
  return {
    productId,
    count: Number(line?.count ?? line?.quantity ?? 1),
    snapshot,
    rawDetail: typeof line?.detail === 'string' ? line.detail : '',
  }
}

const readLocalSummary = (orderId) => {
  try {
    const raw = localStorage.getItem(`order-summary-${orderId}`)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (_error) {
    return null
  }
}

const resolveOrderSummary = (order) => {
  const fromProducts = (order.products ?? [])
    .map((line) => parseLineSnapshot(line?.detail)?.orderSummary)
    .find(Boolean)

  const fromStorage = readLocalSummary(order.id)

  const lines = (order.products ?? []).map(normalizeOrderLine)
  const linesSubtotal = lines.reduce((sum, line) => {
    const unit = Number(line.snapshot?.price ?? 0)
    return sum + unit * line.count
  }, 0)

  const cardLast4 =
    fromProducts?.card?.last4 ||
    fromStorage?.card?.last4 ||
    String(order.card_no ?? '').replace(/\D/g, '').slice(-4) ||
    ''

  const cardName =
    fromProducts?.card?.name ||
    fromStorage?.card?.name ||
    order.card_name ||
    ''

  const expireMonth =
    fromProducts?.card?.expire_month ||
    fromStorage?.card?.expire_month ||
    order.card_expire_month

  const expireYear =
    fromProducts?.card?.expire_year ||
    fromStorage?.card?.expire_year ||
    order.card_expire_year

  const subtotal =
    fromProducts?.subtotal ??
    fromStorage?.subtotal ??
    (linesSubtotal > 0 ? linesSubtotal : null)

  const shipping = fromProducts?.shipping ?? fromStorage?.shipping ?? null
  const freeShippingDiscount =
    fromProducts?.freeShippingDiscount ?? fromStorage?.freeShippingDiscount ?? 0
  const couponCode = fromProducts?.couponCode || fromStorage?.couponCode || ''
  const couponDiscount =
    fromProducts?.couponDiscount ?? fromStorage?.couponDiscount ?? 0
  const grandTotal =
    fromProducts?.grandTotal ??
    fromStorage?.grandTotal ??
    Number(order.price ?? 0)

  return {
    subtotal,
    shipping,
    freeShippingDiscount,
    couponCode,
    couponDiscount,
    grandTotal,
    cardLast4,
    cardName,
    expireMonth,
    expireYear,
  }
}

const OrdersPage = () => {
  const location = useLocation()
  const createdOrderId = location.state?.createdOrderId
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [productMap, setProductMap] = useState({})
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true)
        const response = await axiosClient.get('/order')
        const list = Array.isArray(response?.data) ? response.data : []
        const sorted = [...list].sort((a, b) => {
          const dateA = new Date(a.order_date || 0).getTime()
          const dateB = new Date(b.order_date || 0).getTime()
          if (dateB !== dateA) return dateB - dateA
          return Number(b.id ?? 0) - Number(a.id ?? 0)
        })
        // Demo: en güncel siparişi göster; ürünü olanı tercih et
        const withProducts = sorted.find((order) => (order.products ?? []).length > 0)
        setOrders(withProducts ? [withProducts] : sorted.slice(0, 1))
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            'Siparişler yüklenemedi.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [])

  useEffect(() => {
    if (!orders.length) return

    const missingIds = [
      ...new Set(
        orders
          .flatMap((order) => order.products ?? [])
          .map((item) => {
            const snapshot = parseLineSnapshot(item?.detail)
            return getLineProductId(item) ?? snapshot?.id
          })
          .filter((id) => {
            if (id == null || id === '' || id === 0 || id === '0') return false
            if (!Number.isFinite(Number(id)) || Number(id) <= 0) return false
            return productMap[String(id)] === undefined
          })
          .map(String)
      ),
    ]

    if (missingIds.length === 0) return

    let cancelled = false
    const loadProducts = async () => {
      setIsLoadingProducts(true)
      const entries = await Promise.all(
        missingIds.map(async (productId) => {
          try {
            const response = await axiosClient.get(`/products/${productId}`)
            return [productId, response?.data ?? null]
          } catch (_error) {
            return [productId, null]
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
      setIsLoadingProducts(false)
    }

    loadProducts()
    return () => {
      cancelled = true
    }
  }, [orders, productMap])

  const formatOrderDate = (value) => {
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return value || '-'
    return parsed.toLocaleString('tr-TR')
  }

  const renderOrderLine = (order, line, index) => {
    const normalized = normalizeOrderLine(line)
    const nestedProduct =
      line?.product && typeof line.product === 'object' ? line.product : null
    const lookupId = normalized.productId ?? normalized.snapshot?.id
    const fetched = lookupId ? productMap[String(lookupId)] : null
    const snapshot = normalized.snapshot
    const source = fetched || nestedProduct

    const image =
      snapshot?.image ||
      getProductImage(source) ||
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
        (lookupId ? `Ürün #${lookupId}` : 'Ürün')
    )
    const unitPrice = Number(
      snapshot?.price ?? source?.price ?? source?.list_price ?? line?.price ?? 0
    )
    const lineTotal = unitPrice * normalized.count
    const displayId =
      lookupId && Number(lookupId) > 0 ? lookupId : snapshot?.id || '-'
    const extraDetail =
      typeof snapshot?.detail === 'string' && snapshot.detail.trim()
        ? snapshot.detail.trim()
        : ''

    return (
      <article
        key={`${order.id}-${displayId}-${index}`}
        className="flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-stretch"
      >
        <div className="flex h-36 w-full flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white sm:h-28 sm:w-28">
          {image ? (
            <img
              src={image}
              alt={name}
              className="h-full w-full object-contain object-center"
              loading="lazy"
            />
          ) : (
            <span className="flex flex-col items-center gap-1 px-2 text-center text-[10px] uppercase tracking-wide text-slate-400">
              <Package className="h-5 w-5" />
              Görsel yok
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
              {name}
            </h3>
            <p className="text-xs text-slate-500">Ürün no: {displayId}</p>
            {extraDetail ? (
              <p className="text-xs leading-5 text-slate-500">{extraDetail}</p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 sm:text-sm">
            <span className="rounded-full bg-white px-2.5 py-1 font-medium text-slate-700">
              Adet: {normalized.count}
            </span>
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
      </article>
    )
  }

  const renderPaymentSummary = (order) => {
    const summary = resolveOrderSummary(order)
    const masked =
      summary.cardLast4 && summary.cardLast4.length >= 4
        ? `**** **** **** ${summary.cardLast4}`
        : maskCard(order.card_no)
    const hasCoupon = Boolean(summary.couponCode) || Number(summary.couponDiscount) > 0
    const hasFreeShip = Number(summary.freeShippingDiscount) > 0

    return (
      <div className="flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-orange-500" />
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Ödeme, kargo ve indirim detayı
          </p>
        </div>

        <div className="flex flex-col gap-2.5 text-sm text-slate-600">
          <div className="flex items-center justify-between gap-3">
            <span>Ürünler toplamı</span>
            <span className="font-medium text-slate-800">
              {summary.subtotal != null
                ? formatPrice(summary.subtotal)
                : formatPrice(order.price)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-slate-400" />
              Kargo
            </span>
            <span className="font-medium text-slate-800">
              {summary.shipping != null
                ? formatPrice(summary.shipping)
                : hasFreeShip
                  ? formatPrice(summary.freeShippingDiscount)
                  : '—'}
            </span>
          </div>

          {hasFreeShip ? (
            <div className="flex items-center justify-between gap-3 rounded-lg bg-emerald-50 px-3 py-2 text-emerald-700">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Tag className="h-3.5 w-3.5" />
                Kargo bedava indirimi
              </span>
              <span className="font-semibold">
                -{formatPrice(summary.freeShippingDiscount)}
              </span>
            </div>
          ) : null}

          {hasCoupon ? (
            <div className="flex items-center justify-between gap-3 rounded-lg bg-emerald-50 px-3 py-2 text-emerald-700">
              <span className="inline-flex flex-wrap items-center gap-1.5 font-medium">
                <Tag className="h-3.5 w-3.5" />
                İndirim kodu
                {summary.couponCode ? (
                  <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-emerald-700">
                    {summary.couponCode}
                  </span>
                ) : null}
              </span>
              <span className="font-semibold">
                {Number(summary.couponDiscount) > 0
                  ? `-${formatPrice(summary.couponDiscount)}`
                  : 'Uygulandı'}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 text-slate-400">
              <span>İndirim kodu</span>
              <span>Kullanılmadı</span>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
            <span className="text-base font-semibold text-slate-900">
              Ödenen tutar
            </span>
            <span className="text-base font-semibold text-orange-500">
              {formatPrice(summary.grandTotal)}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-3">
          <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
            <CreditCard className="h-4 w-4" />
          </span>
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Ödeme kartı
            </span>
            <span className="font-mono text-sm font-semibold tracking-wide text-slate-900">
              {masked || 'Kart bilgisi kayıtlı değil'}
            </span>
            {summary.cardName ? (
              <span className="text-xs text-slate-500">{summary.cardName}</span>
            ) : null}
            {summary.expireMonth && summary.expireYear ? (
              <span className="text-xs text-slate-500">
                SKT {String(summary.expireMonth).padStart(2, '0')}/
                {summary.expireYear}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-slate-900">Tüm Siparişlerim</h1>
        <p className="text-sm text-slate-500">
          Ürün görselleri, indirim ve ödeme detaylarını buradan inceleyebilirsiniz.
        </p>
      </div>
      {createdOrderId ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Siparişiniz #{createdOrderId} başarıyla oluşturuldu.
        </div>
      ) : null}
      <div className="flex w-full flex-col gap-5">
        {isLoading ? (
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Yükleniyor
          </span>
        ) : null}
        {isLoadingProducts ? (
          <span className="text-xs text-slate-400">Ürün görselleri yükleniyor...</span>
        ) : null}
        {orders.length === 0 && !isLoading ? (
          <span className="text-sm text-slate-400">Henüz siparişiniz yok.</span>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="flex w-full flex-wrap items-center justify-between gap-3 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-semibold text-slate-900">
                    Sipariş #{order.id}
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatOrderDate(order.order_date)}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {order.products?.length ?? 0} ürün
                  </span>
                  <span className="text-base font-semibold text-orange-500">
                    {formatPrice(order.price)}
                  </span>
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Sipariş ürünleri
                </p>
                {(order.products ?? []).map((line, index) =>
                  renderOrderLine(order, line, index)
                )}
                {(order.products ?? []).length === 0 ? (
                  <span className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-xs text-slate-400">
                    Bu siparişte ürün kaydı yok. Yeni bir sipariş vererek detayları
                    görebilirsiniz.
                  </span>
                ) : null}
              </div>

              {renderPaymentSummary(order)}
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default OrdersPage
