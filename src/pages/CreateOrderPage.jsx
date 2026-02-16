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
  const appliedCoupon = useSelector(
    (state) => state.shoppingCart?.appliedCoupon ?? ''
  )
  const [step, setStep] = useState(1)
  const [addresses, setAddresses] = useState([])
  const [cards, setCards] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [selectedCardId, setSelectedCardId] = useState(null)
  const [addressForm, setAddressForm] = useState(emptyAddress)
  const [addressType, setAddressType] = useState('shipping')
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [cardForm, setCardForm] = useState(emptyCard)
  const [editingCardId, setEditingCardId] = useState(null)
  const [ccv, setCcv] = useState('')
  const [ccvError, setCcvError] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [addressErrors, setAddressErrors] = useState({})
  const [cardErrors, setCardErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedItems = cartItems.filter((item) => item.checked !== false)
  const orderSubtotal = selectedItems.reduce(
    (sum, item) => sum + (item.count ?? 0) * Number(item.product?.price ?? 0),
    0
  )
  const shipping = selectedItems.length > 0 ? 29.99 : 0
  const freeShippingDiscount = orderSubtotal > 150 ? shipping : 0
  const couponRate = appliedCoupon === 'SAVE10' ? 0.1 : 0
  const couponDiscount = orderSubtotal * couponRate
  const orderTotal = orderSubtotal - couponDiscount
  const orderGrandTotal = orderSubtotal + shipping - freeShippingDiscount - couponDiscount
  const months = Array.from({ length: 12 }, (_, index) => String(index + 1))
  const years = Array.from({ length: 12 }, (_, index) =>
    String(new Date().getFullYear() + index)
  )

  const maskCardNo = (cardNo) => {
    const digits = String(cardNo ?? '').replace(/\s+/g, '')
    if (!digits) return ''
    const last4 = digits.slice(-4)
    return `**** **** **** ${last4}`
  }

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

  const getAddressTypeFromTitle = (title) => {
    if (title?.toLowerCase().startsWith('shipping -')) return 'shipping'
    if (title?.toLowerCase().startsWith('billing -')) return 'billing'
    return 'shipping'
  }

  const stripAddressPrefix = (title) =>
    String(title ?? '')
      .replace(/^shipping\s-\s/i, '')
      .replace(/^billing\s-\s/i, '')

  const formatAddressTitle = (title, type) => {
    const cleanTitle = stripAddressPrefix(title).trim()
    const prefix = type === 'billing' ? 'Billing - ' : 'Shipping - '
    return `${prefix}${cleanTitle || 'Address'}`
  }

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
      const payloadBase = {
        ...addressForm,
        title: formatAddressTitle(addressForm.title, addressType),
      }
      if (editingAddressId) {
        const payload = { id: editingAddressId, ...payloadBase }
        await axiosClient.put('/user/address', payload)
        setAddresses((prev) =>
          prev.map((item) => (item.id === editingAddressId ? payload : item))
        )
      } else {
        const response = await axiosClient.post('/user/address', payloadBase)
        setAddresses((prev) => [...prev, response?.data ?? payloadBase])
      }
      setAddressForm(emptyAddress)
      setAddressType('shipping')
      setEditingAddressId(null)
      setAddressErrors({})
    } catch (error) {
      toast.error(error?.message || 'Failed to save address.')
    }
  }

  const handleAddressEdit = (address) => {
    setEditingAddressId(address.id)
    setAddressType(getAddressTypeFromTitle(address.title))
    setAddressForm({
      title: stripAddressPrefix(address.title ?? ''),
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
      const payloadBase = {
        ...cardForm,
        expire_month: Number(cardForm.expire_month),
        expire_year: Number(cardForm.expire_year),
      }
      if (editingCardId) {
        const payload = { id: editingCardId, ...payloadBase }
        await axiosClient.put('/user/card', payload)
        setCards((prev) =>
          prev.map((item) => (item.id === editingCardId ? payload : item))
        )
      } else {
        const response = await axiosClient.post('/user/card', payloadBase)
        setCards((prev) => [...prev, response?.data ?? payloadBase])
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
    if (!termsAccepted) {
      toast.error('Please accept the terms and conditions.')
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
      setSelectedAddressId(null)
      setSelectedCardId(null)
      setCcv('')
      setTermsAccepted(false)
      setStep(1)
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
      <h1 className="text-2xl font-semibold text-slate-900">Siparis Olustur</h1>
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
            1 Adres Bilgileri
          </button>
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`rounded-full px-4 py-2 ${
              step === 2 ? 'bg-amber-500 text-white' : 'bg-slate-100'
            }`}
          >
            2 Odeme Secenekleri
          </button>
        </div>
        <div className="flex w-full items-center gap-3 rounded bg-slate-50 px-3 py-3 text-xs text-slate-600">
          Sepetindeki urunleri bireysel veya kurumsal fatura secerek alabilirsin.
        </div>

        {step === 1 ? (
          <div className="flex w-full flex-col gap-6 lg:flex-row">
            <div className="flex w-full flex-col gap-6 lg:w-[70%]">
              <div className="flex w-full flex-col gap-6">
                <h2 className="text-lg font-semibold text-slate-900">Adresler</h2>
              {isLoading ? (
                <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Loading
                </span>
              ) : null}
              {addresses.length === 0 ? (
                <span className="text-sm text-slate-400">Adres bulunamadi.</span>
              ) : null}
              <div className="flex w-full flex-col gap-4">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Teslimat Adresleri
                </span>
                <div className="flex w-full flex-wrap gap-4">
                  {addresses
                    .filter((address) =>
                      String(address.title ?? '').toLowerCase().startsWith('shipping -')
                    )
                    .map((address) => (
                      <div
                        key={address.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedAddressId(address.id)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            setSelectedAddressId(address.id)
                          }
                        }}
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
                            onClick={(event) => {
                              event.stopPropagation()
                              handleAddressEdit(address)
                            }}
                            className="text-sky-500"
                          >
                            Duzenle
                          </button>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              handleAddressDelete(address.id)
                            }}
                            className="text-rose-500"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex w-full flex-col gap-4">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Fatura Adresleri
                </span>
                <div className="flex w-full flex-wrap gap-4">
                  {addresses
                    .filter((address) =>
                      String(address.title ?? '').toLowerCase().startsWith('billing -')
                    )
                    .map((address) => (
                      <div
                        key={address.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedAddressId(address.id)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            setSelectedAddressId(address.id)
                          }
                        }}
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
                            onClick={(event) => {
                              event.stopPropagation()
                              handleAddressEdit(address)
                            }}
                            className="text-sky-500"
                          >
                            Duzenle
                          </button>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              handleAddressDelete(address.id)
                            }}
                            className="text-rose-500"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <form className="flex w-full flex-col gap-4" onSubmit={handleAddressSubmit}>
              <h2 className="text-lg font-semibold text-slate-900">Adres Ekle</h2>
              <div className="flex w-full flex-wrap gap-2 text-xs font-semibold text-slate-500">
                <button
                  type="button"
                  onClick={() => setAddressType('shipping')}
                  className={`rounded-full px-4 py-2 ${
                    addressType === 'shipping'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100'
                  }`}
                >
                  Teslimat
                </button>
                <button
                  type="button"
                  onClick={() => setAddressType('billing')}
                  className={`rounded-full px-4 py-2 ${
                    addressType === 'billing'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100'
                  }`}
                >
                  Fatura
                </button>
              </div>
              <div className="flex w-full flex-col gap-3 sm:flex-row">
                <input
                  value={addressForm.title}
                  onChange={(event) =>
                    setAddressForm((prev) => ({ ...prev, title: event.target.value }))
                  }
                  placeholder="Adres Basligi"
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
                  placeholder="Telefon"
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
                  placeholder="Ad"
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
                  placeholder="Soyad"
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
                  <option value="">Sehir (Il)</option>
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
                  placeholder="Ilce"
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
                placeholder="Adres detayi (sokak, bina, kapi no)"
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
            </div>
            <aside className="flex w-full flex-col gap-4 lg:w-[30%]">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded bg-orange-500 px-6 py-3 text-center text-sm font-semibold text-white"
              >
                Kaydet ve Devam Et
              </button>
              <div className="flex w-full flex-col gap-3 rounded border border-slate-200 bg-white p-4">
                <h2 className="text-lg font-semibold text-slate-900">Siparis Ozeti</h2>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Urunun Toplami</span>
                  <span>{orderSubtotal.toFixed(2)} TL</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Kargo Toplam</span>
                  <span>{shipping.toFixed(2)} TL</span>
                </div>
                {(freeShippingDiscount > 0 || couponDiscount > 0) ? (
                  <div className="flex items-center justify-between text-sm text-emerald-600">
                    <span>Indirim</span>
                    <span>
                      -{(freeShippingDiscount + couponDiscount).toFixed(2)} TL
                    </span>
                  </div>
                ) : null}
                <div className="h-px w-full bg-slate-100" />
                <div className="flex items-center justify-between text-base font-semibold text-slate-900">
                  <span>Toplam</span>
                  <span>{orderGrandTotal.toFixed(2)} TL</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded bg-orange-500 px-6 py-3 text-center text-sm font-semibold text-white"
              >
                Kaydet ve Devam Et
              </button>
            </aside>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="flex w-full flex-col gap-6 lg:flex-row">
            <div className="flex w-full flex-col gap-6 lg:w-[70%]">
              <div className="flex w-full items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Kart Bilgileri</h2>
                <button
                  type="button"
                  onClick={() => setSelectedCardId(null)}
                  className="text-xs font-semibold text-slate-500 underline"
                >
                  Kayitli kartimla odeme yap
                </button>
              </div>
              <form className="flex w-full flex-col gap-4" onSubmit={handleCardSubmit}>
                <div className="flex w-full flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Kart Numarasi
                  </label>
                  <input
                    value={cardForm.card_no}
                    onChange={(event) =>
                      setCardForm((prev) => ({ ...prev, card_no: event.target.value }))
                    }
                    placeholder="Kart numarasi"
                    className="w-full rounded border border-slate-200 px-3 py-3 text-sm"
                  />
                  {cardErrors.card_no ? (
                    <span className="text-xs text-rose-500">{cardErrors.card_no}</span>
                  ) : null}
                </div>
                <div className="flex w-full flex-col gap-3 sm:flex-row">
                  <div className="flex w-full flex-col gap-2 sm:w-[35%]">
                    <label className="text-sm font-semibold text-slate-700">
                      Son Kullanma Tarihi
                    </label>
                    <div className="flex w-full gap-2">
                      <select
                        value={cardForm.expire_month}
                        onChange={(event) =>
                          setCardForm((prev) => ({
                            ...prev,
                            expire_month: event.target.value,
                          }))
                        }
                        className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm"
                      >
                        <option value="">Ay</option>
                        {months.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                      <select
                        value={cardForm.expire_year}
                        onChange={(event) =>
                          setCardForm((prev) => ({
                            ...prev,
                            expire_year: event.target.value,
                          }))
                        }
                        className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm"
                      >
                        <option value="">Yil</option>
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    {cardErrors.expire_month || cardErrors.expire_year ? (
                      <span className="text-xs text-rose-500">
                        {cardErrors.expire_month || cardErrors.expire_year}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex w-full flex-col gap-2 sm:w-[25%]">
                    <label className="text-sm font-semibold text-slate-700">CVV</label>
                    <input
                      value={ccv}
                      onChange={(event) => {
                        setCcv(event.target.value)
                        if (ccvError) setCcvError('')
                      }}
                      placeholder="CVV"
                      className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
                    />
                    {ccvError ? (
                      <span className="text-xs text-rose-500">{ccvError}</span>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" className="h-4 w-4" />
                  3D Secure ile odemek istiyorum
                </div>
                <div className="flex w-full flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Kart Uzerindeki Isim
                  </label>
                  <input
                    value={cardForm.name_on_card}
                    onChange={(event) =>
                      setCardForm((prev) => ({
                        ...prev,
                        name_on_card: event.target.value,
                      }))
                    }
                    placeholder="Kart uzerindeki isim"
                    className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
                  />
                  {cardErrors.name_on_card ? (
                    <span className="text-xs text-rose-500">
                      {cardErrors.name_on_card}
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

              <div className="flex w-full flex-col gap-4">
                <h3 className="text-sm font-semibold text-slate-700">
                  Kayitli Kartlar
                </h3>
              {isLoading ? (
                <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Loading
                </span>
              ) : null}
              <div className="flex w-full flex-wrap gap-4">
                {cards.length === 0 ? (
                  <span className="text-sm text-slate-400">Kart bulunamadi.</span>
                ) : (
                  cards.map((card) => (
                    <div
                      key={card.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedCardId(card.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          setSelectedCardId(card.id)
                        }
                      }}
                      className={`flex w-full flex-col gap-2 rounded border p-3 text-left sm:w-[calc(50%-8px)] ${
                        selectedCardId === card.id
                          ? 'border-amber-500'
                          : 'border-slate-200'
                      }`}
                    >
                      <span className="text-sm font-semibold text-slate-800">
                        {card.name_on_card}
                      </span>
                      <span className="text-xs text-slate-500">
                        {maskCardNo(card.card_no)}
                      </span>
                      <span className="text-xs text-slate-500">
                        {card.expire_month}/{card.expire_year}
                      </span>
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            handleCardEdit(card)
                          }}
                          className="text-sky-500"
                        >
                          Duzenle
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            handleCardDelete(card.id)
                          }}
                          className="text-rose-500"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="flex w-full flex-col gap-4">
              <h3 className="text-sm font-semibold text-slate-700">Taksit Secenekleri</h3>
              <div className="flex w-full flex-col rounded border border-slate-200 bg-white">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500">
                  <span>Taksit Sayisi</span>
                  <span>Aylik Odeme</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="text-orange-500">Tek Cekim</span>
                  <span className="font-semibold text-slate-700">
                    {orderGrandTotal.toFixed(2)} TL
                  </span>
                </div>
              </div>
            </div>
            </div>
            <aside className="flex w-full flex-col gap-4 lg:w-[30%]">
              <label className="flex items-start gap-2 rounded border border-slate-200 bg-white p-3 text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(event) => setTermsAccepted(event.target.checked)}
                  className="mt-0.5 h-4 w-4"
                />
                <span>
                  <a href="/pages" className="font-semibold text-slate-700">
                    On Bilgilendirme Kosullari
                  </a>{' '}
                  ve{' '}
                  <a href="/pages" className="font-semibold text-slate-700">
                    Mesafeli Satis Sozlesmesi
                  </a>{' '}
                  metnini okudum, onayliyorum.
                </span>
              </label>
              <div className="flex w-full flex-col gap-3 rounded border border-slate-200 bg-white p-4">
                <h2 className="text-lg font-semibold text-slate-900">Siparis Ozeti</h2>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Urunun Toplami</span>
                  <span>{orderSubtotal.toFixed(2)} TL</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Kargo Toplam</span>
                  <span>{shipping.toFixed(2)} TL</span>
                </div>
                {(freeShippingDiscount > 0 || couponDiscount > 0) ? (
                  <div className="flex items-center justify-between text-sm text-emerald-600">
                    <span>Indirim</span>
                    <span>
                      -{(freeShippingDiscount + couponDiscount).toFixed(2)} TL
                    </span>
                  </div>
                ) : null}
                <div className="h-px w-full bg-slate-100" />
                <div className="flex items-center justify-between text-base font-semibold text-slate-900">
                  <span>Toplam</span>
                  <span>{orderGrandTotal.toFixed(2)} TL</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCreateOrder}
                disabled={isSubmitting}
                className="rounded bg-orange-500 px-6 py-3 text-center text-sm font-semibold text-white disabled:opacity-70"
              >
                {isSubmitting ? 'Siparis Olusturuluyor...' : 'Siparis Olustur'}
              </button>
            </aside>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default CreateOrderPage
