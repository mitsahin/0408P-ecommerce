import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import axiosClient from '../api/axiosClient'
import { setCart } from '../store/actions/shoppingCartActions'

const emptyAddress = {
  title: '',
  name: '',
  surname: '',
  phone: '',
  city: '',
  district: '',
  neighborhood: '',
}

const emptyCard = {
  card_no: '',
  expire_month: '',
  expire_year: '',
  name_on_card: '',
}

const turkishCities = [
  'Adana',
  'Adiyaman',
  'Afyonkarahisar',
  'Agri',
  'Aksaray',
  'Amasya',
  'Ankara',
  'Antalya',
  'Ardahan',
  'Artvin',
  'Aydin',
  'Balikesir',
  'Bartin',
  'Batman',
  'Bayburt',
  'Bilecik',
  'Bingol',
  'Bitlis',
  'Bolu',
  'Burdur',
  'Bursa',
  'Canakkale',
  'Cankiri',
  'Corum',
  'Denizli',
  'Diyarbakir',
  'Duzce',
  'Edirne',
  'Elazig',
  'Erzincan',
  'Erzurum',
  'Eskisehir',
  'Gaziantep',
  'Giresun',
  'Gumushane',
  'Hakkari',
  'Hatay',
  'Igdir',
  'Isparta',
  'Istanbul',
  'Izmir',
  'Kahramanmaras',
  'Karabuk',
  'Karaman',
  'Kars',
  'Kastamonu',
  'Kayseri',
  'Kilis',
  'Kirikkale',
  'Kirklareli',
  'Kirsehir',
  'Kocaeli',
  'Konya',
  'Kutahya',
  'Malatya',
  'Manisa',
  'Mardin',
  'Mersin',
  'Mugla',
  'Mus',
  'Nevsehir',
  'Nigde',
  'Ordu',
  'Osmaniye',
  'Rize',
  'Sakarya',
  'Samsun',
  'Sanliurfa',
  'Siirt',
  'Sinop',
  'Sirnak',
  'Sivas',
  'Tekirdag',
  'Tokat',
  'Trabzon',
  'Tunceli',
  'Usak',
  'Van',
  'Yalova',
  'Yozgat',
  'Zonguldak',
]

