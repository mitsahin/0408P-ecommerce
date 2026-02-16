import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { setAppliedCoupon, setCart, setCouponCode } from '../store/actions/shoppingCartActions'

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
  const itemsTotal = selectedItems.reduce(
    (sum, item) => sum + item.count * Number(item.product?.price ?? 0),
    0
  )
  const shipping = selectedItems.length > 0 ? 29.99 : 0
  const freeShippingDiscount = itemsTotal > 150 ? shipping : 0
  const couponRate = appliedCoupon === 'SAVE10' ? 0.1 : 0
  const couponDiscount = itemsTotal * couponRate
  const totalDiscount = freeShippingDiscount + couponDiscount
  const grandTotal = itemsTotal + shipping - totalDiscount

  const canCheckout = selectedItems.length > 0

  return (
    <section className="flex w-full flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-900">
        Sepetim ({cartItems.length} Urun)
      </h1>
      <div className="flex w-full flex-col gap-6 lg:flex-row">
        <div className="flex w-full flex-col gap-4 lg:w-[70%]">
          <div className="flex w-full flex-col gap-2 rounded border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <span>Urun</span>
            <span className="hidden sm:block">Adet</span>
            <span className="hidden sm:block">Fiyat</span>
            <span className="hidden sm:block">Sil</span>
          </div>
          {cartItems.length === 0 ? (
            <div className="rounded border border-slate-200 bg-white p-6 text-sm text-slate-500">
              Your cart is empty.
            </div>
          ) : (
            cartItems.map((item) => {
              const sellerName =
                item.product?.store?.name ||
                item.product?.brand ||
                item.product?.department ||
                'Store'
              const rating = item.product?.rating
              return (
                <div
                  key={item.product?.id}
                  className="flex w-full flex-col gap-3 rounded border border-slate-200 bg-white p-4"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
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
                    <span className="font-semibold">Satici: {sellerName}</span>
                    {rating ? (
                      <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        {Number(rating).toFixed(1)}
                      </span>
                    ) : null}
                    <span className="rounded border border-slate-200 px-1.5 py-0.5 text-[10px]">
                      Kurumsal
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                    <span className="font-semibold">Kargo Bedava!</span>
                  </div>
                  <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center">
                    <img
                      src={item.product?.image}
                      alt={item.product?.name ?? item.product?.title}
                      className="h-20 w-20 rounded border border-slate-100 bg-white object-contain"
                    />
                    <div className="flex flex-1 flex-col gap-2">
                      <span className="text-sm font-semibold text-slate-900">
                        {item.product?.name ?? item.product?.title}
                      </span>
                      <span className="text-xs text-slate-500">
                        {item.product?.description ?? 'Product detail'}
                      </span>
                      <span className="text-xs text-slate-400">
                        Beden: {item.product?.size ?? 'Tek Ebat'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateCount(item.product?.id, -1)}
                        className="flex h-8 w-8 items-center justify-center rounded border border-slate-200"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm">{item.count}</span>
                      <button
                        type="button"
                        onClick={() => updateCount(item.product?.id, 1)}
                        className="flex h-8 w-8 items-center justify-center rounded border border-slate-200"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-orange-500">
                      {Number(item.product?.price ?? 0).toFixed(2)} TL
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.product?.id)}
                      className="text-rose-500"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              )
            })
          )}
          {cartItems.length > 0 ? (
            <div className="flex w-full items-center justify-between rounded border border-slate-200 bg-white px-4 py-3 text-sm">
              <span className="font-semibold text-slate-700">
                Toplam ({selectedItems.length} Urun)
              </span>
              <span className="text-lg font-semibold text-orange-500">
                {itemsTotal.toFixed(2)} TL
              </span>
            </div>
          ) : null}
        </div>
        <aside className="flex w-full flex-col gap-4 lg:w-[30%]">
          <button
            type="button"
            disabled={!canCheckout}
            onClick={() => history.push('/order')}
            className="rounded bg-orange-500 px-6 py-3 text-center text-sm font-semibold text-white disabled:opacity-70"
          >
            Sepeti Onayla
          </button>
          <div className="flex w-full flex-col gap-3 rounded border border-slate-200 bg-white p-4">
            <h2 className="text-lg font-semibold text-slate-900">Siparis Ozeti</h2>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Urunun Toplami</span>
              <span>{itemsTotal.toFixed(2)} TL</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Kargo Toplam</span>
              <span>{shipping.toFixed(2)} TL</span>
            </div>
            {totalDiscount > 0 ? (
              <div className="flex items-center justify-between text-sm text-emerald-600">
                <span>Indirim</span>
                <span>-{totalDiscount.toFixed(2)} TL</span>
              </div>
            ) : null}
            <div className="h-px w-full bg-slate-100" />
            <div className="flex items-center justify-between text-base font-semibold text-slate-900">
              <span>Toplam</span>
              <span>{grandTotal.toFixed(2)} TL</span>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 rounded border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-600">
            <span className="text-[11px] text-slate-500">Indirim Kodu Gir</span>
            <div className="flex items-center gap-2">
              <input
                value={couponCode}
                onChange={(event) => dispatch(setCouponCode(event.target.value))}
                placeholder="Kod"
                className="flex-1 rounded border border-slate-200 px-3 py-2 text-xs text-slate-600"
              />
              <button
                type="button"
                onClick={() =>
                  dispatch(setAppliedCoupon(couponCode.trim().toUpperCase()))
                }
                className="rounded border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600"
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
                Kuponu kaldir
              </button>
            ) : null}
          </div>
          <button
            type="button"
            disabled={!canCheckout}
            onClick={() => history.push('/order')}
            className="rounded bg-orange-500 px-6 py-3 text-center text-sm font-semibold text-white disabled:opacity-70"
          >
            Sepeti Onayla
          </button>
        </aside>
      </div>
    </section>
  )
}

export default CartPage
