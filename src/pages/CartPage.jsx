import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { setCart } from '../store/actions/shoppingCartActions'

const CartPage = () => {
  const dispatch = useDispatch()
  const cartItems = useSelector((state) => state.shoppingCart?.cart ?? [])

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
  const discount = itemsTotal > 150 ? shipping : 0
  const grandTotal = itemsTotal + shipping - discount

  return (
    <section className="flex w-full flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-900">
        Sepetim ({cartItems.length} Urun)
      </h1>
      <div className="flex w-full flex-col gap-6 lg:flex-row">
        <div className="flex w-full flex-col gap-4 lg:w-[70%]">
          {cartItems.length === 0 ? (
            <div className="rounded border border-slate-200 bg-white p-6 text-sm text-slate-500">
              Your cart is empty.
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.product?.id}
                className="flex w-full flex-col gap-4 rounded border border-slate-200 bg-white p-4 sm:flex-row sm:items-center"
              >
                <button
                  type="button"
                  onClick={() => toggleChecked(item.product?.id)}
                  className={`flex h-6 w-6 items-center justify-center rounded border ${
                    item.checked !== false
                      ? 'border-amber-500 bg-amber-500 text-white'
                      : 'border-slate-300'
                  }`}
                >
                  ✓
                </button>
                <img
                  src={item.product?.image}
                  alt={item.product?.name ?? item.product?.title}
                  className="h-20 w-20 rounded bg-slate-50 object-contain"
                />
                <div className="flex flex-1 flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-900">
                    {item.product?.name ?? item.product?.title}
                  </span>
                  <span className="text-xs text-slate-500">
                    {item.product?.description ?? 'Product detail'}
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
                <span className="text-sm font-semibold text-amber-600">
                  {Number(item.product?.price ?? 0).toFixed(2)} TL
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(item.product?.id)}
                  className="text-rose-500"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
        <aside className="flex w-full flex-col gap-4 lg:w-[30%]">
          <div className="flex w-full flex-col gap-3 rounded border border-slate-200 bg-white p-4">
            <h2 className="text-lg font-semibold text-slate-900">Siparis Ozeti</h2>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Urun Toplami</span>
              <span>{itemsTotal.toFixed(2)} TL</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Kargo Toplam</span>
              <span>{shipping.toFixed(2)} TL</span>
            </div>
            <div className="flex items-center justify-between text-sm text-emerald-600">
              <span>150 TL ve Uzeri Kargo Bedava</span>
              <span>-{discount.toFixed(2)} TL</span>
            </div>
            <div className="h-px w-full bg-slate-100" />
            <div className="flex items-center justify-between text-base font-semibold text-slate-900">
              <span>Toplam</span>
              <span>{grandTotal.toFixed(2)} TL</span>
            </div>
          </div>
          <Link
            to="/order"
            className="flex w-full items-center justify-center rounded bg-amber-500 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white"
          >
            Create Order
          </Link>
        </aside>
      </div>
    </section>
  )
}

export default CartPage
