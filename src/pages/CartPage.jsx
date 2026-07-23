import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { setAppliedCoupon, setCart, setCouponCode } from '../store/actions/shoppingCartActions'

const formatPrice = (value) =>
  `${Number(value).toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} TL`

const CartPage = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const cartItems = useSelector((state) => state.shoppingCart?.cart ?? [])
  const appliedCoupon = useSelector(
    (state) => state.shoppingCart?.appliedCoupon ?? ''
  )
  const couponCode = useSelector((state) => state.shoppingCart?.couponCode ?? '')

  const toggleChecked = (productId) => {
    const updated = cartItems.map((item) =>
      String(item.product?.id) === String(productId)
        ? { ...item, checked: !item.checked }
        : item
    )
    dispatch(setCart(updated))
  }

  const updateCount = (productId, delta) => {
    const updated = cartItems
      .map((item) =>
        String(item.product?.id) === String(productId)
          ? { ...item, count: Math.max(1, item.count + delta) }
          : item
      )
      .filter((item) => item.count > 0)
    dispatch(setCart(updated))
  }

  const removeItem = (productId) => {
    dispatch(
      setCart(
        cartItems.filter(
          (item) => String(item.product?.id) !== String(productId)
        )
      )
    )
  }

  const selectedItems = cartItems.filter((item) => item.checked !== false)
  const productsTotal = selectedItems.reduce(
    (sum, item) => sum + item.count * Number(item.product?.price ?? 0),
    0
  )
  const shipping = selectedItems.length > 0 ? 29.99 : 0
  const freeShippingDiscount = productsTotal >= 150 ? shipping : 0
  const couponRate = appliedCoupon === 'SAVE10' ? 0.1 : 0
  const couponDiscount = productsTotal * couponRate
  const grandTotal = Math.max(
    0,
    productsTotal + shipping - freeShippingDiscount - couponDiscount
  )

  return (
    <section className="flex w-full flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-900 sm:text-[28px]">
        Sepetim ({cartItems.length} Ürün)
      </h1>

      <div className="flex w-full flex-col gap-6 lg:flex-row">
        {/* Product list — left */}
        <div className="flex w-full flex-col gap-4 overflow-x-auto lg:w-[70%]">
          {cartItems.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
              Sepetiniz boş.
            </div>
          ) : (
            <table className="w-full min-w-[640px] border-collapse overflow-hidden rounded-2xl border border-slate-200 bg-white text-sm shadow-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-[0.12em] text-slate-500">
                  <th className="px-4 py-3">Seç</th>
                  <th className="px-4 py-3">Ürün</th>
                  <th className="px-4 py-3">Adet</th>
                  <th className="px-4 py-3">Fiyat</th>
                  <th className="px-4 py-3">Sil</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr
                    key={item.product?.id}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    <td className="px-4 py-4 align-top">
                      <button
                        type="button"
                        onClick={() => toggleChecked(item.product?.id)}
                        className={`flex h-5 w-5 items-center justify-center rounded border ${
                          item.checked !== false
                            ? 'border-orange-500 bg-orange-500 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        ✓
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-3">
                        <img
                          src={item.product?.image}
                          alt={item.product?.name ?? item.product?.title}
                          className="h-16 w-16 rounded border border-slate-100 bg-white object-contain"
                        />
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-slate-900">
                            {item.product?.name ?? item.product?.title}
                          </span>
                          <span className="text-xs text-slate-500">
                            {item.product?.description ?? 'Product detail'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex items-center gap-2 rounded-full border border-slate-100 px-2 py-1">
                        <button
                          type="button"
                          onClick={() => updateCount(item.product?.id, -1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-sm transition hover:border-slate-300"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">
                          {item.count}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCount(item.product?.id, 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-sm transition hover:border-slate-300"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top font-semibold text-orange-500">
                      {formatPrice(item.product?.price ?? 0)}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <button
                        type="button"
                        onClick={() => removeItem(item.product?.id)}
                        className="rounded-full border border-rose-100 px-3 py-1 text-xs font-semibold text-rose-500 transition hover:border-rose-200 hover:bg-rose-50"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Order Summary box — right (T19) */}
        <aside className="flex w-full flex-col gap-3 lg:sticky lg:top-6 lg:w-[30%] lg:self-start">
          <button
            type="button"
            onClick={() => history.push('/order')}
            className="w-full rounded-lg bg-orange-500 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Create Order
          </button>

          <div className="flex w-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Sipariş Özeti</h2>

            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Ürünün Toplamı</span>
              <span>{formatPrice(productsTotal)}</span>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Kargo Toplamı</span>
              <span>{formatPrice(shipping)}</span>
            </div>

            {freeShippingDiscount > 0 ? (
              <div className="flex items-start justify-between gap-3 text-sm text-orange-500">
                <span className="leading-snug">
                  150 TL ve Üzeri Kargo Bedava (Satıcı Karşılar)
                </span>
                <span className="shrink-0 font-semibold">
                  -{formatPrice(freeShippingDiscount)}
                </span>
              </div>
            ) : null}

            {couponDiscount > 0 ? (
              <div className="flex items-center justify-between text-sm text-orange-500">
                <span>İndirim ({appliedCoupon})</span>
                <span className="font-semibold">-{formatPrice(couponDiscount)}</span>
              </div>
            ) : null}

            <div className="h-px w-full bg-slate-100" />

            <div className="flex items-center justify-between text-base font-semibold">
              <span className="text-slate-900">Toplam</span>
              <span className="text-orange-500">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-sky-600">
              + İndirim Kodu Gir
            </span>
            <div className="flex items-center gap-2">
              <input
                value={couponCode}
                onChange={(event) => dispatch(setCouponCode(event.target.value))}
                placeholder="Kod"
                className="flex-1 rounded-full border border-slate-200 px-3 py-2 text-xs text-slate-600 outline-none transition focus:border-slate-400"
              />
              <button
                type="button"
                onClick={() =>
                  dispatch(setAppliedCoupon(couponCode.trim().toUpperCase()))
                }
                className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
              >
                Uygula
              </button>
            </div>
            {appliedCoupon ? (
              <button
                type="button"
                onClick={() => {
                  dispatch(setAppliedCoupon(''))
                  dispatch(setCouponCode(''))
                }}
                className="text-left text-[11px] font-semibold text-rose-500"
              >
                Kuponu kaldır
              </button>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => history.push('/order')}
            className="w-full rounded-lg bg-orange-500 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Create Order
          </button>
        </aside>
      </div>
    </section>
  )
}

export default CartPage