const CreateOrderPage = () => {
  const dispatch = useDispatch()
  const cartItems = useSelector((state) => state.shoppingCart?.cart ?? [])
  const [step, setStep] = useState(1)
  const [addresses, setAddresses] = useState([])
  const [cards, setCards] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [selectedCardId, setSelectedCardId] = useState(null)
  const [addressForm, setAddressForm] = useState(emptyAddress)
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [cardForm, setCardForm] = useState(emptyCard)
  const [editingCardId, setEditingCardId] = useState(null)
  const [ccv, setCcv] = useState('')
  const [ccvError, setCcvError] = useState('')
  const [addressErrors, setAddressErrors] = useState({})
  const [cardErrors, setCardErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedItems = cartItems.filter((item) => item.checked !== false)
  const orderTotal = selectedItems.reduce(
    (sum, item) => sum + (item.count ?? 0) * Number(item.product?.price ?? 0),
    0
  )

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setLoadError('')
      try {
        const [addressRes, cardRes] = await Promise.all([
          axiosClient.get('/user/address'),
          axiosClient.get('/user/card'),
        ])
        setAddresses(addressRes?.data ?? [])
        setCards(cardRes?.data ?? [])
      } catch (error) {
        const message = error?.message || 'Failed to load address or card data.'
        setLoadError(message)
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const validateAddressForm = () => {
    const nextErrors = {}
    if (!addressForm.title.trim()) nextErrors.title = 'Title is required'
    if (!addressForm.name.trim()) nextErrors.name = 'Name is required'
    if (!addressForm.surname.trim()) nextErrors.surname = 'Surname is required'
    if (!addressForm.phone.trim()) {
      nextErrors.phone = 'Phone is required'
    } else if (!/^(\+90|0)?5\d{9}$/.test(addressForm.phone)) {
      nextErrors.phone = 'Enter a valid Türkiye phone number'
    }
    if (!addressForm.city.trim()) nextErrors.city = 'City is required'
    if (!addressForm.district.trim()) nextErrors.district = 'District is required'
    if (!addressForm.neighborhood.trim()) {
      nextErrors.neighborhood = 'Neighborhood is required'
    }
    setAddressErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const validateCardForm = () => {
    const nextErrors = {}
    if (!cardForm.name_on_card.trim()) nextErrors.name_on_card = 'Name is required'
    if (!/^\d{16}$/.test(cardForm.card_no)) {
      nextErrors.card_no = 'Card number must be 16 digits'
    }
    if (!/^(0?[1-9]|1[0-2])$/.test(String(cardForm.expire_month))) {
      nextErrors.expire_month = 'Month must be 1-12'
    }
    if (!/^\d{4}$/.test(String(cardForm.expire_year))) {
      nextErrors.expire_year = 'Year must be 4 digits'
    }
    setCardErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleAddressSubmit = async (event) => {
    event.preventDefault()
    if (!validateAddressForm()) return
    try {
      if (editingAddressId) {
        const payload = { id: editingAddressId, ...addressForm }
        await axiosClient.put('/user/address', payload)
        setAddresses((prev) =>
          prev.map((item) => (item.id === editingAddressId ? payload : item))
        )
      } else {
        const response = await axiosClient.post('/user/address', addressForm)
        setAddresses((prev) => [...prev, response?.data ?? addressForm])
      }
      setAddressForm(emptyAddress)
      setEditingAddressId(null)
      setAddressErrors({})
    } catch (error) {
      toast.error(error?.message || 'Failed to save address.')
    }
  }

  const handleAddressEdit = (address) => {
    setEditingAddressId(address.id)
    setAddressForm({
      title: address.title ?? '',
      name: address.name ?? '',
      surname: address.surname ?? '',
      phone: address.phone ?? '',
      city: address.city ?? '',
      district: address.district ?? '',
      neighborhood: address.neighborhood ?? '',
    })
  }

  const handleAddressDelete = async (addressId) => {
    try {
      await axiosClient.delete(`/user/address/${addressId}`)
      setAddresses((prev) => prev.filter((item) => item.id !== addressId))
    } catch (error) {
      toast.error(error?.message || 'Failed to delete address.')
    }
  }

  const handleCardSubmit = async (event) => {
    event.preventDefault()
    if (!validateCardForm()) return
    try {
      if (editingCardId) {
        const payload = { id: editingCardId, ...cardForm }
        await axiosClient.put('/user/card', payload)
        setCards((prev) =>
          prev.map((item) => (item.id === editingCardId ? payload : item))
        )
      } else {
        const response = await axiosClient.post('/user/card', cardForm)
        setCards((prev) => [...prev, response?.data ?? cardForm])
      }
      setCardForm(emptyCard)
      setEditingCardId(null)
      setCardErrors({})
    } catch (error) {
      toast.error(error?.message || 'Failed to save card.')
    }
  }

  const handleCardEdit = (card) => {
    setEditingCardId(card.id)
    setCardForm({
      card_no: card.card_no ?? '',
      expire_month: card.expire_month ?? '',
      expire_year: card.expire_year ?? '',
      name_on_card: card.name_on_card ?? '',
    })
  }

  const handleCardDelete = async (cardId) => {
    try {
      await axiosClient.delete(`/user/card/${cardId}`)
      setCards((prev) => prev.filter((item) => item.id !== cardId))
    } catch (error) {
      toast.error(error?.message || 'Failed to delete card.')
    }
  }

  const handleCreateOrder = async () => {
    if (!/^\d{3,4}$/.test(ccv)) {
      setCcvError('CCV must be 3 or 4 digits')
      toast.error('Please enter a valid CCV.')
      return
    }
    setCcvError('')
    if (!selectedAddressId || !selectedCardId || !ccv) {
      toast.error('Please select address, card, and enter CCV.')
      return
    }
    const selectedCard = cards.find((card) => card.id === selectedCardId)
    if (!selectedCard) {
      toast.error('Please select a card.')
      return
    }

    const payload = {
      address_id: selectedAddressId,
      order_date: new Date().toISOString(),
      card_no: Number(selectedCard.card_no),
      card_name: selectedCard.name_on_card,
      card_expire_month: Number(selectedCard.expire_month),
      card_expire_year: Number(selectedCard.expire_year),
      card_ccv: Number(ccv),
      price: Math.round(orderTotal),
      products: selectedItems.map((item) => ({
        product_id: Number(item.product?.id),
        count: item.count,
        detail: item.product?.detail ?? 'default',
      })),
    }

    try {
      setIsSubmitting(true)
      await axiosClient.post('/order', payload)
      toast.success('Congrats! Your order has been created.')
      dispatch(setCart([]))
    } catch (error) {
      toast.error(error?.message || 'Failed to create order.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addressButtonLabel = editingAddressId ? 'Update Address' : 'Add Address'
  const cardButtonLabel = editingCardId ? 'Update Card' : 'Add Card'

  return (
    <section className="flex w-full flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-900">Create Order</h1>
      <div className="flex w-full flex-col gap-4 rounded border border-slate-200 bg-white p-4">
        {loadError ? (
          <div className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-600">
            {loadError}
          </div>
        ) : null}
        <div className="flex w-full flex-wrap items-center gap-4 border-b border-slate-200 pb-3 text-xs font-semibold text-slate-500">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`rounded-full px-4 py-2 ${
              step === 1 ? 'bg-amber-500 text-white' : 'bg-slate-100'
            }`}
          >
            1 Address
          </button>
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`rounded-full px-4 py-2 ${
              step === 2 ? 'bg-amber-500 text-white' : 'bg-slate-100'
            }`}
          >
            2 Payment
          </button>
        </div>

        {step === 1 ? (
          <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-col gap-4">
              <h2 className="text-lg font-semibold text-slate-900">Saved Addresses</h2>
              {isLoading ? (
                <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Loading
                </span>
              ) : null}
              <div className="flex w-full flex-wrap gap-4">
                {addresses.length === 0 ? (
                  <span className="text-sm text-slate-400">No addresses found.</span>
                ) : (
                  addresses.map((address) => (
                    <button
                      key={address.id}
                      type="button"
                      onClick={() => setSelectedAddressId(address.id)}
                      className={`flex w-full flex-col gap-2 rounded border p-3 text-left sm:w-[calc(50%-8px)] ${
                        selectedAddressId === address.id
                          ? 'border-amber-500'
                          : 'border-slate-200'
                      }`}
                    >
                      <span className="text-sm font-semibold text-slate-800">
                        {address.title}
                      </span>
                      <span className="text-xs text-slate-500">
                        {address.name} {address.surname}
                      </span>
                      <span className="text-xs text-slate-500">{address.phone}</span>
                      <span className="text-xs text-slate-500">
                        {address.city} / {address.district}
                      </span>
                      <span className="text-xs text-slate-400">
                        {address.neighborhood}
                      </span>
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => handleAddressEdit(address)}
                          className="text-sky-500"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddressDelete(address.id)}
                          className="text-rose-500"
                        >
                          Delete
                        </button>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            <form className="flex w-full flex-col gap-4" onSubmit={handleAddressSubmit}>
              <h2 className="text-lg font-semibold text-slate-900">Add Address</h2>
              <div className="flex w-full flex-col gap-3 sm:flex-row">
                <input
                  value={addressForm.title}
                  onChange={(event) =>
                    setAddressForm((prev) => ({ ...prev, title: event.target.value }))
                  }
                  placeholder="Address title"
                  className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
                />
                {addressErrors.title ? (
                  <span className="text-xs text-rose-500">{addressErrors.title}</span>
                ) : null}
                <input
                  value={addressForm.phone}
                  onChange={(event) =>
                    setAddressForm((prev) => ({ ...prev, phone: event.target.value }))
                  }
                  placeholder="Phone"
                  className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
                />
                {addressErrors.phone ? (
                  <span className="text-xs text-rose-500">{addressErrors.phone}</span>
                ) : null}
              </div>
              <div className="flex w-full flex-col gap-3 sm:flex-row">
                <input
                  value={addressForm.name}
                  onChange={(event) =>
                    setAddressForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  placeholder="Name"
                  className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
                />
                {addressErrors.name ? (
                  <span className="text-xs text-rose-500">{addressErrors.name}</span>
                ) : null}
                <input
                  value={addressForm.surname}
                  onChange={(event) =>
                    setAddressForm((prev) => ({ ...prev, surname: event.target.value }))
                  }
                  placeholder="Surname"
                  className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
                />
                {addressErrors.surname ? (
                  <span className="text-xs text-rose-500">{addressErrors.surname}</span>
                ) : null}
              </div>
              <div className="flex w-full flex-col gap-3 sm:flex-row">
                <select
                  value={addressForm.city}
                  onChange={(event) =>
                    setAddressForm((prev) => ({ ...prev, city: event.target.value }))
                  }
                  className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="">Select city</option>
                  {turkishCities.map((city) => (
                    <option key={city} value={city.toLowerCase()}>
                      {city}
                    </option>
                  ))}
                </select>
                {addressErrors.city ? (
                  <span className="text-xs text-rose-500">{addressErrors.city}</span>
                ) : null}
                <input
                  value={addressForm.district}
                  onChange={(event) =>
                    setAddressForm((prev) => ({ ...prev, district: event.target.value }))
                  }
                  placeholder="District"
                  className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
                />
                {addressErrors.district ? (
                  <span className="text-xs text-rose-500">{addressErrors.district}</span>
                ) : null}
              </div>
              <textarea
                value={addressForm.neighborhood}
                onChange={(event) =>
                  setAddressForm((prev) => ({ ...prev, neighborhood: event.target.value }))
                }
                placeholder="Address details (street, building, door)"
                className="min-h-[110px] w-full rounded border border-slate-200 px-3 py-2 text-sm"
              />
              {addressErrors.neighborhood ? (
                <span className="text-xs text-rose-500">
                  {addressErrors.neighborhood}
                </span>
              ) : null}
              <button
                type="submit"
                className="w-full rounded bg-slate-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white"
              >
                {addressButtonLabel}
              </button>
            </form>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full rounded bg-amber-500 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white"
            >
              Save and Continue
            </button>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-col gap-4">
              <h2 className="text-lg font-semibold text-slate-900">Saved Cards</h2>
              {isLoading ? (
                <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Loading
                </span>
              ) : null}
              <div className="flex w-full flex-wrap gap-4">
                {cards.length === 0 ? (
                  <span className="text-sm text-slate-400">No cards found.</span>
                ) : (
                  cards.map((card) => (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => setSelectedCardId(card.id)}
                      className={`flex w-full flex-col gap-2 rounded border p-3 text-left sm:w-[calc(50%-8px)] ${
                        selectedCardId === card.id
                          ? 'border-amber-500'
                          : 'border-slate-200'
                      }`}
                    >
                      <span className="text-sm font-semibold text-slate-800">
                        {card.name_on_card}
                      </span>
                      <span className="text-xs text-slate-500">{card.card_no}</span>
                      <span className="text-xs text-slate-500">
                        {card.expire_month}/{card.expire_year}
                      </span>
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => handleCardEdit(card)}
                          className="text-sky-500"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCardDelete(card.id)}
                          className="text-rose-500"
                        >
                          Delete
                        </button>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            <form className="flex w-full flex-col gap-4" onSubmit={handleCardSubmit}>
              <h2 className="text-lg font-semibold text-slate-900">Add Card</h2>
              <input
                value={cardForm.name_on_card}
                onChange={(event) =>
                  setCardForm((prev) => ({ ...prev, name_on_card: event.target.value }))
                }
                placeholder="Name on card"
                className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
              />
              {cardErrors.name_on_card ? (
                <span className="text-xs text-rose-500">
                  {cardErrors.name_on_card}
                </span>
              ) : null}
              <input
                value={cardForm.card_no}
                onChange={(event) =>
                  setCardForm((prev) => ({ ...prev, card_no: event.target.value }))
                }
                placeholder="Card number"
                className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
              />
              {cardErrors.card_no ? (
                <span className="text-xs text-rose-500">{cardErrors.card_no}</span>
              ) : null}
              <div className="flex w-full flex-col gap-3 sm:flex-row">
                <input
                  value={cardForm.expire_month}
                  onChange={(event) =>
                    setCardForm((prev) => ({ ...prev, expire_month: event.target.value }))
                  }
                  placeholder="Expire month"
                  className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
                />
                {cardErrors.expire_month ? (
                  <span className="text-xs text-rose-500">
                    {cardErrors.expire_month}
                  </span>
                ) : null}
                <input
                  value={cardForm.expire_year}
                  onChange={(event) =>
                    setCardForm((prev) => ({ ...prev, expire_year: event.target.value }))
                  }
                  placeholder="Expire year"
                  className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
                />
                {cardErrors.expire_year ? (
                  <span className="text-xs text-rose-500">
                    {cardErrors.expire_year}
                  </span>
                ) : null}
              </div>
              <button
                type="submit"
                className="w-full rounded bg-slate-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white"
              >
                {cardButtonLabel}
              </button>
            </form>

            <div className="flex w-full flex-col gap-3 rounded border border-slate-200 bg-slate-50 p-4">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Order Summary
              </span>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Products</span>
                <span>{orderTotal.toFixed(2)} TL</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Shipping</span>
                <span>0.00 TL</span>
              </div>
              <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
                <span>Total</span>
                <span>{orderTotal.toFixed(2)} TL</span>
              </div>
              <input
                value={ccv}
                onChange={(event) => {
                  setCcv(event.target.value)
                  if (ccvError) setCcvError('')
                }}
                placeholder="Card CCV"
                className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
              />
              {ccvError ? (
                <span className="text-xs text-rose-500">{ccvError}</span>
              ) : null}
              <button
                type="button"
                onClick={handleCreateOrder}
                disabled={isSubmitting}
                className="w-full rounded bg-amber-500 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white disabled:opacity-70"
              >
                {isSubmitting ? 'Creating Order...' : 'Create Order'}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default CreateOrderPage
